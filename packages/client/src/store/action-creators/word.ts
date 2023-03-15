import { createAsyncThunk } from '@reduxjs/toolkit'
import WordAPI from '../../api/word'
import { RequestAddWordsToCollection } from '../../types/collection'

export const addWordsToCollection = createAsyncThunk(
  'word/addWordsToCollection',
  async (payload: RequestAddWordsToCollection, thunkAPI) => {
    try {
      const { words, collectionId } = payload
      const { data, error: httpReqError } = await WordAPI.addWordsToCollection(
        collectionId,
        words
      )
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
        `Не удалось добавить слова в коллекцию. ${e.message}`
      )
    }
  }
)

export const getWordsByCollection = createAsyncThunk(
  'word/getWordsByCollection',
  async (collectionId: string, thunkAPI) => {
    try {
      const { data, error } = await WordAPI.getWordsByCollection(collectionId)
      if (error) {
        return thunkAPI.rejectWithValue(error)
      }
      return data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        `Не удалось получить слова коллекции. ${e.message}`
      )
    }
  }
)

const actions = {
  getWordsByCollection,
  addWordsToCollection,
}

export default actions
