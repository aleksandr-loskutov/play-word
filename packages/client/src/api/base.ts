import HttpService from '../utils/http-service'
import CONSTS from '../utils/consts'

export default class BaseAPI {
  httpService: HttpService

  constructor(endPoint: string) {
    this.httpService = new HttpService(`${CONSTS.API_PATH}${endPoint}`)
  }
}
