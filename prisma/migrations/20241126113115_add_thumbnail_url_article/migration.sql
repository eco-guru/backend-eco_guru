/*
  Warnings:

  - Added the required column `thumbnail_url` to the `Articles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Articles" ADD COLUMN     "thumbnail_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LogArticles" ALTER COLUMN "accessed_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "LogVideos" ALTER COLUMN "accessed_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Videos" ADD CONSTRAINT "Videos_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "Users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
