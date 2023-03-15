import { createAsyncThunk } from '@reduxjs/toolkit'
import CollectionsAPI from '../../api/collections'
import { message } from 'antd'

import { RequestUserWordProgressUpdate } from '../../types/training'

export const getTraining = createAsyncThunk(
  'training/get',
  async (_, thunkAPI) => {
    try {
      const { data, error: httpReqError } = await CollectionsAPI.getTraining()
      if (httpReqError) {
        return thunkAPI.rejectWithValue(httpReqError)
      }
      if (data) {
        const { error } = data
        if (error) {
          return thunkAPI.rejectWithValue(error)
        }
      }
      return data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        `Не удалось получить тренировку. ${e.message}`
      )
    }
  }
)
export const addCollectionWordsForTraining = createAsyncThunk(
  'training/addCollectionWordsForTraining',
  async (id: number, thunkAPI) => {
    try {
      const { data, error: httpReqError } =
        await CollectionsAPI.addCollectionWordsToTraining(id)
      if (httpReqError) {
        return thunkAPI.rejectWithValue(httpReqError)
      }
      if (data) {
        const { error } = data
        if (error) {
          return thunkAPI.rejectWithValue(error)
        }
      }
      return data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        `Не удалось добавить слова в тренировку. ${e.message}`
      )
    }
  }
)
export const removeCollectionWordsFromTraining = createAsyncThunk(
  'training/removeCollectionWordsFromTraining',
  async (id: number, thunkAPI) => {
    try {
      const { data, error: httpReqError } =
        await CollectionsAPI.removeCollectionWordsFromTraining(id)
      if (httpReqError) {
        return thunkAPI.rejectWithValue(httpReqError)
      }
      if (data) {
        const { error } = data
        if (error) {
          return thunkAPI.rejectWithValue(error)
        }
      }
      return data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        `Не удалось удалить слова из тренировки. ${e.message}`
      )
    }
  }
)

export const updateTraining = createAsyncThunk(
  'training/update',
  async (payload: RequestUserWordProgressUpdate, thunkAPI) => {
    try {
      const { data, error } = await CollectionsAPI.updateTraining(payload)
      if (error) {
        return thunkAPI.rejectWithValue(error)
      }
      return data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        `Не удалось обновить тренировку. ${e.message}`
      )
    }
  }
)

const actions = {
  getTraining,
  updateTraining,
  addCollectionWordsForTraining,
  removeCollectionWordsFromTraining,
}

export default actions
