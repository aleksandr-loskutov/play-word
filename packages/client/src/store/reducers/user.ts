import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/user';
import { updateProfile, updateProfileAvatar } from '../action-creators/profile';
import { fetchUser, signIn, signOut, signUp } from '../action-creators/auth';
import { setFulfilled, setPending, setRejected, UserState } from './common';

const initialState: UserState = {
  user: null,
  isLoading: null,
  isLoggedIn: false,
  error: null,
  isInitialized: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoadingStatus(state: UserState, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setUser(state: UserState, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    removeUser(state: UserState) {
      state.user = null;
      state.isLoggedIn = false;
    },
    updateUser(state: UserState, action: PayloadAction<Partial<User>>) {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
    },
    setUserInitialized(state: UserState) {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled.type, setFulfilled<UserState, User>);
    builder.addCase(fetchUser.pending.type, setPending<UserState>);
    builder.addCase(fetchUser.rejected.type, setRejected<UserState, string>);

    builder.addCase(signIn.fulfilled.type, setFulfilled<UserState, User>);
    builder.addCase(signIn.pending.type, setPending<UserState>);
    builder.addCase(signIn.rejected.type, setRejected<UserState, string>);

    builder.addCase(signUp.fulfilled.type, setFulfilled<UserState, User>);
    builder.addCase(signUp.pending.type, setPending<UserState>);
    builder.addCase(signUp.rejected.type, setRejected<UserState, string>);

    builder.addCase(signOut.pending.type, setPending<UserState>);
    builder.addCase(signOut.rejected.type, setRejected<UserState, string>);
    builder.addCase(signOut.fulfilled.type, (state: UserState) => {
      state.isLoading = false;
      state.error = null;
      state.user = null;
      state.isLoggedIn = false;
    });

    builder.addCase(
      updateProfile.fulfilled.type,
      setFulfilled<UserState, User>,
    );
    builder.addCase(updateProfile.pending.type, setPending<UserState>);
    builder.addCase(
      updateProfile.rejected.type,
      setRejected<UserState, string>,
    );

    builder.addCase(
      updateProfileAvatar.fulfilled.type,
      setFulfilled<UserState, User>,
    );
    builder.addCase(updateProfileAvatar.pending.type, setPending<UserState>);
    builder.addCase(
      updateProfileAvatar.rejected.type,
      setRejected<UserState, string>,
    );
  },
});

export const {
  setLoadingStatus,
  setUser,
  removeUser,
  updateUser,
  setUserInitialized,
} = userSlice.actions;

export default userSlice.reducer;
