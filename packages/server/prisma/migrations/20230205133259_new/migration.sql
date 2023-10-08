/*
  Warnings:

  - You are about to drop the `Collection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WordForCollection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserWordProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Word` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_createdById_fkey";

-- DropForeignKey
ALTER TABLE "WordForCollection" DROP CONSTRAINT "CollectionWord_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "WordForCollection" DROP CONSTRAINT "CollectionWord_wordId_fkey";

-- DropForeignKey
ALTER TABLE "UserWordProgress" DROP CONSTRAINT "UserWordProgress_collectionWordId_fkey";

-- DropForeignKey
ALTER TABLE "UserWordProgress" DROP CONSTRAINT "UserWordProgress_userId_fkey";

-- DropTable
DROP TABLE "Collection";

-- DropTable
DROP TABLE "WordForCollection";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserWordProgress";

-- DropTable
DROP TABLE "Word";

-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "hashedRt" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "words" (
    "id" INTEGER NOT NULL,
    "word" TEXT NOT NULL,
    "translation" TEXT NOT NULL,

    CONSTRAINT "words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collectionWords" (
    "id" INTEGER NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "wordId" INTEGER NOT NULL,

    CONSTRAINT "collectionWords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userProgress" (
    "id" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "collectionWordId" INTEGER NOT NULL,
    "nextReview" TIMESTAMP(3) NOT NULL,
    "stage" INTEGER NOT NULL,

    CONSTRAINT "userProgress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collectionWords" ADD CONSTRAINT "collectionWords_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collectionWords" ADD CONSTRAINT "collectionWords_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "words"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userProgress" ADD CONSTRAINT "userProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userProgress" ADD CONSTRAINT "userProgress_collectionWordId_fkey" FOREIGN KEY ("collectionWordId") REFERENCES "collectionWords"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
