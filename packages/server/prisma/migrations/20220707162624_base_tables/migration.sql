-- CreateTable
CREATE TABLE "collection" (
    "id_collection" INTEGER NOT NULL,
    "questionId" INTEGER,
    "answerId" INTEGER
);

-- CreateTable
CREATE TABLE "collection_answers" (
    "answerId" INTEGER NOT NULL,
    "id_collection" INTEGER,
    "answer" VARCHAR(255),

    CONSTRAINT "_copy_2" PRIMARY KEY ("answerId")
);

-- CreateTable
CREATE TABLE "collection_questions" (
    "questionId" INTEGER NOT NULL,
    "id_collection" INTEGER,
    "question" VARCHAR(255),

    CONSTRAINT "_copy_3" PRIMARY KEY ("questionId")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" INTEGER NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6),
    "createdBy" INTEGER,
    "isPublic" BOOLEAN,
    "isDeleted" BOOLEAN,
    "type" TEXT,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_collection" (
    "userId" INTEGER NOT NULL,
    "collectionId" INTEGER,
    "isActive" BOOLEAN,
    "timeAdded" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6)
);

-- CreateTable
CREATE TABLE "user_questions" (
    "userId" INTEGER NOT NULL,
    "questionId" INTEGER,
    "successCount" INTEGER,
    "iteration" INTEGER,
    "isLearned" BOOLEAN,
    "lastSuccessTime" TIMESTAMP(6)
);
