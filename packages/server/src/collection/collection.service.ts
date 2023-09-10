import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Collection } from '@prisma/client';
import { Response } from 'common';
import { PrismaService } from '../prisma/prisma.service';
import { calculateNextTrainingDate } from './utils/calculateNextTrainingDate';

import {
  CollectionWithWords,
  RequestCollectionCreateDto,
  RequestCollectionUpdateDto,
  RequestUserTrainingUpdate,
  UserWordProgressExtended,
} from './dto';
import {
  handleError,
  validateUserTrainingUpdatePayloadArray,
} from '../common/utils';
import { cacheManager } from '../common/utils/memCache';

@Injectable()
export class CollectionService {
  constructor(private prisma: PrismaService) {}

  async getCollections(
    userId: number,
  ): Promise<Response<CollectionWithWords[]>> {
    try {
      const data = await this.prisma.collection.findMany({
        where: {
          OR: [
            { userId, deleted: false },
            { isPublic: true, deleted: false },
          ],
        },
        include: {
          words: {
            select: {
              word: true,
              translation: true,
            },
          },
        },
      });

      // Map the data to include word and translation details
      const collectionsWithWords = data.map((collection) => ({
        ...collection,
        words: collection.words.map(({ word, translation }) => ({
          ...word,
          translation: translation.translation,
          translationId: translation.id,
        })),
      }));

      return collectionsWithWords;
    } catch (error: any) {
      handleError(error);
    }
  }

  async createCollection(
    collection: RequestCollectionCreateDto,
    userId: number,
  ): Promise<Response<CollectionWithWords>> {
    try {
      const data = await this.prisma.collection.create({
        data: {
          ...collection,
          createdBy: { connect: { id: userId } },
        },
      });
      return { ...data, words: [] };
    } catch (error: any) {
      handleError(error);
    }
  }

  async getPublicCollections(): Promise<Response<Collection[]>> {
    try {
      const cacheKey = 'publicCollections';
      if (!cacheManager.isStale(cacheKey)) {
        return cacheManager.get(cacheKey);
      }

      const data = await this.prisma.collection.findMany({
        where: { isPublic: true, deleted: false },
        include: {
          words: true,
        },
      });

      cacheManager.set(cacheKey, data);
      return data;
    } catch (error: any) {
      handleError(error);
    }
  }

  // soft delete
  async deleteCollection(
    collectionId: number,
    userId: number,
  ): Promise<Response<Collection>> {
    try {
      const isOwner = await this.isUserOwnsCollection(userId, collectionId);
      if (!isOwner) {
        throw new ForbiddenException('Доступ запрещен');
      }

      const deletedCollection = await this.prisma.collection.update({
        where: { id: collectionId },
        data: { deleted: true, isPublic: false },
      });

      return deletedCollection;
    } catch (error: any) {
      handleError(error);
    }
  }

  // learn collection
  async addCollectionWordsToUserProgress(
    collectionId: number,
    userId: number,
  ): Promise<Response<UserWordProgressExtended[]>> {
    try {
      const collection = await this.prisma.collection.findUnique({
        where: { id: collectionId },
        select: {
          userId: true,
          isPublic: true,
          words: { select: { wordId: true } },
        },
      });

      this.checkUserAccessToCollection(collection, userId);

      const collectionWords = await this.prisma.wordForCollection.findMany({
        where: { collectionId },
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
      handleError(error);
    }
  }

  checkUserAccessToCollection(
    collection: Partial<Collection> & {
      words: { translationId?: number; wordId?: number }[];
    },
    userId: number,
  ): void {
    if (!collection) {
      throw new NotFoundException(`Коллекция не найдена.`);
    }
    if (!collection.words || collection.words.length < 1) {
      throw new BadRequestException(`Коллекция "${collection.id}" пустая.`);
    }
    // Check if user owns the collection or it's public
    if (collection.userId !== userId && !collection.isPublic) {
      throw new ForbiddenException('Доступ запрещен!!');
    }
  }

  async deleteCollectionWordsFromUserProgress(
    collectionId: number,
    userId: number,
  ): Promise<Response<UserWordProgressExtended[]>> {
    try {
      const collection = await this.prisma.collection.findUnique({
        where: { id: collectionId },
        select: {
          userId: true,
          isPublic: true,
          words: { select: { translationId: true } },
        },
      });
      this.checkUserAccessToCollection(collection, userId);

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
      handleError(error);
    }
  }

  async getUserTraining(
    userId: number,
  ): Promise<Response<UserWordProgressExtended[]>> {
    try {
      const userProgress = await this.getUserProgress(userId);

      return userProgress;
    } catch (error: any) {
      handleError(error);
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
      if (!userSettings) return [];
      const userProgress = await this.getUserProgress(userId);
      if (
        trainingToUpdate.length === 0 ||
        trainingToUpdate.length > userSettings.wordsPerSession ||
        !validateUserTrainingUpdatePayloadArray(trainingToUpdate)
      )
        return userProgress;

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
        }
      }

      return userProgress;
    } catch (error: any) {
      handleError(error);
    }
  }

  async updateCollection(
    collectionId: number,
    userId: number,
    payload: RequestCollectionUpdateDto,
  ): Promise<Response<Collection>> {
    try {
      const collection = await this.prisma.collection.findUnique({
        where: { id: collectionId },
      });
      if (!collection || collection.userId !== userId) {
        throw new ForbiddenException(
          `"Коллекция ${collectionId}" не найдена или у вас нет доступа.`,
        );
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

      return collectionWithWords;
    } catch (error: any) {
      handleError(error);
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
      handleError(error);
    }
  }

  async isUserOwnsCollection(
    userId: number,
    collectionId: number,
  ): Promise<boolean> {
    try {
      const collection = await this.prisma.collection.findFirst({
        where: {
          id: collectionId,
          userId,
        },
      });
      return Boolean(collection);
    } catch (error: any) {
      handleError(error);
    }
  }
}
