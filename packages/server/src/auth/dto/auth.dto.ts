import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Tokens } from '../types';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export type UserDto = {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
};

export type AuthResponse = {
  user: UserDto;
  tokens: Tokens;
};
