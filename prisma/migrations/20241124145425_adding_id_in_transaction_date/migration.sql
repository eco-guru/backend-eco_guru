-- AlterTable
ALTER TABLE "TransactionData" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "TransactionData_pkey" PRIMARY KEY ("id");
