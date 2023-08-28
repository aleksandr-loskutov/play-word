import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  createCollection,
  deleteCollection,
  getPublicCollections,
  getUserCollections,
  updateCollection,
} from '../action-creators/collection'

import {
  setFulfilled,
  setPending,
  setRejected,
  CollectionState,
} from './common'
import { Collection } from '../../types/collection'
import { updateWordsInCollection } from '../action-creators/word'

const initialState: CollectionState = {
  collections: [],
  isLoading: false,
  error: null,
}

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      createCollection.fulfilled.type,
      (state: CollectionState, action: PayloadAction<Collection>) => {
        state.collections.push(action.payload)
        state.isLoading = false
        state.error = null
      }
    )
    builder.addCase(createCollection.pending.type, setPending<CollectionState>)
    builder.addCase(
      createCollection.rejected.type,
      setRejected<CollectionState, string>
    )

    builder.addCase(
      deleteCollection.fulfilled.type,
      (state: CollectionState, action: PayloadAction<Collection>) => {
        state.collections = state.collections.filter(
          collection => collection.id !== action.payload.id
        )
        state.isLoading = false
        state.error = null
      }
    )
    builder.addCase(deleteCollection.pending.type, setPending<CollectionState>)
    builder.addCase(
      deleteCollection.rejected.type,
      setRejected<CollectionState, string>
    )

    builder.addCase(
      getPublicCollections.fulfilled.type,
      (state: CollectionState, action: PayloadAction<Collection[]>) => {
        state.collections = [...state.collections, ...action.payload]
        state.isLoading = false
        state.error = null
      }
    )
    builder.addCase(
      getPublicCollections.pending.type,
      setPending<CollectionState>
    )
    builder.addCase(
      getPublicCollections.rejected.type,
      setRejected<CollectionState, string>
    )

    builder.addCase(
      getUserCollections.fulfilled.type,
      (state: CollectionState, action: PayloadAction<Collection[]>) => {
        state.isLoading = false
        state.error = null

        action.payload.forEach(newCollection => {
          const existingIndex = state.collections.findIndex(
            c => c.id === newCollection.id
          )
          if (existingIndex >= 0) {
            state.collections[existingIndex] = {
              ...state.collections[existingIndex],
              ...newCollection,
            }
          } else {
            state.collections.push(newCollection)
          }
        })
      }
    )

    builder.addCase(
      getUserCollections.pending.type,
      setPending<CollectionState>
    )
    builder.addCase(
      getUserCollections.rejected.type,
      setRejected<CollectionState, string>
    )

    builder.addCase(
      updateCollection.fulfilled.type,
      (state: CollectionState, action: PayloadAction<Collection>) => {
        state.collections = state.collections.map(collection =>
          collection.id === action.payload.id ? action.payload : collection
        )
        state.isLoading = false
        state.error = null
      }
    )
    builder.addCase(updateCollection.pending.type, setPending<CollectionState>)
    builder.addCase(
      updateCollection.rejected.type,
      setRejected<CollectionState, string>
    )

    builder.addCase(
      updateWordsInCollection.fulfilled.type,
      (state: CollectionState, action: PayloadAction<Collection>) => {
        state.collections = state.collections.map(collection =>
          collection.id === action.payload.id ? action.payload : collection
        )
        state.isLoading = false
        state.error = null
      }
    )
    builder.addCase(
      updateWordsInCollection.pending.type,
      setPending<CollectionState>
    )
    builder.addCase(
      updateWordsInCollection.rejected.type,
      setRejected<CollectionState, string>
    )
  },
})

export default collectionsSlice.reducer
