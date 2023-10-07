import type { ApiResponse } from '../types/api';

type ThunkAPI = {
  rejectWithValue: (error: string) => void;
};

// Common logic to handle API call and error check
const handleAPICall = async <T, R>(
  apiCall: ApiResponse<T>,
  thunkAPI: ThunkAPI,
  transformer?: (data: T) => R
): Promise<R | void> => {
  try {
    const { data, error: httpReqError } = await apiCall;

    // Handling HTTP error if any
    if (httpReqError) {
      return thunkAPI.rejectWithValue(httpReqError);
    }

    // Handling API data error if any
    if (data) {
      const { error } = data;
      if (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }

    return transformer ? transformer(data!) : (data as unknown as R);
  } catch (e: any) {
    return thunkAPI.rejectWithValue(`Ошибка: ${e.message}`);
  }
};

export default handleAPICall;
