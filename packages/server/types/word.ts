import { Word } from '@prisma/client';

export type Translation = {
  id: number;
  wordId: number;
  translation: string;
};

export type TranslationWithWord = Translation & { word: Word };

export type WordWithTranslations = {
  id: number;
  word: string;
  translations: Translation[];
};
