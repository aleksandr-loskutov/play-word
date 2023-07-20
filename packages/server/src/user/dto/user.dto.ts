import {
  IsEmail,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
  Min,
  Max,
  IsBoolean,
  IsNotEmpty,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

class TrainingSettingsDto {
  @Min(1)
  @Max(180)
  stageOneInterval: number;

  @Min(1)
  @Max(180)
  stageTwoInterval: number;

  @Min(1)
  @Max(180)
  stageThreeInterval: number;

  @Min(1)
  @Max(180)
  stageFourInterval: number;

  @Min(1)
  @Max(180)
  stageFiveInterval: number;

  @Min(5)
  @Max(600)
  countdownTimeInSec: number;

  @Min(0)
  @Max(100)
  wordErrorLimit: number;

  @Min(0)
  @Max(100)
  wordMistypeLimit: number;

  @IsBoolean()
  useCountdown: boolean;

  @IsBoolean()
  strictMode: boolean;

  @IsBoolean()
  showCollectionNameHint: boolean;

  @Min(1)
  @Max(100)
  wordsPerSession;
}

export class UserDto {
  @IsNumber()
  id: number;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  name: string;

  @IsString()
  @IsNotEmpty()
  createdAt: Date;

  @ValidateNested()
  @Type(() => TrainingSettingsDto)
  trainingSettings: TrainingSettingsDto;
}

export class EditUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Length(1, 20)
  password?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Length(1, 20)
  passwordRepeat?: string;

  @ValidateNested()
  @Type(() => TrainingSettingsDto)
  trainingSettings: TrainingSettingsDto;
}
