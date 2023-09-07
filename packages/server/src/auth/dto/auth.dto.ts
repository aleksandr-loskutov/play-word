import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { UserTrainingSettings } from '@prisma/client';
import { Tokens } from '../types';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/.*[0-9].*/, {
    message: 'Пароль должен содержать хотя бы одну цифру.',
  })
  @Length(8, 20)
  password: string;
}

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/.*[0-9].*/, {
    message: 'Пароль должен содержать хотя бы одну цифру.',
  })
  @Length(8, 20)
  password: string;
}

export type UserDto = {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  trainingSettings: UserTrainingSettings;
};

export type AuthResponse = {
  user: UserDto;
  tokens: Tokens;
};
