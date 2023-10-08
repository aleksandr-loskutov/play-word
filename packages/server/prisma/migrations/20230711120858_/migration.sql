/*
  Warnings:

  - Added the required column `collectionId` to the `userProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userProgress" ADD COLUMN     "collectionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "userProgress" ADD CONSTRAINT "userProgress_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
