/*
  Warnings:

  - You are about to drop the column `difficultyLevel` on the `userCollectionSettings` table. All the data in the column will be lost.
  - You are about to drop the column `showAnswerAfterQuestion` on the `userCollectionSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "userCollectionSettings" DROP COLUMN "difficultyLevel",
DROP COLUMN "showAnswerAfterQuestion";

-- CreateTable
CREATE TABLE "userTrainingSettings" (
    "userId" INTEGER NOT NULL,
    "stageOneInterval" INTEGER NOT NULL DEFAULT 1,
    "stageTwoInterval" INTEGER NOT NULL DEFAULT 7,
    "stageThreeInterval" INTEGER NOT NULL DEFAULT 30,
    "stageFourInterval" INTEGER NOT NULL DEFAULT 90,
    "stageFiveInterval" INTEGER NOT NULL DEFAULT 180,
    "countdownTimeInSec" INTEGER NOT NULL DEFAULT 60,
    "strictMode" BOOLEAN NOT NULL DEFAULT false,
    "wordErrorLimit" INTEGER NOT NULL DEFAULT 3,
    "wordMistypeLimit" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "userTrainingSettings_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "userTrainingSettings" ADD CONSTRAINT "userTrainingSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
