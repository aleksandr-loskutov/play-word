export type Response<T> = T | ResponseError;

export type ResponseError = {
  error: string;
};
