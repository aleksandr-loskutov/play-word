import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Collection, UserWordProgress, Word } from '@prisma/client';
import { TranslationWithWord } from 'word';

export class CollectionDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsString()
  image: string;
  @IsNumber()
  userId: number;
  @IsBoolean()
  isPublic: boolean;
}

export class RequestCollectionCreate {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  @IsOptional()
  image?: string;
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class RequestCollectionUpdate extends RequestCollectionCreate {
  @IsOptional()
  @IsString()
  override name: string;
}

export class RequestLearnCollection {
  @IsOptional()
  @IsObject()
  options?: any;
}

export class CollectionWordDto {
  @IsNotEmpty()
  @IsNumber()
  collectionId: number;
  @IsNotEmpty()
  @IsNumber()
  wordId: number;
}

export type CollectionWithWords = Collection & { words: Word[] };

export type UserWordProgressResponse = Omit<UserWordProgress, 'userId'>[];

export type UserWordProgressExtended = UserWordProgress & {
  translation: TranslationWithWord;
  collection: { name: string };
};

export class RequestUserTrainingUpdate {
  @IsNotEmpty()
  @IsNumber()
  wordId;

  @IsNotEmpty()
  @IsNumber()
  translationId;

  @IsNotEmpty()
  @IsNumber()
  sessionMistakes;
}
