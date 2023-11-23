import type { PayloadAction } from '@reduxjs/toolkit';
import type { Nullable } from '../../../types/common';
import type { User } from '../../../types/user';
import type { Collection } from '../../../types/collection';
import type { UserWordProgress } from '../../../types/training';

export type LoadingState = {
  isLoading: Nullable<boolean>;
  error: Nullable<string>;
};

export type UserState = LoadingState & {
  user: Nullable<User>;
  isLoggedIn: boolean;
  isInTraining: boolean;
  isInitialized: boolean;
};

export type CollectionState = LoadingState & {
  collections: Collection[];
};

export type TrainingState = LoadingState & {
  training: UserWordProgress[];
};

export type ActionPayload<T> = PayloadAction<T, string, any, any>;

export const setPending = <T extends LoadingState>(state: T) => {
  state.isLoading = true;
  state.error = null;
};

export const setRejected = <T extends LoadingState, A extends Nullable<string>>(
  state: T,
  action: ActionPayload<A>
) => {
  state.isLoading = false;
  state.error = action.payload;
};

export const setFulfilled = <T extends UserState, A extends User>(
  state: T,
  action: ActionPayload<A>
) => {
  state.isLoading = false;
  state.error = null;
  state.user = action.payload;
  state.isLoggedIn = true;
};

export const setFulfilledTraining = <
  T extends TrainingState,
  A extends UserWordProgress[]
>(
  state: T,
  action: ActionPayload<A>
) => {
  state.training = action.payload;
  state.isLoading = false;
  state.error = null;
};
