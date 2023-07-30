import {
  UserWordProgress,
  UserWordProgressResponse,
  RequestUserWordProgressUpdate,
} from '../types/training'

export const transformUserProgressResponse = (
  userProgressResponse: UserWordProgressResponse[] | undefined
): UserWordProgress[] => {
  if (userProgressResponse && userProgressResponse.length > 0) {
    return userProgressResponse.map(progress => {
      const { translationId, nextReview, stage, collectionId, collection } =
        progress
      const { wordId, word, translation } = progress.translation
      return {
        wordId,
        translationId,
        nextReview,
        stage,
        collectionId,
        collectionName: collection.name,
        word: { ...word, translation },
      }
    })
  }
  return []
}

export const transformUserProgressToUpdateRequest = (
  actualUserProgress: UserWordProgress[]
): RequestUserWordProgressUpdate[] => {
  return actualUserProgress.map(progress => {
    const { wordId, translationId, word } = progress
    return {
      wordId,
      translationId,
      sessionMistakes: word.errorCounter || 0,
    }
  })
}