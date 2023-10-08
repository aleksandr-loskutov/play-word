/*
  Warnings:

  - Made the column `isPublic` on table `collections` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "collections" ALTER COLUMN "isPublic" SET NOT NULL;
