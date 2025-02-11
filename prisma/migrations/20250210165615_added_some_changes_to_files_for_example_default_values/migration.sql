/*
  Warnings:

  - You are about to drop the column `userId` on the `Song` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Song" DROP COLUMN "userId",
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "title" SET DEFAULT 'untitled',
ALTER COLUMN "author" SET DEFAULT 'unknown';
