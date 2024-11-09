/*
  Warnings:

  - You are about to drop the column `waste_id` on the `TransactionData` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transaction_id,waste_type_id,uom_id,quantity,price]` on the table `TransactionData` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `waste_type_id` to the `TransactionData` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TransactionData" DROP CONSTRAINT "TransactionData_waste_id_fkey";

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_approved_by_fkey";

-- DropIndex
DROP INDEX "TransactionData_transaction_id_waste_id_uom_id_quantity_pri_key";

-- AlterTable
ALTER TABLE "TransactionData" DROP COLUMN "waste_id",
ADD COLUMN     "waste_type_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TransactionData_transaction_id_waste_type_id_uom_id_quantit_key" ON "TransactionData"("transaction_id", "waste_type_id", "uom_id", "quantity", "price");

-- AddForeignKey
ALTER TABLE "TransactionData" ADD CONSTRAINT "TransactionData_waste_type_id_fkey" FOREIGN KEY ("waste_type_id") REFERENCES "WasteType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
