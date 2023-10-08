-- AddForeignKey
ALTER TABLE "userProgress" ADD CONSTRAINT "userProgress_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "words"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
