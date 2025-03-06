/*
  Warnings:

  - You are about to drop the column `author` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `file` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Song` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Song" DROP COLUMN "author",
DROP COLUMN "file",
DROP COLUMN "thumbnail",
DROP COLUMN "title";
