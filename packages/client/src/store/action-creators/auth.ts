import { createAsyncThunk } from '@reduxjs/toolkit';
import UserAPI from '../../api/user';
import AuthAPI from '../../api/auth';
import { SignInDTO, SignUpDTO } from '../../types/auth';
import handleAPICall from '../../utils/handle-API-call';

// Fetch User
export const fetchUser = createAsyncThunk('user/fetchUser', (_, thunkAPI) =>
  handleAPICall(UserAPI.getUser(), thunkAPI)
);

// Sign In
export const signIn = createAsyncThunk(
  'user/login',
  (payload: SignInDTO, thunkAPI) =>
    handleAPICall(AuthAPI.signIn(payload), thunkAPI)
);

// Sign Up
export const signUp = createAsyncThunk(
  'user/signUp',
  (payload: SignUpDTO, thunkAPI) =>
    handleAPICall(AuthAPI.signUp(payload), thunkAPI)
);

// Sign Out
export const signOut = createAsyncThunk('user/signOut', (_, thunkAPI) =>
  handleAPICall(AuthAPI.logout(), thunkAPI)
);

const actions = {
  fetchUser,
  signIn,
  signUp,
  signOut,
};
export default actions;
