/*
  Warnings:

  - You are about to drop the column `type` on the `collections` table. All the data in the column will be lost.
  - You are about to drop the column `preferences` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PlayType" AS ENUM ('classic', 'q_and_a');

-- AlterTable
ALTER TABLE "collections" DROP COLUMN "type",
ADD COLUMN     "playType" "PlayType" NOT NULL DEFAULT 'classic';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "preferences";

-- CreateTable
CREATE TABLE "userPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailUpdates" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "userPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userPreferences_userId_key" ON "userPreferences"("userId");

-- AddForeignKey
ALTER TABLE "userPreferences" ADD CONSTRAINT "userPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
