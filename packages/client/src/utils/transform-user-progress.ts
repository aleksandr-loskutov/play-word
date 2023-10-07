import type {
  UserWordProgress,
  UserWordProgressResponse,
  RequestUserWordProgressUpdate,
} from '../types/training';

export const transformUserProgressResponse = (
  userProgressResponse: UserWordProgressResponse[] | undefined
): UserWordProgress[] => {
  if (userProgressResponse && userProgressResponse.length > 0) {
    return userProgressResponse.map((progress) => {
      const { translationId, nextReview, stage, collectionId, collection } =
        progress;
      const { wordId, word, translation } = progress.translation;
      return {
        wordId,
        translationId,
        nextReview,
        stage,
        collectionId,
        collectionName: collection.name,
        timeSpent: 0,
        word: {
          ...word,
          translation,
          sessionStage: stage === 0 ? 0 : 1,
          errorCounter: 0,
        },
      };
    });
  }
  return [];
};

export const transformUserProgressToUpdateRequest = (
  actualUserProgress: UserWordProgress[]
): RequestUserWordProgressUpdate[] =>
  actualUserProgress.map((progress) => {
    const { wordId, translationId, word } = progress;
    return {
      wordId,
      translationId,
      sessionMistakes: word.errorCounter || 0,
    };
  });
