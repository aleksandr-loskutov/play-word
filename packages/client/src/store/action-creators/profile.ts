import { createAsyncThunk } from '@reduxjs/toolkit'
import { RequestUserDataUpdate } from '../../types/user'
import userAPI from '../../api/user'

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (payload: RequestUserDataUpdate, thunkAPI) => {
    try {
      const { data, error } = await userAPI.updateProfile(payload)

      if (error) {
        return thunkAPI.rejectWithValue(error)
      }

      return data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        `Не удалось сохранить данные. ${e.message}`
      )
    }
  }
)

export const updateProfileAvatar = createAsyncThunk(
  'user/updateProfileAvatar',
  async (payload, thunkAPI) => {
    try {
      const { data, error } = await userAPI.updateAvatar(payload)

      if (error) {
        return thunkAPI.rejectWithValue(error)
      }

      return data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        `Не удалось сохранить данные. ${e.message}`
      )
    }
  }
)

const actions = {
  updateProfile,
  updateProfileAvatar,
}

export default actions
