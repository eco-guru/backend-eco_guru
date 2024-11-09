/*
  Warnings:

  - Changed the type of `accessed_time` on the `LogArticles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "LogArticles" DROP COLUMN "accessed_time",
ADD COLUMN     "accessed_time" BIGINT NOT NULL;
