// eslint-disable-next-line max-classes-per-file
import { IsString, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class WordDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 45, { message: 'Word should contain 2-45 characters' })
  word: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 45, { message: 'Translation should contain 2-45 characters' })
  translation: string;
}

export class ResponseWordDto extends WordDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

export class RequestUpdateWordDto extends ResponseWordDto {}
