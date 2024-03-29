import type { ApiResponse } from '../types/api';
import type { User, RequestUserDataUpdate } from '../types/user';
import BaseAPI from './base';

class UserAPI extends BaseAPI {
  constructor() {
    super('/user');
  }

  public getUser(): ApiResponse<User> {
    return this.httpService.get<User>('/');
  }

  public updateProfile(body: RequestUserDataUpdate): ApiResponse<User> {
    return this.httpService.patch('/', body);
  }

  // not used
  public updateAvatar(body: RequestUserDataUpdate): ApiResponse<User> {
    return this.httpService.put('/avatar', body);
  }
}

const userAPI = new UserAPI();

export default userAPI;
