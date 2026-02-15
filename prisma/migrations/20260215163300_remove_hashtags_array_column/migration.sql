-- AlterTable: Remove hashtags array column (no longer needed, using relations instead)
ALTER TABLE "Memory" DROP COLUMN "hashtags";
