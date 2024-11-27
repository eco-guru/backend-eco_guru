/*
  Warnings:

  - The values [Waiting_For_Confirmation,Success,Canceled] on the enum `STATUS_PAYMENT` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "STATUS_PAYMENT_new" AS ENUM ('Sedang_diproses', 'Ambil_uang', 'Selesai', 'Batal');
ALTER TABLE "PaymentRequest" ALTER COLUMN "confirmation_status" TYPE "STATUS_PAYMENT_new" USING ("confirmation_status"::text::"STATUS_PAYMENT_new");
ALTER TYPE "STATUS_PAYMENT" RENAME TO "STATUS_PAYMENT_old";
ALTER TYPE "STATUS_PAYMENT_new" RENAME TO "STATUS_PAYMENT";
DROP TYPE "STATUS_PAYMENT_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "PaymentRequest" DROP CONSTRAINT "PaymentRequest_payment_by_fkey";

-- AlterTable
ALTER TABLE "PaymentRequest" ALTER COLUMN "payment_by" DROP NOT NULL,
ALTER COLUMN "confirmation_date" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PaymentRequest" ADD CONSTRAINT "PaymentRequest_payment_by_fkey" FOREIGN KEY ("payment_by") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
