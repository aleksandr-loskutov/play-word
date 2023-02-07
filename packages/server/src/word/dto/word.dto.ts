import { IsNotEmpty } from 'class-validator';

export class WordDto {
  id?: number;

  @IsNotEmpty()
  word: string;

  @IsNotEmpty()
  translation: string;
}
