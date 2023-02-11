import { PayloadAction } from '@reduxjs/toolkit'
import { Nullable } from '../../../types/common'
import { UserEntity } from '../../../types/user'
import { Collection } from '../../../types/collection'

export type LoadingState = {
  isLoading: boolean
  error: Nullable<string>
}

export type UserState = LoadingState & {
  user: Nullable<UserEntity>
  isLoggedIn: boolean
}

export type CollectionState = LoadingState & {
  collections: Collection[]
}

export type ActionPayload<T> = PayloadAction<T, string, any, any>

export const setPending = <T extends LoadingState>(state: T) => {
  state.isLoading = true
  state.error = null
}

export const setRejected = <T extends LoadingState, A extends Nullable<string>>(
  state: T,
  action: ActionPayload<A>
) => {
  state.isLoading = false
  state.error = action.payload
}

export const setFulfilled = <T extends UserState, A extends UserEntity>(
  state: T,
  action: ActionPayload<A>
) => {
  state.isLoading = false
  state.error = null
  state.user = action.payload
  state.isLoggedIn = true
}
