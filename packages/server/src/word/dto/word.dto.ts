import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class WordDto {
  @IsNumber()
  @IsOptional()
  id?;

  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Word should not be empty' })
  word;

  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Translation should not be empty' })
  translation;
}
