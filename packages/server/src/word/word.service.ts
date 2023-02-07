import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WordDto } from './dto';
import { CollectionWordDto } from '../collection/dto';

@Injectable()
export class WordService {
  constructor(private readonly prisma: PrismaService) {}

  async getWordsByCollection(collectionId: number): Promise<WordDto[]> {
    const wordsIds = await this.prisma.collectionWord.findMany({
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
    ).map((word) => JSON.parse(word));

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
  ): Promise<CollectionWordDto[]> {
    const addedWords = await this.addWords(words);
    const existingWordsInCollection = await this.prisma.collectionWord.findMany(
      {
        where: {
          collectionId,
          wordId: {
            in: addedWords.map((word) => word.id),
          },
        },
      },
    );
    const newWords = addedWords.filter((word) => {
      return !existingWordsInCollection.find(
        (existingWord) => existingWord.wordId === word.id,
      );
    });

    const result = await this.prisma.$transaction(
      newWords.map((word) =>
        this.prisma.collectionWord.create({
          data: {
            collectionId,
            wordId: word.id,
          },
        }),
      ),
    );
    return result;
  }
}
