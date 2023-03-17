export type UserWordProgress = {
  wordId: number
  stage: number
  nextReview: Date
}

export type RequestUserWordProgressUpdate = {
  wordId: number
  status: boolean
}
