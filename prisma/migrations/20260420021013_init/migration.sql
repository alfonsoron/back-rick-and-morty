-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "name" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "cp" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteEpisode" (
    "id" TEXT NOT NULL,
    "episodeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "episodeCode" TEXT NOT NULL,
    "airDate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FavoriteEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EpisodeComment" (
    "id" TEXT NOT NULL,
    "episodeId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "EpisodeComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EpisodeCommentSetting" (
    "id" TEXT NOT NULL,
    "episodeId" INTEGER NOT NULL,
    "commentsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EpisodeCommentSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_mail_key" ON "User"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteEpisode_userId_episodeId_key" ON "FavoriteEpisode"("userId", "episodeId");

-- CreateIndex
CREATE UNIQUE INDEX "EpisodeCommentSetting_episodeId_key" ON "EpisodeCommentSetting"("episodeId");

-- AddForeignKey
ALTER TABLE "FavoriteEpisode" ADD CONSTRAINT "FavoriteEpisode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EpisodeComment" ADD CONSTRAINT "EpisodeComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
