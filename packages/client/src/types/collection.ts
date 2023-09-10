export type Collection = {
  id: number;
  name: string;
  description: string;
  image: string;
  userId: number;
  isPublic: boolean;
  words: WordForCollection[];
};

export type WordForCollection = {
  word: string;
  translation: string;
};

export type RequestAddWordsToCollection = {
  collectionId: number;
  words: WordForCollection[];
};

export type RequestCollectionCreate = {
  name: string;
  description?: string;
  image?: string;
  isPublic?: boolean;
};

export type RequestCollectionUpdate = RequestCollectionCreate & { id: number };

export type AvatarSrcs = { [key: number]: string | null };
