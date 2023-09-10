import { createAsyncThunk } from '@reduxjs/toolkit';
import { RequestUserDataUpdate } from '../../types/user';
import userAPI from '../../api/user';
import handleAPICall from '../../utils/handle-API-call';

// Update Profile
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  (payload: RequestUserDataUpdate, thunkAPI) =>
    handleAPICall(userAPI.updateProfile(payload), thunkAPI),
);

// Update Profile Avatar
export const updateProfileAvatar = createAsyncThunk(
  'user/updateProfileAvatar',
  (payload, thunkAPI) => handleAPICall(userAPI.updateAvatar(payload), thunkAPI),
);

const actions = {
  updateProfile,
  updateProfileAvatar,
};

export default actions;
