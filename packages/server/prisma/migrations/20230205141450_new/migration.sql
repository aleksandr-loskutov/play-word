-- AlterTable
CREATE SEQUENCE "collectionwords_id_seq";
ALTER TABLE "collectionWords" ALTER COLUMN "id" SET DEFAULT nextval('collectionwords_id_seq');
ALTER SEQUENCE "collectionwords_id_seq" OWNED BY "collectionWords"."id";

-- AlterTable
CREATE SEQUENCE "collections_id_seq";
ALTER TABLE "collections" ALTER COLUMN "id" SET DEFAULT nextval('collections_id_seq');
ALTER SEQUENCE "collections_id_seq" OWNED BY "collections"."id";

-- AlterTable
CREATE SEQUENCE "userprogress_id_seq";
ALTER TABLE "userProgress" ALTER COLUMN "id" SET DEFAULT nextval('userprogress_id_seq');
ALTER SEQUENCE "userprogress_id_seq" OWNED BY "userProgress"."id";

-- AlterTable
CREATE SEQUENCE "users_id_seq";
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT nextval('users_id_seq'),
ALTER COLUMN "hashedRt" DROP NOT NULL;
ALTER SEQUENCE "users_id_seq" OWNED BY "users"."id";

-- AlterTable
CREATE SEQUENCE "words_id_seq";
ALTER TABLE "words" ALTER COLUMN "id" SET DEFAULT nextval('words_id_seq');
ALTER SEQUENCE "words_id_seq" OWNED BY "words"."id";
