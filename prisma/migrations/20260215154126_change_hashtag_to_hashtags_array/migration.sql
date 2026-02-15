-- AlterTable: Change hashtag column to hashtags array
-- Step 1: Add new hashtags column as text array
ALTER TABLE "Memory" ADD COLUMN "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Step 2: Migrate existing data: convert single hashtag to array
-- If hashtag is empty/null, set to empty array, otherwise wrap in array
UPDATE "Memory" 
SET "hashtags" = CASE 
  WHEN "hashtag" IS NULL OR "hashtag" = '' THEN ARRAY[]::TEXT[]
  ELSE ARRAY["hashtag"]::TEXT[]
END;

-- Step 3: Drop the old hashtag column
ALTER TABLE "Memory" DROP COLUMN "hashtag";
