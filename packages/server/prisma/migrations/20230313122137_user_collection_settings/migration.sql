-- CreateTable
CREATE TABLE "userCollectionSettings" (
    "userId" INTEGER NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "stageOneInterval" INTEGER NOT NULL DEFAULT 1,
    "stageTwoInterval" INTEGER NOT NULL DEFAULT 7,
    "stageThreeInterval" INTEGER NOT NULL DEFAULT 30,
    "stageFourInterval" INTEGER NOT NULL DEFAULT 90,
    "stageFiveInterval" INTEGER NOT NULL DEFAULT 180,
    "autoAdvance" BOOLEAN NOT NULL DEFAULT true,
    "showAnswerAfterQuestion" BOOLEAN NOT NULL DEFAULT true,
    "difficultyLevel" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "userCollectionSettings_pkey" PRIMARY KEY ("userId","collectionId")
);

-- AddForeignKey
ALTER TABLE "userCollectionSettings" ADD CONSTRAINT "userCollectionSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userCollectionSettings" ADD CONSTRAINT "userCollectionSettings_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
