import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WordDto } from './dto';
import { Response } from 'common';
import { WordWithTranslations } from 'word';
import { CollectionWithWords } from '../collection/dto';
import { handleError } from '../common/utils';

@Injectable()
export class WordService {
  constructor(private readonly prisma: PrismaService) {}

  async getWordsByCollection(collectionId: number): Promise<WordDto[]> {
    try {
      const words = await this.prisma.wordForCollection.findMany({
        where: {
          collectionId,
        },
        include: {
          word: {
            include: {
              translations: true,
            },
          },
        },
      });

      return words.map((wordForCollection) => ({
        word: wordForCollection.word.word,
        translation: wordForCollection.word.translations[0]?.translation,
      }));
    } catch (error: any) {
      handleError(error);
    }
  }

  async addWords(words: WordDto[]): Promise<WordWithTranslations[]> {
    try {
      const uniqueWords = Array.from(
        new Set(words.map((word) => JSON.stringify(word))),
      )
        .map((word) => JSON.parse(word))
        .filter((word) => Object.keys(word).length > 0);

      const newWords: WordWithTranslations[] = [];

      for (const word of uniqueWords) {
        const existingWord = await this.prisma.word.findFirst({
          where: {
            word: word.word,
          },
          include: {
            translations: {
              where: {
                translation: word.translation,
              },
            },
          },
        });

        if (!existingWord) {
          const createdWord = await this.prisma.word.create({
            data: {
              word: word.word,
              translations: {
                create: {
                  translation: word.translation,
                },
              },
            },
            include: {
              translations: true,
            },
          });

          newWords.push(createdWord);
        } else if (!existingWord.translations.length) {
          const createdTranslation = await this.prisma.translation.create({
            data: {
              wordId: existingWord.id,
              translation: word.translation,
            },
          });
          existingWord.translations.push(createdTranslation);
          newWords.push(existingWord);
        } else {
          newWords.push(existingWord);
        }
      }
      return newWords;
    } catch (error: any) {
      handleError(error);
    }
  }

  async updateCollectionWords(
    collectionId: number,
    words: WordDto[],
    userId: number,
  ): Promise<Response<CollectionWithWords>> {
    try {
      const isUserOwnsCollection = await this.isUserOwnsCollection(
        collectionId,
        userId,
      );
      if (!isUserOwnsCollection) {
        throw new ForbiddenException(
          `Доступ запрещен для коллекции: ${collectionId}`,
        );
      }
      // Adds or finds words and their translations in one go
      const addedWords = await this.addWords(words);

      const currentWordsInCollection =
        await this.prisma.wordForCollection.findMany({
          where: { collectionId },
          select: { wordId: true, translationId: true },
        });

      const idsToDelete = currentWordsInCollection
        .filter(
          (current) =>
            !addedWords.some(
              (newWord) =>
                newWord.id === current.wordId &&
                newWord.translations?.some(
                  (translation) => translation.id === current.translationId,
                ),
            ),
        )
        .map((item) => item.wordId);

      await this.prisma.wordForCollection.deleteMany({
        where: {
          collectionId,
          wordId: { in: idsToDelete },
        },
      });

      // Add the new words
      const translationIds = addedWords.reduce((ids: number[], word) => {
        if (word.translations && Array.isArray(word.translations)) {
          const translationIds = word.translations.map(
            (translation) => translation.id,
          );
          return [...ids, ...translationIds];
        }
        return ids;
      }, []);

      const existingWordsInCollection =
        await this.prisma.wordForCollection.findMany({
          where: {
            collectionId,
            wordId: { in: addedWords.map((word) => word.id) },
            translationId: { in: translationIds },
          },
          select: { wordId: true, translationId: true },
        });

      const newWords = addedWords.filter((word) => {
        return !existingWordsInCollection.some((existingWord) => {
          return (
            existingWord.wordId === word.id &&
            word.translations?.some(
              (translation) => existingWord.translationId === translation.id,
            )
          );
        });
      });

      if (newWords.length > 0) {
        await this.prisma.wordForCollection.createMany({
          data: newWords.map((word: WordWithTranslations) => {
            const translation = word.translations.find(
              (translation) => translation.wordId === word.id,
            );
            return {
              collectionId,
              wordId: word.id,
              translationId: translation?.id,
            };
          }),
        });
      }

      const collection = await this.prisma.collection.findUnique({
        where: { id: collectionId },
        include: {
          words: {
            select: {
              word: true,
              translation: true,
            },
          },
        },
      });

      const collectionWithWords = {
        ...collection,
        words: collection.words.map(({ word, translation }) => ({
          id: word.id,
          word: word.word,
          translation: translation.translation,
          translationId: translation.id,
        })),
      };

      return collectionWithWords;
    } catch (error: any) {
      handleError(error);
    }
  }

  async isUserOwnsCollection(
    collectionId: number,
    userId: number,
  ): Promise<boolean> {
    const collection = await this.prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId,
      },
    });
    return Boolean(collection);
  }
}
