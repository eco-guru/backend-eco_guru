/*
  Warnings:

  - You are about to drop the column `category` on the `Articles` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Articles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Videos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Articles" DROP COLUMN "category",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Videos" ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "VideoCategory" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "VideoCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleCategory" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "ArticleCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Videos" ADD CONSTRAINT "Videos_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "VideoCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ArticleCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
