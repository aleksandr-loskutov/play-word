import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Collection } from '@prisma/client';

import {
  CollectionWithWords,
  RequestCollectionCreate,
  RequestCollectionUpdate,
  UserWordProgressResponse,
} from './dto';
import { Response } from 'common';

@Injectable()
export class CollectionService {
  constructor(private prisma: PrismaService) {}

  async getUserCollections(
    userId: number,
  ): Promise<Response<CollectionWithWords[]>> {
    try {
      const data = await this.prisma.collection.findMany({
        where: { userId, deleted: false },
        include: {
          words: {
            select: {
              word: true,
            },
          },
        },
      });
      const collectionsWithWords = data.map((collection) => ({
        ...collection,
        words: collection.words.map(({ word }) => ({
          ...word,
        })),
      }));
      return collectionsWithWords || { error: `Cannot get user collections` };
    } catch (error: any) {
      return { error: `Cannot get user collections. ${error.message}` };
    }
  }

  async createCollection(
    collection: RequestCollectionCreate,
    userId: number,
  ): Promise<Response<Collection>> {
    try {
      const data = await this.prisma.collection.create({
        data: {
          ...collection,
          createdBy: { connect: { id: userId } },
        },
      });
      return data || { error: `Cannot create collection` };
    } catch (error: any) {
      return { error: `Cannot create collection. ${error.message}` };
    }
  }

  async getPublicCollections(): Promise<Response<CollectionWithWords[]>> {
    try {
      const data = await this.prisma.collection.findMany({
        where: { isPublic: true, deleted: false },
        include: {
          words: {
            select: {
              word: true,
            },
          },
        },
      });
      const collectionsWithWords = data.map((collection) => ({
        ...collection,
        words: collection.words.map(({ word }) => ({
          ...word,
        })),
      }));
      return collectionsWithWords || { error: `Cannot get public collections` };
    } catch (error: any) {
      return { error: `Cannot get public collections. ${error.message}` };
    }
  }

  //soft delete
  async deleteCollection(
    collectionId: number,
    userId: number,
  ): Promise<Response<Collection>> {
    try {
      const collection = await this.prisma.collection.findUnique({
        where: { id: collectionId },
        select: { id: true, userId: true, isPublic: true },
      });
      console.log('collection', collection);
      if (!collection)
        return {
          error: `No collection found with id: ${collectionId}`,
        };
      if (collection.userId !== userId)
        return {
          error: `Unauthorized access to delete collection: ${collectionId}`,
        };
      const deletedCollection = await this.prisma.collection.update({
        where: { id: collection.id },
        data: { deleted: true, isPublic: false },
      });

      return (
        deletedCollection || {
          error: `Failed to delete collection with id: ${collectionId}`,
        }
      );
    } catch (error: any) {
      return {
        error: `Failed to delete collection with id: ${collectionId}. ${error.message}`,
      };
    }
  }

  //learn collection
  async addCollectionWordsToUserProgress(
    collectionId: number,
    userId: number,
  ): Promise<Response<UserWordProgressResponse>> {
    try {
      const collection = await this.prisma.collection.findUnique({
        where: { id: collectionId },
        select: {
          userId: true,
          isPublic: true,
          words: { select: { wordId: true } },
        },
      });
      if (!collection) {
        return {
          error: `Collection with id "${collectionId}" not found.`,
        };
      }
      if (!collection.words || collection.words.length < 1) {
        return {
          error: `Collection with id "${collectionId}" is empty.`,
        };
      }
      // Check if user owns the collection or it's public
      if (collection.userId !== userId && !collection.isPublic) {
        return {
          error: `User is not authorized to learn this collection.`,
        };
      }

      const collectionWords = collection.words;

      const userWordProgresses = await this.prisma.userWordProgress.findMany({
        where: {
          userId,
          wordId: {
            in: collectionWords.map((cw) => cw.wordId),
          },
        },
        select: { wordId: true },
      });
      const existingIds = userWordProgresses.map((uwp) => uwp.wordId);

      const newWordProgresses = collectionWords
        .filter((cw) => !existingIds.includes(cw.wordId))
        .map((cw) => ({
          userId,
          wordId: cw.wordId,
          nextReview: new Date(),
          stage: 0,
        }));

      await this.prisma.userWordProgress.createMany({
        data: newWordProgresses,
      });
      const userProgress = await this.prisma.userWordProgress.findMany({
        where: { userId },
        include: {
          word: true,
        },
      });
      return userProgress;
    } catch (error: any) {
      return {
        error: `Cannot update userWordProgress with words from collection id "${collectionId}". ${error.message}`,
      };
    }
  }

  async deleteCollectionWordsFromUserProgress(
    collectionId: number,
    userId: number,
  ): Promise<Response<UserWordProgressResponse>> {
    try {
      const collection = await this.prisma.collection.findUnique({
        where: { id: collectionId },
        select: {
          userId: true,
          isPublic: true,
          words: { select: { wordId: true } },
        },
      });
      if (!collection) {
        return {
          error: `Collection with id "${collectionId}" not found.`,
        };
      }
      if (!collection.words || collection.words.length < 1) {
        return {
          error: `Collection with id "${collectionId}" is empty.`,
        };
      }
      // Check if user owns the collection or it's public
      if (collection.userId !== userId && !collection.isPublic) {
        return {
          error: `User is not authorized to this collection.`,
        };
      }

      await this.prisma.userWordProgress.deleteMany({
        where: {
          userId,
          wordId: {
            in: collection.words.map((cw) => cw.wordId),
          },
        },
      });

      const userProgress = await this.prisma.userWordProgress.findMany({
        where: { userId },
        include: {
          word: true,
        },
      });
      return userProgress;
    } catch (error: any) {
      return {
        error: `Cannot update collection with id "${collectionId}". ${error.message}`,
      };
    }
  }

  async getUserTraining(
    userId: number,
  ): Promise<Response<UserWordProgressResponse>> {
    try {
      const userProgress = await this.prisma.userWordProgress.findMany({
        where: { userId },
        include: { word: true },
      });

      return userProgress;
    } catch (error: any) {
      return {
        error: `Cannot get user training. ${error.message}`,
      };
    }
  }

  async updateCollection(
    collectionId: number,
    userId: number,
    payload: RequestCollectionUpdate,
  ): Promise<Response<Collection>> {
    try {
      const collection = await this.prisma.collection.findUnique({
        where: { id: collectionId },
      });
      if (!collection) {
        return {
          error: `Collection with id "${collectionId}" not found.`,
        };
      }
      if (collection.userId !== userId) {
        return {
          error: `Unauthorized access to update collection: ${collectionId}`,
        };
      }
      const data = await this.prisma.collection.update({
        data: payload,
        where: { id: collectionId },
        include: {
          words: {
            select: {
              word: true,
            },
          },
        },
      });
      const collectionWithWords = {
        ...data,
        words: data.words.map(({ word }) => ({
          ...word,
        })),
      };
      return (
        collectionWithWords || {
          error: `Cannot update collection with id "${collectionId}"`,
        }
      );
    } catch (error: any) {
      return {
        error: `Cannot update collection with id "${collectionId}". ${error.message}`,
      };
    }
  }
}
