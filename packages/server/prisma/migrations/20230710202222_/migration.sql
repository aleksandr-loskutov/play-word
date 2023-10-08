/*
  Warnings:

  - You are about to drop the column `errorCounter` on the `userProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "userProgress" DROP COLUMN "errorCounter",
ADD COLUMN     "mistakes" INTEGER NOT NULL DEFAULT 0;
