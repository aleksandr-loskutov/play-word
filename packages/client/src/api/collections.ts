import BaseAPI from './base'
import { Collection, RequestCollectionCreate } from '../types/collection'

class CollectionsAPI extends BaseAPI {
  constructor() {
    super('/collections')
  }

  create(data: RequestCollectionCreate) {
    return this.httpService.post<RequestCollectionCreate, Collection>('/', data)
  }

  getAll() {
    return this.httpService.get<Collection[]>('/')
  }
}

const collectionsAPI = new CollectionsAPI()

export default collectionsAPI
