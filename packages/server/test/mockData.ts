import { SignUpDto } from '../src/auth/dto';

const mockSignUpDto: SignUpDto = {
  email: 'aleksandr@fakemail.com',
  name: 'AleksandrL',
  password: 'Password123', // conforms to all validation rules
};

const mockSignUpDtoInvalidEmail = {
  ...mockSignUpDto,
  email: 'notAnEmail',
};

const mockSignUpDtoInvalidName = {
  ...mockSignUpDto,
  name: 'J', // less than 2 characters
};

const mockSignUpDtoInvalidPassword = {
  ...mockSignUpDto,
  password: 'short', // less than 8 characters and no number
};

const mockTrainingSettingsDto = {
  stageOneInterval: 5,
  stageTwoInterval: 10,
  stageThreeInterval: 20,
  stageFourInterval: 40,
  stageFiveInterval: 60,
  countdownTimeInSec: 30,
  wordErrorLimit: 3,
  wordMistypeLimit: 2,
  useCountdown: true,
  strictMode: false,
  showCollectionNameHint: true,
  wordsPerSession: 50,
  synthVoiceAutoStart: false,
  speechRecognizerAutoStart: true,
};

export {
  mockSignUpDto,
  mockSignUpDtoInvalidEmail,
  mockSignUpDtoInvalidName,
  mockSignUpDtoInvalidPassword,
  mockTrainingSettingsDto,
};
