import { IsNotEmpty, IsString } from 'class-validator';

export class CollectionDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
