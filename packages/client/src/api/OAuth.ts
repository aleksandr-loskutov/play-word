import type { OAuthServiceIdDTO, OAuthSignInYandexDTO } from '../types/auth';
import type { ApiResponse } from '../types/api';
import BaseAPI from './base';

class OAuthYandexAPI extends BaseAPI {
  constructor() {
    super('/user/oauth/yandex');
  }

  signIn(body: OAuthSignInYandexDTO): ApiResponse<string> {
    return this.httpService.post('', {
      body,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  getServiceId(query: string): ApiResponse<OAuthServiceIdDTO> {
    return this.httpService.get(`/service-id?redirect_uri=${query}`);
  }
}

const oAuthYandexAPI = new OAuthYandexAPI();

export default oAuthYandexAPI;
