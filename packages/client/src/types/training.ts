import { WordForCollection } from './collection'
import { EntityId } from './common'

export type UserWordProgress = {
  wordId: number
  stage: number
  nextReview: Date
  word: Word
}

export type Word = WordForCollection & EntityId

export type RequestUserWordProgressUpdate = {
  wordId: number
  status: boolean
}
