//our frontend httpService responding with its own format, so we need to define it
//this error is for the case when the request failed
export type ResponseFormat<T> = {
  data?: Response<T>
  status: number
  error?: string
}
//this is the format that the server is responding with
export type Response<T> = T & ResponseError

//this error is for the case when the request was successful, but the server responded with an error
export type ResponseError = {
  error?: string
}
export type ApiResponse<T> = Promise<ResponseFormat<T>>
