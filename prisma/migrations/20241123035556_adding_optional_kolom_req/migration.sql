-- AlterTable
ALTER TABLE "PaymentRequest" ALTER COLUMN "expected_payment_date" DROP NOT NULL,
ALTER COLUMN "payment_date" DROP NOT NULL;
