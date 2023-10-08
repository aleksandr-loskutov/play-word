-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "isPublic" BOOLEAN DEFAULT true;
