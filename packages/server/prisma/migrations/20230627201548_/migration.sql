/*
  Warnings:

  - A unique constraint covering the columns `[wordId,translation]` on the table `translations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "translations_wordId_translation_key" ON "translations"("wordId", "translation");
