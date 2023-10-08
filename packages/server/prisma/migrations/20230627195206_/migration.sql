-- DropForeignKey
ALTER TABLE "collectionWords" DROP CONSTRAINT "collectionWords_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "collectionWords" DROP CONSTRAINT "collectionWords_wordId_fkey";

-- DropForeignKey
ALTER TABLE "translations" DROP CONSTRAINT "translations_wordId_fkey";

-- DropForeignKey
ALTER TABLE "userCollectionSettings" DROP CONSTRAINT "userCollectionSettings_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "userProgress" DROP CONSTRAINT "userProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "userProgress" DROP CONSTRAINT "userProgress_wordId_fkey";

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collectionWords" ADD CONSTRAINT "collectionWords_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collectionWords" ADD CONSTRAINT "collectionWords_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userProgress" ADD CONSTRAINT "userProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userProgress" ADD CONSTRAINT "userProgress_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userCollectionSettings" ADD CONSTRAINT "userCollectionSettings_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
