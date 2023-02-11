import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/user'
import collectionsReducer from './reducers/collection'

export const store = configureStore({
  reducer: {
    user: userReducer,
    collections: collectionsReducer,
  },
  devTools: true,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
