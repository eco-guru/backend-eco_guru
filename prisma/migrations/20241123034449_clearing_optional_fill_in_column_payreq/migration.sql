/*
  Warnings:

  - Made the column `payment_date` on table `PaymentRequest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `confirmation_date` on table `PaymentRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PaymentRequest" ALTER COLUMN "payment_date" SET NOT NULL,
ALTER COLUMN "confirmation_date" SET NOT NULL;
