-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "author" TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN     "thumbnail" TEXT NOT NULL DEFAULT 'https://placehold.co/600x400',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'untitled';
