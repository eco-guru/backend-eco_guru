/*
  Warnings:

  - Added the required column `name` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "name" TEXT;
