import { IsString, IsNotEmpty, IsNumber, Length } from 'class-validator';
export class WordDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 45, { message: 'Word should contain 2-45 characters' })
  word;

  @IsString()
  @IsNotEmpty()
  @Length(2, 45, { message: 'Translation should contain 2-45 characters' })
  translation;
}

export class ResponseWordDto extends WordDto {
  @IsNumber()
  @IsNotEmpty()
  id;
}

export class RequestUpdateWordDto extends ResponseWordDto {}
