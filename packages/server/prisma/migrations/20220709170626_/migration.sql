/*
  Warnings:

  - You are about to drop the column `userId` on the `userPreferences` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userPreferenceId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "userPreferences" DROP CONSTRAINT "userPreferences_userId_fkey";

-- DropIndex
DROP INDEX "userPreferences_userId_key";

-- AlterTable
ALTER TABLE "userPreferences" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "userPreferenceId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_userPreferenceId_key" ON "users"("userPreferenceId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_userPreferenceId_fkey" FOREIGN KEY ("userPreferenceId") REFERENCES "userPreferences"("id") ON DELETE SET NULL ON UPDATE CASCADE;
