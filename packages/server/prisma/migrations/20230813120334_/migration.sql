-- AlterTable
ALTER TABLE "userTrainingSettings" ADD COLUMN     "speechRecognizerAutoStart" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "synthVoiceAutoStart" BOOLEAN NOT NULL DEFAULT true;
