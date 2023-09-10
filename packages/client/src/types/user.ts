export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  trainingSettings: UserTrainingSettings;
};

export type RequestUserData = Omit<User, 'id' | 'createdAt'>;

export type PasswordChangeFormData = {
  password: string | undefined;
  passwordRepeat: string | undefined;
};

export type RequestUserDataUpdate = RequestUserData & PasswordChangeFormData;

export type UserTrainingSettings = {
  userId: number;
  wordsPerSession: number;
  stageOneInterval: number;
  stageTwoInterval: number;
  stageThreeInterval: number;
  stageFourInterval: number;
  stageFiveInterval: number;
  countdownTimeInSec: number;
  useCountdown: boolean;
  strictMode: boolean;
  showCollectionNameHint: boolean;
  wordErrorLimit: number;
  wordMistypeLimit: number;
  synthVoiceAutoStart: boolean;
  speechRecognizerAutoStart: boolean;
};
