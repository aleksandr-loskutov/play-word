import { IsNotEmpty } from 'class-validator';

export class CollectionDto {
  @IsNotEmpty()
  name: string;
}

export class CollectionWordDto {
  @IsNotEmpty()
  collectionId: number;
  @IsNotEmpty()
  wordId: number;
}
