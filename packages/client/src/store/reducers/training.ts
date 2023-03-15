import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  getTraining,
  updateTraining,
  addCollectionWordsForTraining,
  removeCollectionWordsFromTraining,
} from '../action-creators/training'

import { setFulfilled, setPending, setRejected, TrainingState } from './common'
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
      (state: TrainingState, action: PayloadAction<UserWordProgress[]>) => {
        state.training = action.payload
        state.isLoading = false
        state.error = null
      }
    )
    builder.addCase(getTraining.pending.type, setPending<TrainingState>)
    builder.addCase(
      getTraining.rejected.type,
      setRejected<TrainingState, string>
    )

    builder.addCase(
      addCollectionWordsForTraining.fulfilled.type,
      (state, action: PayloadAction<UserWordProgress[]>) => {
        state.training = action.payload
      }
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
      (state, action: PayloadAction<UserWordProgress[]>) => {
        state.training = action.payload
      }
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
      (state: TrainingState, action: PayloadAction<UserWordProgress[]>) => {
        state.training = state.training.map(item => {
          const newItem = action.payload.find(i => i.wordId === item.wordId)
          return newItem ? newItem : item
        })
        state.isLoading = false
        state.error = null
      }
    )
    builder.addCase(updateTraining.pending.type, setPending<TrainingState>)
    builder.addCase(
      updateTraining.rejected.type,
      setRejected<TrainingState, string>
    )
  },
})

export default trainingSlice.reducer
