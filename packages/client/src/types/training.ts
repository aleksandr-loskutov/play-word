import { Collection, WordForCollection } from './collection';
import { EntityId } from './common';

export type UserWordProgress = {
  wordId: number;
  translationId: number;
  collectionId: number;
  stage: number;
  nextReview: Date;
  collectionName: string;
  timeSpent: number;
  word: WordInTraining;
};

export type Word = WordForCollection;

//{ sessionStage: number; errorCounter: number }
export type WordInTraining = WordForCollection &
  EntityId & { sessionStage: number; errorCounter: number };

export type RequestUserWordProgressUpdate = {
  wordId: number;
  translationId: number;
  sessionMistakes: number;
};

export type TranslationResponse = {
  id: number;
  wordId: number;
  translation: string;
};

export type WordResponse = {
  id: number;
  word: string;
};

type CollectionPropsForUserProgressResponse = { name: string };

export type UserWordProgressResponse = {
  userId: number;
  translationId: number;
  collectionId: number;
  nextReview: Date;
  stage: number;
  mistakes: number;
  collection: CollectionPropsForUserProgressResponse;
  translation: TranslationResponse & { word: WordResponse };
};

export type WordStats = {
  word: string;
  translation: string;
  stage: number;
  errorCounter: number;
  collectionName: string;
  nextReview: Date;
  timeSpent: number;
};

export type TrainingStats = {
  trainingStats: WordStats[];
  extraStats: {
    totalTimeSpent: number;
    moreToLearn: number;
    currentDayProgress: number;
  };
};
