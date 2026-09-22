/*
  Warnings:

  - You are about to drop the column `chapterNumber` on the `Chapter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "chapterNumber",
ADD COLUMN     "parentId" INTEGER,
ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
