/*
  Warnings:

  - The primary key for the `userProgress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `userProgress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,userId]` on the table `collections` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "userProgress_collectionWordId_key";

-- AlterTable
ALTER TABLE "collections" ALTER COLUMN "isPublic" DROP NOT NULL;

-- AlterTable
ALTER TABLE "userProgress" DROP CONSTRAINT "userProgress_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "userProgress_pkey" PRIMARY KEY ("userId", "collectionWordId");

-- CreateIndex
CREATE UNIQUE INDEX "collections_name_userId_key" ON "collections"("name", "userId");
