import { createAsyncThunk } from '@reduxjs/toolkit';
import WordAPI from '../../api/word';
import { RequestAddWordsToCollection } from '../../types/collection';
import handleAPICall from '../../utils/handle-API-call';

// Add words to collection
export const updateWordsInCollection = createAsyncThunk(
  'word/addWordsToCollection',
  (payload: RequestAddWordsToCollection, thunkAPI) =>
    handleAPICall(
      WordAPI.updateWordsInCollection(payload.collectionId, payload.words),
      thunkAPI,
    ),
);

// Get words by collection
export const getWordsByCollection = createAsyncThunk(
  'word/getWordsByCollection',
  (collectionId: string, thunkAPI) =>
    handleAPICall(WordAPI.getWordsByCollection(collectionId), thunkAPI),
);

const actions = {
  getWordsByCollection,
  updateWordsInCollection,
};

export default actions;
