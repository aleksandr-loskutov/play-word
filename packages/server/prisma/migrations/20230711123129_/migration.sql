-- DropForeignKey
ALTER TABLE "userProgress" DROP CONSTRAINT "userProgress_collectionId_fkey";

-- AddForeignKey
ALTER TABLE "userProgress" ADD CONSTRAINT "userProgress_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
