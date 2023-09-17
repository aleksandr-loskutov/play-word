import BaseAPI from './base';
import { WordForCollection, Collection } from '../types/collection';

class WordAPI extends BaseAPI {
  constructor() {
    super('/word');
  }

  getWordsByCollection(collectionId: string) {
    return this.httpService.get<Collection>(`/${collectionId}`);
  }

  updateWordsInCollection(collectionId: number, data: WordForCollection[]) {
    return this.httpService.post<WordForCollection[], Collection>(
      `/${collectionId}`,
      data
    );
  }
}

const wordAPI = new WordAPI();

export default wordAPI;
