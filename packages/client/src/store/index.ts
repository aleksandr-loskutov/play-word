import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/user';
import collectionsReducer from './reducers/collection';
import trainingReducer from './reducers/training';
import CONSTS from '../utils/consts';

export const store = configureStore({
  reducer: {
    user: userReducer,
    collections: collectionsReducer,
    training: trainingReducer,
  },
  devTools: CONSTS.IS_DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
