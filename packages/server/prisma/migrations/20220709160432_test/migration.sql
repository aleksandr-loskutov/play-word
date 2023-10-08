/*
  Warnings:

  - A unique constraint covering the columns `[name,createdBy]` on the table `collections` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "collections_name_createdBy_key" ON "collections"("name", "createdBy");
