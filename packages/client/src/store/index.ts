import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/user';
import collectionsReducer from './reducers/collection';
import trainingReducer from './reducers/training';

export const store = configureStore({
  reducer: {
    user: userReducer,
    collections: collectionsReducer,
    training: trainingReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
