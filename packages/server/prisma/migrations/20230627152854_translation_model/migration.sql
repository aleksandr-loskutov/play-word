/*
  Warnings:

  - You are about to drop the column `translation` on the `words` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "words_word_translation_key";

-- AlterTable
ALTER TABLE "words" DROP COLUMN "translation";

-- CreateTable
CREATE TABLE "translations" (
    "id" SERIAL NOT NULL,
    "wordId" INTEGER NOT NULL,
    "translation" TEXT NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "words"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
