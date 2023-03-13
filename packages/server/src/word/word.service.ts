import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WordDto } from './dto';
import { Collection } from '@prisma/client';
import { Response } from 'common';

@Injectable()
export class WordService {
  constructor(private readonly prisma: PrismaService) {}

  async getWordsByCollection(collectionId: number): Promise<WordDto[]> {
    const wordsIds = await this.prisma.wordForCollection.findMany({
      where: {
        collectionId,
      },
    });

    const words = await this.prisma.word.findMany({
      where: {
        id: {
          in: wordsIds.map((word) => word.wordId),
        },
      },
    });
    return words.map((word) => ({
      word: word.word,
      translation: word.translation,
    }));
  }

  async addWords(words: WordDto[]): Promise<WordDto[]> {
    const uniqueWords = Array.from(
      new Set(words.map((word) => JSON.stringify(word))),
    )
      .map((word) => JSON.parse(word))
      .filter((word) => Object.keys(word).length > 0);

    const newWords = await Promise.all(
      uniqueWords.map(async (word) => {
        const existingWord = await this.prisma.word.findFirst({
          where: {
            word: word.word,
            translation: word.translation,
          },
        });

        if (!existingWord) {
          return this.prisma.word.create({
            data: {
              word: word.word,
              translation: word.translation,
            },
          });
        }

        return existingWord;
      }),
    );
    return newWords;
  }

  async addWordsToCollection(
    collectionId: number,
    words: WordDto[],
  ): Promise<Response<Collection>> {
    try {
      const addedWords = await this.addWords(words);
      const existingWordsInCollection =
        await this.prisma.wordForCollection.findMany({
          where: {
            collectionId,
            wordId: { in: addedWords.map((word) => word.id) },
          },
          select: { wordId: true },
        });
      const newWords = addedWords.filter(
        (word) =>
          !existingWordsInCollection.some(
            (existingWord) => existingWord.wordId === word.id,
          ),
      );
      await this.prisma.wordForCollection.createMany({
        data: newWords.map((word) => ({
          collectionId,
          wordId: word.id,
        })),
      });

      const collection = await this.prisma.collection.findUnique({
        where: { id: collectionId },
        include: {
          words: {
            select: {
              word: true,
            },
          },
        },
      });
      return (
        collection || {
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
