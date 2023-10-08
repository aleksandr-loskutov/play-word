/*
  Warnings:

  - The primary key for the `collectionWords` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "collectionWords" DROP CONSTRAINT "collectionWords_pkey",
ADD CONSTRAINT "collectionWords_pkey" PRIMARY KEY ("collectionId", "wordId", "translationId");
