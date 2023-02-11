import BaseAPI from './base'
import {
  Collection,
  RequestCollectionCreate,
  RequestCollectionUpdate,
} from '../types/collection'

class CollectionsAPI extends BaseAPI {
  constructor() {
    super('/collections')
  }

  create(data: RequestCollectionCreate) {
    return this.httpService.post<RequestCollectionCreate, Collection>('/', data)
  }

  update(data: RequestCollectionUpdate) {
    return this.httpService.put<RequestCollectionUpdate, Collection>('/', data)
  }

  delete(id: number) {
    return this.httpService.delete(`/${id}`)
  }

  getUserCollections() {
    return this.httpService.get<Collection[]>('/')
  }

  getPublicCollections() {
    return this.httpService.get<Collection[]>('/public')
  }
}

const collectionsAPI = new CollectionsAPI()

export default collectionsAPI
