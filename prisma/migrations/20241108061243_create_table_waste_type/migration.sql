/*
  Warnings:

  - The primary key for the `Pricelist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `waste_id` on the `Pricelist` table. All the data in the column will be lost.
  - Added the required column `waste_category_id` to the `Pricelist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waste_type_id` to the `Pricelist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pricelist" DROP CONSTRAINT "Pricelist_waste_id_fkey";

-- AlterTable
ALTER TABLE "Pricelist" DROP CONSTRAINT "Pricelist_pkey",
DROP COLUMN "waste_id",
ADD COLUMN     "waste_category_id" INTEGER NOT NULL,
ADD COLUMN     "waste_type_id" INTEGER NOT NULL,
ADD CONSTRAINT "Pricelist_pkey" PRIMARY KEY ("waste_type_id", "uom_id");

-- CreateTable
CREATE TABLE "WasteType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WasteType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pricelist" ADD CONSTRAINT "Pricelist_waste_category_id_fkey" FOREIGN KEY ("waste_category_id") REFERENCES "WasteCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pricelist" ADD CONSTRAINT "Pricelist_waste_type_id_fkey" FOREIGN KEY ("waste_type_id") REFERENCES "WasteType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
