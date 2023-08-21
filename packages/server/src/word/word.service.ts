import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WordDto } from './dto';
import { Response } from 'common';
import { WordWithTranslations } from 'word';
import { CollectionWithWords } from '../collection/dto';

@Injectable()
export class WordService {
  constructor(private readonly prisma: PrismaService) {}

  async getWordsByCollection(collectionId: number): Promise<WordDto[]> {
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
  }

  async addWords(words: WordDto[]): Promise<WordWithTranslations[]> {
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
  }

  async addWordsToCollection(
    collectionId: number,
    words: WordDto[],
  ): Promise<Response<CollectionWithWords>> {
    try {
      const addedWords = await this.addWords(words);
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

      return (
        collectionWithWords || {
          error: `Failed to add words to collection with id ${collectionId}`,
        }
      );
    } catch (error: any) {
      return {
        error: `Cannot add words to collection with id "${collectionId}". ${error.message}`,
      };
    }
  }
}
