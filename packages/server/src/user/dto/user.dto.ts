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
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TrainingSettingsDto {
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

  // this max number also is using in updateUserTraining method for payload validation
  @Min(1)
  @Max(100)
  wordsPerSession: number;

  @IsBoolean()
  synthVoiceAutoStart: boolean;

  @IsBoolean()
  speechRecognizerAutoStart: boolean;
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
  @Length(2, 20)
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
  @Length(2, 20)
  name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Matches(/.*[0-9].*/, {
    message: 'Пароль должен содержать хотя бы одну цифру.',
  })
  @Length(8, 20)
  password?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Matches(/.*[0-9].*/, {
    message: 'Пароль должен содержать хотя бы одну цифру.',
  })
  @Length(8, 20)
  passwordRepeat?: string;

  @ValidateNested()
  @Type(() => TrainingSettingsDto)
  trainingSettings: TrainingSettingsDto;
}
