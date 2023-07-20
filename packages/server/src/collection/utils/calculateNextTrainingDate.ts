import { UserTrainingSettings } from '@prisma/client';

export function calculateNextTrainingDate(
  stage: number,
  userSettings: UserTrainingSettings,
) {
  const stageIntervals = [
    0, // Stage 0 has an immediate review
    userSettings.stageOneInterval,
    userSettings.stageTwoInterval,
    userSettings.stageThreeInterval,
    userSettings.stageFourInterval,
    userSettings.stageFiveInterval,
  ];

  const interval = stageIntervals[Math.min(stage, stageIntervals.length - 1)];
  return new Date(Date.now() + interval * 24 * 3600 * 1000);
}
