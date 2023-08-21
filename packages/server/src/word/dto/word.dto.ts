import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class WordDto {
  @IsNumber()
  @IsOptional()
  id?;

  @IsString()
  @IsNotEmpty()
  word;

  @IsString()
  translation;
}
