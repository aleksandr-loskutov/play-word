/*
  Warnings:

  - You are about to drop the column `createdBy` on the `collections` table. All the data in the column will be lost.
  - You are about to drop the `collection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `collection_answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `collection_questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_collection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_questions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `collections` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `collections` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `collections` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `collections` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isPublic` on table `collections` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `collections` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
CREATE SEQUENCE "collections_id_seq";
ALTER TABLE "collections" DROP COLUMN "createdBy",
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('collections_id_seq'),
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "isPublic" SET NOT NULL,
ALTER COLUMN "isPublic" SET DEFAULT false,
ALTER COLUMN "isDeleted" SET DEFAULT false,
ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'classic';
ALTER SEQUENCE "collections_id_seq" OWNED BY "collections"."id";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "preferences" JSONB;

-- DropTable
DROP TABLE "collection";

-- DropTable
DROP TABLE "collection_answers";

-- DropTable
DROP TABLE "collection_questions";

-- DropTable
DROP TABLE "user_collection";

-- DropTable
DROP TABLE "user_questions";

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
