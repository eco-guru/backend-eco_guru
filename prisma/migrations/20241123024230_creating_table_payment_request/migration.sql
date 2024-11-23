-- CreateEnum
CREATE TYPE "STATUS_PAYMENT" AS ENUM ('Waiting_For_Confirmation', 'Success', 'Canceled');

-- CreateTable
CREATE TABLE "PaymentRequest" (
    "payment_request_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "request_date" TIMESTAMP(3) NOT NULL,
    "request_amount" INTEGER NOT NULL,
    "expected_payment_date" TIMESTAMP(3) NOT NULL,
    "payment_date" TIMESTAMP(3),
    "payment_by" INTEGER NOT NULL,
    "confirmation_status" "STATUS_PAYMENT" NOT NULL,
    "confirmation_date" TIMESTAMP(3),

    CONSTRAINT "PaymentRequest_pkey" PRIMARY KEY ("payment_request_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentRequest_user_id_payment_by_key" ON "PaymentRequest"("user_id", "payment_by");

-- AddForeignKey
ALTER TABLE "PaymentRequest" ADD CONSTRAINT "PaymentRequest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentRequest" ADD CONSTRAINT "PaymentRequest_payment_by_fkey" FOREIGN KEY ("payment_by") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
