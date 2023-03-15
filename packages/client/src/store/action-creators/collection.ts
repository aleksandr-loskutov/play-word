import { createAsyncThunk } from '@reduxjs/toolkit'
import CollectionsAPI from '../../api/collections'
import {
  RequestCollectionCreate,
  RequestCollectionUpdate,
} from '../../types/collection'

export const createCollection = createAsyncThunk(
  'collections/create',
  async (payload: RequestCollectionCreate, thunkAPI) => {
    try {
      const { data, error: httpReqError } = await CollectionsAPI.create(payload)
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
        `Не удалось создать коллекцию. ${e.message}`
      )
    }
  }
)

export const updateCollection = createAsyncThunk(
  'collections/update',
  async (payload: RequestCollectionUpdate, thunkAPI) => {
    try {
      const { data, error } = await CollectionsAPI.update(payload)

      if (error) {
        return thunkAPI.rejectWithValue(error)
      }
      return data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        `Не удалось обновить коллекцию. ${e.message}`
      )
    }
  }
)

export const getPublicCollections = createAsyncThunk(
  'collections/getPublic',
  async (_, thunkAPI) => {
    try {
      const { data, error } = await CollectionsAPI.getPublicCollections()
      if (error) {
        return thunkAPI.rejectWithValue(error)
      }
      return data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        `Не удалось загрузить коллекции. ${e.message}`
      )
    }
  }
)

export const getUserCollections = createAsyncThunk(
  'collections/getUserCollections',
  async (_, thunkAPI) => {
    try {
      const { data, error } = await CollectionsAPI.getUserCollections()
      if (error) {
        return thunkAPI.rejectWithValue(error)
      }
      return data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        `Не удалось загрузить коллекции. ${e.message}`
      )
    }
  }
)

export const deleteCollection = createAsyncThunk(
  'collections/delete',
  async (id: number, thunkAPI) => {
    try {
      const { error } = await CollectionsAPI.delete(id)
      if (error) {
        return thunkAPI.rejectWithValue(error)
      }
      return id
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        `Не удалось удалить коллекцию. ${e.message}`
      )
    }
  }
)

const actions = {
  createCollection,
  updateCollection,
  getPublicCollections,
  deleteCollection,
}

export default actions
