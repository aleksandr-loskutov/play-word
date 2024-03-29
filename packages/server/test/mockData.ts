import type { UserTrainingSettings } from '@prisma/client';
import type { SignUpDto } from '../src/auth/dto';
import type { EditUserDto } from '../src/user/dto';
import type {
  RequestCollectionCreateDto,
  RequestUserTrainingUpdate,
} from '../src/collection/dto';
import { generateRandomString } from '../src/common/utils';
import type { WordDto } from '../src/word/dto';

const mockSignUpDto: SignUpDto = {
  email: 'aleksandr@fakemail.com',
  name: 'AleksandrL',
  password: 'Password123', // conforms to all validation rules
};

const mockSignUpSecondUser: SignUpDto = {
  email: 'aleksandr2@fakemail.com',
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

const mockTrainingSettingsDto: Omit<UserTrainingSettings, 'userId'> = {
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

// Mock object with all invalid fields for EditUserDto and TrainingSettingsDto
const mockInvalidEditUserDto = {
  email: 'invalid_email', // Not a valid email
  name: 'a', // Too short, not within length of 2-20
  password: 'abcdefg', // Less than 8 characters, no numbers
  passwordRepeat: 'abcdef', // Less than 8 characters, no numbers
  trainingSettings: {
    stageOneInterval: 0, // Less than 1
    stageTwoInterval: 200, // More than 180
    stageThreeInterval: -1, // Less than 1
    stageFourInterval: 0, // Less than 1
    stageFiveInterval: 300, // More than 180
    countdownTimeInSec: 0, // Less than 5
    wordErrorLimit: -5, // Less than 0
    wordMistypeLimit: 110, // More than 100
    useCountdown: 'notBoolean', // Not a boolean
    strictMode: 'notBoolean', // Not a boolean
    showCollectionNameHint: 0, // Not a boolean
    wordsPerSession: 0, // Less than 1
    synthVoiceAutoStart: 1, // Not a boolean
    speechRecognizerAutoStart: 'false', // Not a boolean
  },
};

const mockUpdatedUserDto: EditUserDto = {
  email: 'aleksandrl@fakemail.com',
  name: 'Aleksandr',
  trainingSettings: mockTrainingSettingsDto,
};

const mockRequestCollectionCreateDto: RequestCollectionCreateDto = {
  name: 'TestCollection',
  description: 'This is a test description',
  isPublic: true,
};

const mockInvalidRequestCollectionUpdateDto = {
  name: '', // Invalid: Empty string
  description: 'A', // Invalid: Less than 3 characters
  image: 123, // Invalid: Not a string
  isPublic: 'yes', // Invalid: Not a boolean
};

const mockRequestCollectionUpdateDto = {
  name: 'updated collection',
  description: 'updated description',
  image: 'https://example.com/img.png',
};

const mockInvalidRequestUserTrainingUpdateDto: RequestUserTrainingUpdate[] = [
  {
    wordId: 10000,
    translationId: 10000,
    sessionMistakes: 5,
  },
];

const mockInvalidWordsForCollectionDto: WordDto[] = [
  {
    word: '',
    translation: '',
  },
  { word: generateRandomString(100), translation: generateRandomString(100) },
];

const mockWordsForCollectionDto: WordDto[] = [
  {
    word: generateRandomString(2),
    translation: generateRandomString(2),
  },
  {
    word: generateRandomString(45),
    translation: generateRandomString(45),
  },
];

export {
  mockSignUpDto,
  mockSignUpDtoInvalidEmail,
  mockSignUpDtoInvalidName,
  mockSignUpDtoInvalidPassword,
  mockTrainingSettingsDto,
  mockUpdatedUserDto,
  mockInvalidEditUserDto,
  mockRequestCollectionCreateDto,
  mockInvalidRequestCollectionUpdateDto,
  mockRequestCollectionUpdateDto,
  mockSignUpSecondUser,
  mockInvalidRequestUserTrainingUpdateDto,
  mockWordsForCollectionDto,
  mockInvalidWordsForCollectionDto,
};
