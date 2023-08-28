import { createAsyncThunk } from '@reduxjs/toolkit'
import { NavigateFunction } from 'react-router'
import UserAPI from '../../api/user'
import AuthAPI from '../../api/auth'
import { SignInDTO, SignUpDTO } from '../../types/auth'
import signInService from '../../pages/signIn/services/signin-service'
import signUpService from '../../pages/signUp/services/signup-service'
import handleAPICall from '../../utils/handle-API-call'

// Fetch User
export const fetchUser = createAsyncThunk('user/fetchUser', (_, thunkAPI) =>
  handleAPICall(UserAPI.getUser(), thunkAPI)
)

// Sign In
export const signIn = createAsyncThunk(
  'user/login',
  (payload: SignInDTO, thunkAPI) =>
    handleAPICall(signInService(payload), thunkAPI)
)

// Sign Up
export const signUp = createAsyncThunk(
  'user/signUp',
  (payload: SignUpDTO, thunkAPI) =>
    handleAPICall(signUpService(payload), thunkAPI)
)

// Sign Out
export const signOut = createAsyncThunk('user/signOut', (_, thunkAPI) =>
  handleAPICall(AuthAPI.logout(), thunkAPI)
)

const actions = {
  fetchUser,
  signIn,
  signUp,
  signOut,
}
export default actions
