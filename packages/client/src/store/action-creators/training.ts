import { createAsyncThunk } from '@reduxjs/toolkit';
import CollectionsAPI from '../../api/collections';
import { RequestUserWordProgressUpdate } from '../../types/training';
import { transformUserProgressResponse } from '../../utils/transform-user-progress';
import handleAPICall from '../../utils/handle-API-call';

// Get Training
export const getTraining = createAsyncThunk('training/get', (_, thunkAPI) =>
  handleAPICall(
    CollectionsAPI.getTraining(),
    thunkAPI,
    transformUserProgressResponse
  )
);

// Add Collection Words For Training
export const addCollectionWordsForTraining = createAsyncThunk(
  'training/addCollectionWordsForTraining',
  (id: number, thunkAPI) =>
    handleAPICall(
      CollectionsAPI.addCollectionWordsToTraining(id),
      thunkAPI,
      transformUserProgressResponse
    )
);

// Remove Collection Words From Training
export const removeCollectionWordsFromTraining = createAsyncThunk(
  'training/removeCollectionWordsFromTraining',
  (id: number, thunkAPI) =>
    handleAPICall(
      CollectionsAPI.removeCollectionWordsFromTraining(id),
      thunkAPI,
      transformUserProgressResponse
    )
);

// Update Training
export const updateTraining = createAsyncThunk(
  'training/update',
  (payload: RequestUserWordProgressUpdate[], thunkAPI) =>
    handleAPICall(
      CollectionsAPI.updateTraining(payload),
      thunkAPI,
      transformUserProgressResponse
    )
);
