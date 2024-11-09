/*
  Warnings:

  - The primary key for the `Pricelist` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Pricelist" DROP CONSTRAINT "Pricelist_pkey",
ADD CONSTRAINT "Pricelist_pkey" PRIMARY KEY ("waste_type_id", "uom_id", "waste_category_id");
