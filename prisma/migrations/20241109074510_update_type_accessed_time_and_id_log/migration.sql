/*
  Warnings:

  - The primary key for the `LogArticles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LogVideos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `accessed_time` on the `LogArticles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "LogArticles" DROP CONSTRAINT "LogArticles_pkey",
DROP COLUMN "accessed_time",
ADD COLUMN     "accessed_time" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "LogArticles_pkey" PRIMARY KEY ("article_id");

-- AlterTable
ALTER TABLE "LogVideos" DROP CONSTRAINT "LogVideos_pkey",
ADD CONSTRAINT "LogVideos_pkey" PRIMARY KEY ("video_id");
