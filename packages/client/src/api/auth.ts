import BaseAPI from './base';
import { SignUpDTO, SignInDTO } from '../types/auth';
import { User } from '../types/user';
import { ApiResponse } from '../types/api';

class AuthAPI extends BaseAPI {
  constructor() {
    super('/auth');
  }

  public signIn(data: SignInDTO): ApiResponse<User> {
    return this.httpService.post<SignInDTO, User>('/signin', data);
  }

  public signUp(data: SignUpDTO): ApiResponse<User> {
    return this.httpService.post<SignUpDTO, User>('/signup', data);
  }
  public refreshToken(): ApiResponse<User> {
    return this.httpService.get('/refresh');
  }

  public logout(): ApiResponse<void> {
    return this.httpService.post<void, void>('/logout');
  }
}

const authAPI = new AuthAPI();

export default authAPI;
