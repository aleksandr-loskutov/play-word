import BaseAPI from './base'
import {
  Collection,
  RequestCollectionCreate,
  RequestCollectionUpdate,
} from '../types/collection'
import {
  RequestUserWordProgressUpdate,
  UserWordProgress,
} from '../types/training'

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

  addCollectionWordsToTraining(id: number) {
    return this.httpService.post<string, UserWordProgress[]>(`/${id}`)
  }

  removeCollectionWordsFromTraining(id: number) {
    return this.httpService.patch<string, UserWordProgress[]>(`/${id}`)
  }

  getTraining() {
    return this.httpService.get<UserWordProgress[]>('/train')
  }

  updateTraining(data: RequestUserWordProgressUpdate) {
    return this.httpService.patch<
      RequestUserWordProgressUpdate,
      UserWordProgress[]
    >('/train', data)
  }
}

const collectionsAPI = new CollectionsAPI()

export default collectionsAPI
