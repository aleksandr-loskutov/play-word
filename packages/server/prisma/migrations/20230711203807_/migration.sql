-- DropForeignKey
ALTER TABLE "userTrainingSettings" DROP CONSTRAINT "userTrainingSettings_userId_fkey";

-- AddForeignKey
ALTER TABLE "userTrainingSettings" ADD CONSTRAINT "userTrainingSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
