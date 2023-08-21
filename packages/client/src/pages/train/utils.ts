import {
  UserWordProgress,
  WordStats,
  WordInTraining,
} from '../../types/training'
import { UserTrainingSettings } from '../../types/user'

function getWordsReadyForTraining(training: UserWordProgress[]): number {
  if (training.length === 0) return 0
  const now = new Date()
  const wordsReadyForTraining = training.filter(
    word => new Date(word.nextReview) <= now
  )
  return wordsReadyForTraining.length
}

//deprecated
const prepareTrainingArray = (
  trainingArray: UserWordProgress[]
): UserWordProgress[] => {
  return trainingArray.map(wordProgress => ({
    ...wordProgress,
    word: {
      ...wordProgress.word,
      sessionStage: wordProgress.stage === 0 ? 0 : 1,
      errorCounter: 0,
    },
  }))
}

const sortUserWordProgressByDate = (
  userWordProgresses: UserWordProgress[]
): UserWordProgress[] => {
  const sortedProgressArray = [...userWordProgresses].sort((a, b) => {
    const nextReviewA = new Date(a.nextReview)
    const nextReviewB = new Date(b.nextReview)
    return nextReviewA.getTime() - nextReviewB.getTime()
  })
  return sortedProgressArray
}

const sortUserWordProgressBySessionStage = (
  progressArray: UserWordProgress[]
): UserWordProgress[] => {
  const sortedProgressArray = progressArray.sort(
    (a, b) => a.word.sessionStage - b.word.sessionStage
  )
  return sortedProgressArray
}

const reverseWordAndTranslation = (
  userWordProgress: UserWordProgress
): UserWordProgress => {
  return {
    ...userWordProgress,
    word: {
      ...userWordProgress.word,
      word: userWordProgress.word.translation,
      translation: userWordProgress.word.word,
    },
  }
}

const getWordStats = (
  arr: UserWordProgress[],
  userSettings: UserTrainingSettings
): WordStats[] => {
  const trainingStatsArray: WordStats[] = arr.map(item => {
    const {
      word,
      word: { errorCounter },
      collectionName,
      stage,
      timeSpent,
    } = item
    const { translation } = word

    const nextStage = stage === 0 ? 1 : errorCounter === 0 ? stage + 1 : stage
    const oneDayFromNow = new Date(Date.now() + 24 * 3600 * 1000)
    const nextReview =
      errorCounter === 0
        ? calculateNextTrainingDate(nextStage, userSettings)
        : oneDayFromNow

    return {
      word: word.word,
      translation,
      collectionName,
      stage: nextStage,
      timeSpent,
      nextReview,
      errorCounter,
    }
  })

  return trainingStatsArray
}

function calculateNextTrainingDate(
  stage: number,
  userSettings: UserTrainingSettings
) {
  const stageIntervals = [
    0, // Stage 0 has an immediate review
    userSettings.stageOneInterval,
    userSettings.stageTwoInterval,
    userSettings.stageThreeInterval,
    userSettings.stageFourInterval,
    userSettings.stageFiveInterval,
  ]

  const interval = stageIntervals[Math.min(stage, stageIntervals.length - 1)]
  return new Date(Date.now() + interval * 24 * 3600 * 1000)
}

const getTotalTimeSpent = (words: WordStats[]): number => {
  return words.reduce((total, word) => total + word.timeSpent, 0)
}

export {
  getWordsReadyForTraining,
  sortUserWordProgressByDate,
  sortUserWordProgressBySessionStage,
  prepareTrainingArray,
  reverseWordAndTranslation,
  getWordStats,
  calculateNextTrainingDate,
  getTotalTimeSpent,
}
