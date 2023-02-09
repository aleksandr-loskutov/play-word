import BaseAPI from './base'
import { SignUpDTO, SignInDTO } from '../types/auth'
import { UserEntity } from '../types/user'
import { ApiResponse } from '../types/api'

class AuthAPI extends BaseAPI {
  constructor() {
    super('/auth')
  }

  public signIn(data: SignInDTO): ApiResponse<UserEntity> {
    return this.httpService.post<SignInDTO, UserEntity>('/signin', data)
  }

  public signUp(data: SignUpDTO): ApiResponse<UserEntity> {
    return this.httpService.post<SignUpDTO, UserEntity>('/signup', data)
  }
  public refreshToken(): ApiResponse<UserEntity> {
    return this.httpService.get('/refresh')
  }

  public logout(): ApiResponse<void> {
    return this.httpService.post<void, void>('/logout')
  }
}

const authAPI = new AuthAPI()

export default authAPI
