import { UserWordProgress } from '../../types/training'

function getWordsReadyForTraining(training: UserWordProgress[]): number {
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
  const sortedProgressArray = userWordProgresses.sort((a, b) => {
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

export {
  getWordsReadyForTraining,
  sortUserWordProgressByDate,
  sortUserWordProgressBySessionStage,
  prepareTrainingArray,
}
