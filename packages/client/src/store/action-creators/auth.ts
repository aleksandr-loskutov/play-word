import { createAsyncThunk } from '@reduxjs/toolkit'
import { NavigateFunction } from 'react-router'
import UserAPI from '../../api/user'
import AuthAPI from '../../api/auth'
import { SignInDTO, SignUpDTO } from '../../types/auth'

import signInService, {
  signInWithProvider,
} from '../../pages/signIn/services/signin-service'
import signUpService from '../../pages/signUp/services/signup-service'

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, thunkAPI) => {
    try {
      const { data, error } = await UserAPI.getUser()
      if (error) {
        return thunkAPI.rejectWithValue(error)
      }
      return data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        `Не удалось загрузить пользователя. ${error.message}`
      )
    }
  }
)

export const signIn = createAsyncThunk(
  'user/login',
  async (payload: SignInDTO, thunkAPI) => {
    try {
      const { data, error } = await signInService(payload)
      if (error) {
        return thunkAPI.rejectWithValue(error)
      }
      return data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        `Не удалось авторизоваться. ${error.message}`
      )
    }
  }
)

export const signUp = createAsyncThunk(
  'user/signUp',
  async (payload: SignUpDTO, thunkAPI) => {
    try {
      const { data, error } = await signUpService(payload)
      if (error) {
        return thunkAPI.rejectWithValue(error)
      }
      return data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        `Не удалось зарегистрироваться. ${error.message}`
      )
    }
  }
)

export const signOut = createAsyncThunk('user/signOut', async (_, thunkAPI) => {
  try {
    const { data, error } = await AuthAPI.logout()
    if (error) {
      return thunkAPI.rejectWithValue(error)
    }
    return data
  } catch (error: any) {
    return thunkAPI.rejectWithValue(`Ошибка ${error.message}`)
  }
})

export const signInOAuth = createAsyncThunk(
  'user/signInOAuth',
  async (payload: { code: string; navigate: NavigateFunction }, thunkAPI) => {
    const { code, navigate } = payload
    try {
      const { data, error } = await signInWithProvider(code)
      if (error) {
        navigate('/sign-in')
        return thunkAPI.rejectWithValue(error)
      }
      return data
    } catch (error: any) {
      navigate('/sign-in')
      return thunkAPI.rejectWithValue(
        `Не удалось авторизоваться через OAuth. ${error.message}`
      )
    }
  }
)

const actions = {
  fetchUser,
  signIn,
  signUp,
  signOut,
  signInOAuth,
}
export default actions
