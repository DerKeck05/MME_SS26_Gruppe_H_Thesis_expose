/*
  Warnings:

  - You are about to drop the column `date` on the `CalendarEntry` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Chapter` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `CalendarEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `CalendarEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CalendarEntry" DROP COLUMN "date",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "content";
