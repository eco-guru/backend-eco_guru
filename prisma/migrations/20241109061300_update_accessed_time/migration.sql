/*
  Warnings:

  - You are about to alter the column `accessed_time` on the `LogArticles` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "LogArticles" ALTER COLUMN "accessed_time" SET DATA TYPE INTEGER;
