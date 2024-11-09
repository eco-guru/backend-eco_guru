/*
  Warnings:

  - The primary key for the `Pricelist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `waste_category_id` on the `Pricelist` table. All the data in the column will be lost.
  - Added the required column `waste_category_id` to the `WasteType` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pricelist" DROP CONSTRAINT "Pricelist_waste_category_id_fkey";

-- AlterTable
ALTER TABLE "Pricelist" DROP CONSTRAINT "Pricelist_pkey",
DROP COLUMN "waste_category_id",
ADD CONSTRAINT "Pricelist_pkey" PRIMARY KEY ("waste_type_id", "uom_id");

-- AlterTable
ALTER TABLE "WasteType" ADD COLUMN     "waste_category_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "WasteType" ADD CONSTRAINT "WasteType_waste_category_id_fkey" FOREIGN KEY ("waste_category_id") REFERENCES "WasteCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
