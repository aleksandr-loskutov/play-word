import HttpService from '../utils/http-service';

export default class BaseAPI {
  httpService: HttpService;

  constructor(endPoint: string) {
    this.httpService = new HttpService(`${endPoint}`);
  }
}
