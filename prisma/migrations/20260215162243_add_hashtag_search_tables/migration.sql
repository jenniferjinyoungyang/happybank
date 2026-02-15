-- CreateTable: Add Hashtag model for normalized hashtag storage
CREATE TABLE "Hashtag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Hashtag_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Add MemoryHashtag join table for many-to-many relationship
CREATE TABLE "MemoryHashtag" (
    "id" SERIAL NOT NULL,
    "memoryId" INTEGER NOT NULL,
    "hashtagId" INTEGER NOT NULL,

    CONSTRAINT "MemoryHashtag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: Fast hashtag name lookup
CREATE UNIQUE INDEX "Hashtag_name_key" ON "Hashtag"("name");

-- CreateIndex: Fast hashtag search
CREATE INDEX "Hashtag_name_idx" ON "Hashtag"("name");

-- CreateIndex: Fast memory-hashtag joins by hashtag
CREATE INDEX "MemoryHashtag_hashtagId_idx" ON "MemoryHashtag"("hashtagId");

-- CreateIndex: Fast memory-hashtag joins by memory
CREATE INDEX "MemoryHashtag_memoryId_idx" ON "MemoryHashtag"("memoryId");

-- CreateUniqueConstraint: Prevent duplicate memory-hashtag pairs
CREATE UNIQUE INDEX "MemoryHashtag_memoryId_hashtagId_key" ON "MemoryHashtag"("memoryId", "hashtagId");

-- AddForeignKey: Link MemoryHashtag to Memory
ALTER TABLE "MemoryHashtag" ADD CONSTRAINT "MemoryHashtag_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "Memory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: Link MemoryHashtag to Hashtag
ALTER TABLE "MemoryHashtag" ADD CONSTRAINT "MemoryHashtag_hashtagId_fkey" FOREIGN KEY ("hashtagId") REFERENCES "Hashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
