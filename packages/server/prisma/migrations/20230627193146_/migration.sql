/*
  Warnings:

  - A unique constraint covering the columns `[word]` on the table `words` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "words_word_key" ON "words"("word");
