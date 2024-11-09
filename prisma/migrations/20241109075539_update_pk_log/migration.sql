/*
  Warnings:

  - The primary key for the `LogArticles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LogVideos` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "LogArticles" DROP CONSTRAINT "LogArticles_pkey",
ADD CONSTRAINT "LogArticles_pkey" PRIMARY KEY ("article_id", "accessed_by", "accessed_time");

-- AlterTable
ALTER TABLE "LogVideos" DROP CONSTRAINT "LogVideos_pkey",
ADD CONSTRAINT "LogVideos_pkey" PRIMARY KEY ("video_id", "accessed_by", "accessed_time");
