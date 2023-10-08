/*
  Warnings:

  - You are about to drop the `_CollectionToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `collections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userPreferences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CollectionToUser" DROP CONSTRAINT "_CollectionToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_CollectionToUser" DROP CONSTRAINT "_CollectionToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "collections" DROP CONSTRAINT "collections_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_userPreferenceId_fkey";

-- DropTable
DROP TABLE "_CollectionToUser";

-- DropTable
DROP TABLE "collections";

-- DropTable
DROP TABLE "userPreferences";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "PlayType";

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "hashedRt" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Word" (
    "id" INTEGER NOT NULL,
    "word" TEXT NOT NULL,
    "translation" TEXT NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordForCollection" (
    "id" INTEGER NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "wordId" INTEGER NOT NULL,

    CONSTRAINT "CollectionWord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWordProgress" (
    "id" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "collectionWordId" INTEGER NOT NULL,
    "nextReview" TIMESTAMP(3) NOT NULL,
    "stage" INTEGER NOT NULL,

    CONSTRAINT "UserWordProgress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordForCollection" ADD CONSTRAINT "CollectionWord_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordForCollection" ADD CONSTRAINT "CollectionWord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWordProgress" ADD CONSTRAINT "UserWordProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWordProgress" ADD CONSTRAINT "UserWordProgress_collectionWordId_fkey" FOREIGN KEY ("collectionWordId") REFERENCES "WordForCollection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
