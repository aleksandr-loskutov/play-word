import { User, UserTrainingSettings } from '@prisma/client';

export type UserWithTrainingSettings = User & {
  trainingSettings: UserTrainingSettings;
  iat?: number;
  exp?: number;
};
