/*
  Warnings:

  - A unique constraint covering the columns `[collectionId,wordId,translationId]` on the table `collectionWords` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `translationId` to the `collectionWords` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "collectionWords" ADD COLUMN     "translationId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "collectionWords_collectionId_wordId_translationId_key" ON "collectionWords"("collectionId", "wordId", "translationId");

-- AddForeignKey
ALTER TABLE "collectionWords" ADD CONSTRAINT "collectionWords_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "translations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
