/*
  Warnings:

  - The primary key for the `userProgress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `collectionWordId` on the `userProgress` table. All the data in the column will be lost.
  - Added the required column `wordId` to the `userProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userProgress" DROP CONSTRAINT "userProgress_pkey",
DROP COLUMN "collectionWordId",
ADD COLUMN     "wordId" INTEGER NOT NULL,
ADD CONSTRAINT "userProgress_pkey" PRIMARY KEY ("userId", "wordId");
