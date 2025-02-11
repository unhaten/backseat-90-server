-- CreateTable
CREATE TABLE "LikedSong" (
    "userId" TEXT NOT NULL,
    "songId" INTEGER NOT NULL,

    CONSTRAINT "LikedSong_pkey" PRIMARY KEY ("userId","songId")
);

-- AddForeignKey
ALTER TABLE "LikedSong" ADD CONSTRAINT "LikedSong_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedSong" ADD CONSTRAINT "LikedSong_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
