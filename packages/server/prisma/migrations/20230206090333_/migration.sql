/*
  Warnings:

  - The primary key for the `collectionWords` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `collectionWords` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[collectionId]` on the table `collectionWords` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wordId]` on the table `collectionWords` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[collectionId,wordId]` on the table `collectionWords` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[collectionWordId]` on the table `userProgress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `collections` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "collections" DROP CONSTRAINT "collections_createdById_fkey";

-- DropForeignKey
ALTER TABLE "userProgress" DROP CONSTRAINT "userProgress_collectionWordId_fkey";

-- AlterTable
ALTER TABLE "collectionWords" DROP CONSTRAINT "collectionWords_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "collectionWords_pkey" PRIMARY KEY ("collectionId", "wordId");

-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "collectionWords_collectionId_key" ON "collectionWords"("collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "collectionWords_wordId_key" ON "collectionWords"("wordId");

-- CreateIndex
CREATE UNIQUE INDEX "collectionWords_collectionId_wordId_key" ON "collectionWords"("collectionId", "wordId");

-- CreateIndex
CREATE UNIQUE INDEX "userProgress_collectionWordId_key" ON "userProgress"("collectionWordId");

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userProgress" ADD CONSTRAINT "userProgress_collectionWordId_fkey" FOREIGN KEY ("collectionWordId") REFERENCES "collectionWords"("wordId") ON DELETE RESTRICT ON UPDATE CASCADE;
