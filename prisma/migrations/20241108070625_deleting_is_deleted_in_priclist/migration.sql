/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Pricelist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pricelist" DROP COLUMN "isDeleted",
ALTER COLUMN "isActive" SET DEFAULT true;
