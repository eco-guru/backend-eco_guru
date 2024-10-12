/*
  Warnings:

  - You are about to drop the column `name` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Scheduled', 'Completed', 'Cancelled');

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "name",
ADD COLUMN     "profile_picture" VARCHAR(255);

-- CreateTable
CREATE TABLE "WastePickUp" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "pick_up_date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WastePickUp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- AddForeignKey
ALTER TABLE "WastePickUp" ADD CONSTRAINT "WastePickUp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
