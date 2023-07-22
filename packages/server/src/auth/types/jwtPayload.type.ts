import { UserTrainingSettings } from '@prisma/client';

export type JwtPayload = {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  trainingSettings: UserTrainingSettings;
};
