import { createAsyncThunk } from '@reduxjs/toolkit';
import CollectionsAPI from '../../api/collections';
import {
  RequestCollectionCreate,
  RequestCollectionUpdate,
} from '../../types/collection';
import handleAPICall from '../../utils/handle-API-call';

// Create Collection
export const createCollection = createAsyncThunk(
  'collections/create',
  (payload: RequestCollectionCreate, thunkAPI) =>
    handleAPICall(CollectionsAPI.create(payload), thunkAPI),
);

// Update Collection
export const updateCollection = createAsyncThunk(
  'collections/update',
  (payload: RequestCollectionUpdate, thunkAPI) =>
    handleAPICall(CollectionsAPI.update(payload.id, payload), thunkAPI),
);

// Get Public Collections
export const getPublicCollections = createAsyncThunk(
  'collections/getPublic',
  (_, thunkAPI) =>
    handleAPICall(CollectionsAPI.getPublicCollections(), thunkAPI),
);

// Get User Collections
export const getUserCollections = createAsyncThunk(
  'collections/getUserCollections',
  (_, thunkAPI) => handleAPICall(CollectionsAPI.getUserCollections(), thunkAPI),
);

// Delete Collection
export const deleteCollection = createAsyncThunk(
  'collections/delete',
  (id: number, thunkAPI) => handleAPICall(CollectionsAPI.delete(id), thunkAPI),
);

const actions = {
  createCollection,
  updateCollection,
  getPublicCollections,
  getUserCollections,
  deleteCollection,
};

export default actions;
