import BaseAPI from './base';
import {
  Collection,
  RequestCollectionCreate,
  RequestCollectionUpdate,
} from '../types/collection';
import {
  RequestUserWordProgressUpdate,
  UserWordProgress,
  UserWordProgressResponse,
} from '../types/training';

class CollectionsAPI extends BaseAPI {
  constructor() {
    super('/collections');
  }

  create(data: RequestCollectionCreate) {
    return this.httpService.post<RequestCollectionCreate, Collection>(
      '/',
      data,
    );
  }

  update(id: number, data: RequestCollectionUpdate) {
    return this.httpService.put<RequestCollectionUpdate, Collection>(
      `/${id}`,
      data,
    );
  }

  delete(id: number) {
    return this.httpService.delete(`/${id}`);
  }

  getUserCollections() {
    return this.httpService.get<Collection[]>('/');
  }

  getPublicCollections() {
    return this.httpService.get<Collection[]>('/public');
  }

  addCollectionWordsToTraining(id: number) {
    return this.httpService.post<string, UserWordProgressResponse[]>(`/${id}`);
  }

  removeCollectionWordsFromTraining(id: number) {
    return this.httpService.patch<string, UserWordProgressResponse[]>(`/${id}`);
  }

  getTraining() {
    return this.httpService.get<UserWordProgressResponse[]>('/train');
  }

  updateTraining(data: RequestUserWordProgressUpdate[]) {
    return this.httpService.patch<
      RequestUserWordProgressUpdate[],
      UserWordProgressResponse[]
    >('/train', data);
  }
}

const collectionsAPI = new CollectionsAPI();

export default collectionsAPI;
