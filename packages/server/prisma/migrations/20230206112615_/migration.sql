-- DropForeignKey
ALTER TABLE "userProgress" DROP CONSTRAINT "userProgress_collectionWordId_fkey";

-- DropIndex
DROP INDEX "collectionWords_collectionId_key";

-- DropIndex
DROP INDEX "collectionWords_collectionId_wordId_key";

-- DropIndex
DROP INDEX "collectionWords_wordId_key";
