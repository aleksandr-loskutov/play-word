import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Collection } from '@prisma/client';
import { calculateNextTrainingDate } from './utils/calculateNextTrainingDate';

import {
  CollectionWithWords,
  RequestCollectionCreate,
  RequestCollectionUpdate,
  RequestUserTrainingUpdate,
  UserWordProgressExtended,
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
              translation: true,
            },
          },
        },
      });
      const collectionsWithWords = data.map((collection) => ({
        ...collection,
        words: collection.words.map(({ word, translation }) => ({
          ...word,
          translation: translation.translation,
          translationId: translation.id,
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
  ): Promise<Response<CollectionWithWords>> {
    try {
      const data = await this.prisma.collection.create({
        data: {
          ...collection,
          createdBy: { connect: { id: userId } },
        },
      });
      return { ...data, words: [] } || { error: `Cannot create collection` };
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
              translation: true,
            },
          },
        },
      });

      const collectionsWithWords = data.map((collection) => ({
        ...collection,
        words: collection.words.map(({ word, translation }) => ({
          ...word,
          translation: translation.translation,
          translationId: translation.id,
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
      const isOwner = await this.isUserOwnsCollection(userId, collectionId);
      if (!isOwner) {
        return {
          error: `Unauthorized access to delete collection: ${collectionId}`,
        };
      }

      const deletedCollection = await this.prisma.collection.update({
        where: { id: collectionId },
        data: { deleted: true, isPublic: false },
      });

      return deletedCollection;
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

      const collectionWords = await this.prisma.wordForCollection.findMany({
        where: { collectionId },
        // include: {
        //   word: true,
        // },
      });
      const userWordProgresses = await this.prisma.userWordProgress.findMany({
        where: {
          userId,
          translationId: {
            in: collectionWords.map((cw) => cw.translationId),
          },
        },
        select: { translationId: true },
      });
      const existingIds = userWordProgresses.map((uwp) => uwp.translationId);

      const newWordProgresses = collectionWords
        .filter((cw) => !existingIds.includes(cw.translationId))
        .map(({ translationId, collectionId }) => ({
          userId,
          translationId,
          collectionId,
          nextReview: new Date(),
          stage: 0,
        }));

      await this.prisma.userWordProgress.createMany({
        data: newWordProgresses,
      });
      const userProgress = await this.getUserProgress(userId);
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
          words: { select: { translationId: true } },
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
      if (collection.userId !== userId && !collection.isPublic) {
        return {
          error: `User is not authorized to this collection.`,
        };
      }

      await this.prisma.userWordProgress.deleteMany({
        where: {
          userId,
          translationId: {
            in: collection.words.map((cw) => cw.translationId),
          },
        },
      });

      const userProgress = await this.getUserProgress(userId);
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
      const userProgress = await this.getUserProgress(userId);

      return userProgress;
    } catch (error: any) {
      return {
        error: `Cannot get user training progress. ${error.message}`,
      };
    }
  }

  async updateUserTraining(
    trainingToUpdate: RequestUserTrainingUpdate[],
    userId: number,
  ): Promise<Response<UserWordProgressExtended[]>> {
    try {
      const userSettings = await this.prisma.userTrainingSettings.findUnique({
        where: { userId },
      });
      if (!userSettings || trainingToUpdate.length === 0) return [];

      const userProgress = await this.getUserProgress(userId);
      for (const trainingItem of trainingToUpdate) {
        const { wordId, translationId, sessionMistakes } = trainingItem;

        const progressToUpdate = userProgress.find(
          (progress) =>
            progress.translation.id === translationId &&
            progress.translation.wordId === wordId,
        );

        if (progressToUpdate) {
          const { stage, mistakes } = progressToUpdate;
          const nextStage =
            stage === 0 ? 1 : sessionMistakes === 0 ? stage + 1 : stage;
          const updatedMistakes = mistakes + sessionMistakes;
          const oneDayFromNow = new Date(Date.now() + 24 * 3600 * 1000);
          const nextReview =
            sessionMistakes === 0
              ? calculateNextTrainingDate(nextStage, userSettings)
              : oneDayFromNow;

          try {
            const updatedProgress = await this.prisma.userWordProgress.update({
              where: { userId_translationId: { userId, translationId } },
              data: {
                mistakes: updatedMistakes,
                stage: nextStage,
                nextReview,
              },
            });
            if (updatedProgress) {
              userProgress.splice(userProgress.indexOf(progressToUpdate), 1);
            }
          } catch (error: any) {
            return {
              error: `Cannot update user progress. ${error.message}`,
            };
          }
        }
      }

      return userProgress;
    } catch (error: any) {
      return {
        error: `Cannot update user progress. ${error.message}`,
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
              translation: true,
            },
          },
        },
      });
      const collectionWithWords = {
        ...data,
        words: data.words.map(({ word, translation }) => ({
          ...word,
          translation: translation.translation,
          translationId: translation.id,
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

  async getUserProgress(userId: number): Promise<UserWordProgressExtended[]> {
    try {
      const currentDate = new Date();
      const userProgress = await this.prisma.userWordProgress.findMany({
        where: {
          userId,
          stage: { lt: 6 }, // Filter records where the stage is less than 6 (training finished)
          nextReview: {
            lt: currentDate, // Filter records where the nextReview date is less than the current date
          },
        },
        include: {
          translation: {
            include: {
              word: true,
            },
          },
          collection: { select: { name: true } },
        },
      });

      if (!userProgress || userProgress.length === 0) {
        return [];
      }

      return userProgress;
    } catch (error: any) {
      return [];
    }
  }

  async isUserOwnsCollection(
    userId: number,
    collectionId: number,
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
