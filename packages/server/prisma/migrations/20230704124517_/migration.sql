/*
  Warnings:

  - The primary key for the `userProgress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `wordId` on the `userProgress` table. All the data in the column will be lost.
  - Added the required column `translationId` to the `userProgress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "userProgress" DROP CONSTRAINT "userProgress_wordId_fkey";

-- AlterTable
ALTER TABLE "userProgress" DROP CONSTRAINT "userProgress_pkey",
DROP COLUMN "wordId",
ADD COLUMN     "translationId" INTEGER NOT NULL,
ADD CONSTRAINT "userProgress_pkey" PRIMARY KEY ("userId", "translationId");

-- AddForeignKey
ALTER TABLE "userProgress" ADD CONSTRAINT "userProgress_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "translations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
