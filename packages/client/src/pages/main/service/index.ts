import CollectionsAPI from '../../../api/collections';
import type { Collection } from '../../../types/collection';

// for now, this is just simple skeleton from handle api call util
export default async function getPublicCollectionsService(): Promise<
  Collection[]
> {
  try {
    const { data, error: httpReqError } =
      await CollectionsAPI.getPublicCollections();

    if (httpReqError) {
      return [];
    }

    if (data) {
      const { error } = data;
      if (error) {
        return [];
      }
    }

    return data as Collection[];
  } catch (e: any) {
    return [];
  }
}
