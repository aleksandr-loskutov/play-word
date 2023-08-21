import { createSlice } from '@reduxjs/toolkit'
import {
  getTraining,
  updateTraining,
  addCollectionWordsForTraining,
  removeCollectionWordsFromTraining,
} from '../action-creators/training'

import {
  setFulfilledTraining,
  setPending,
  setRejected,
  TrainingState,
} from './common'
import { UserWordProgress } from '../../types/training'

const initialState: TrainingState = {
  training: [],
  isLoading: false,
  error: null,
}

const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      getTraining.fulfilled.type,
      setFulfilledTraining<TrainingState, UserWordProgress[]>
    )
    builder.addCase(getTraining.pending.type, setPending<TrainingState>)
    builder.addCase(
      getTraining.rejected.type,
      setRejected<TrainingState, string>
    )

    builder.addCase(
      addCollectionWordsForTraining.fulfilled.type,
      setFulfilledTraining<TrainingState, UserWordProgress[]>
    )
    builder.addCase(
      addCollectionWordsForTraining.pending.type,
      setPending<TrainingState>
    )
    builder.addCase(
      addCollectionWordsForTraining.rejected.type,
      setRejected<TrainingState, string>
    )

    builder.addCase(
      removeCollectionWordsFromTraining.fulfilled.type,
      setFulfilledTraining<TrainingState, UserWordProgress[]>
    )
    builder.addCase(
      removeCollectionWordsFromTraining.pending.type,
      setPending<TrainingState>
    )
    builder.addCase(
      removeCollectionWordsFromTraining.rejected.type,
      setRejected<TrainingState, string>
    )

    builder.addCase(
      updateTraining.fulfilled.type,
      setFulfilledTraining<TrainingState, UserWordProgress[]>
    )
    builder.addCase(updateTraining.pending.type, setPending<TrainingState>)
    builder.addCase(
      updateTraining.rejected.type,
      setRejected<TrainingState, string>
    )
  },
})

export default trainingSlice.reducer
