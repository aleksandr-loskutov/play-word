import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserEntity } from '../../types/user'
import {
  updateProfile,
  updateProfileAvatar,
  updateTheme,
} from '../action-creators/profile'
import {
  fetchUser,
  signIn,
  signOut,
  signUp,
  signInOAuth,
} from '../action-creators/auth'
import { setFulfilled, setPending, setRejected, UserState } from './common'

const initialState: UserState = {
  user: null,
  isLoading: false,
  isLoggedIn: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoadingStatus(state: UserState, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setUser(state: UserState, action: PayloadAction<UserEntity>) {
      state.user = action.payload
      state.isLoggedIn = true
    },
    removeUser(state: UserState) {
      state.user = null
      state.isLoggedIn = false
    },
    updateUser(state: UserState, action: PayloadAction<Partial<UserEntity>>) {
      if (!state.user) return

      state.user = { ...state.user, ...action.payload }
    },
  },
  extraReducers: builder => {
    builder.addCase(
      fetchUser.fulfilled.type,
      setFulfilled<UserState, UserEntity>
    )
    builder.addCase(fetchUser.pending.type, setPending<UserState>)
    builder.addCase(fetchUser.rejected.type, setRejected<UserState, string>)

    builder.addCase(signIn.fulfilled.type, setFulfilled<UserState, UserEntity>)
    builder.addCase(signIn.pending.type, setPending<UserState>)
    builder.addCase(signIn.rejected.type, setRejected<UserState, string>)

    builder.addCase(
      signInOAuth.fulfilled.type,
      setFulfilled<UserState, UserEntity>
    )
    builder.addCase(signInOAuth.pending.type, setPending<UserState>)
    builder.addCase(signInOAuth.rejected.type, setRejected<UserState, string>)

    builder.addCase(signUp.fulfilled.type, setFulfilled<UserState, UserEntity>)
    builder.addCase(signUp.pending.type, setPending<UserState>)
    builder.addCase(signUp.rejected.type, setRejected<UserState, string>)

    builder.addCase(signOut.pending.type, setPending<UserState>)
    builder.addCase(signOut.rejected.type, setRejected<UserState, string>)
    builder.addCase(signOut.fulfilled.type, (state: UserState) => {
      state.isLoading = false
      state.error = null
      state.user = null
      state.isLoggedIn = false
    })

    builder.addCase(
      updateProfile.fulfilled.type,
      setFulfilled<UserState, UserEntity>
    )
    builder.addCase(updateProfile.pending.type, setPending<UserState>)
    builder.addCase(updateProfile.rejected.type, setRejected<UserState, string>)

    builder.addCase(
      updateProfileAvatar.fulfilled.type,
      setFulfilled<UserState, UserEntity>
    )
    builder.addCase(updateProfileAvatar.pending.type, setPending<UserState>)
    builder.addCase(
      updateProfileAvatar.rejected.type,
      setRejected<UserState, string>
    )

    builder.addCase(
      updateTheme.fulfilled.type,
      (state: UserState, action: PayloadAction<string>) => {
        if (!state.user) return
        state.user = { ...state.user, theme: action.payload || 'default' }
        state.isLoading = false
        state.error = null
      }
    )
    builder.addCase(updateTheme.pending.type, setPending<UserState>)
    builder.addCase(updateTheme.rejected.type, setRejected<UserState, string>)
  },
})

export const { setLoadingStatus, setUser, removeUser, updateUser } =
  userSlice.actions

export default userSlice.reducer
