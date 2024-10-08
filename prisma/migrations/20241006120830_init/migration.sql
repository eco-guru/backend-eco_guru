-- CreateTable
CREATE TABLE "Roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Privileges" (
    "id_privilege" SERIAL NOT NULL,

    CONSTRAINT "Privileges_pkey" PRIMARY KEY ("id_privilege")
);

-- CreateTable
CREATE TABLE "Authorizations" (
    "id_role" INTEGER NOT NULL,
    "id_privilege" INTEGER NOT NULL,

    CONSTRAINT "Authorizations_pkey" PRIMARY KEY ("id_role")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteCategory" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WasteCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UOM" (
    "id" SERIAL NOT NULL,
    "unit" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UOM_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "transaction_date" TIMESTAMP(3),
    "total" INTEGER,
    "approved_by" INTEGER,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pricelist" (
    "waste_id" INTEGER NOT NULL,
    "uom_id" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Pricelist_pkey" PRIMARY KEY ("waste_id","uom_id")
);

-- CreateTable
CREATE TABLE "TransactionData" (
    "transaction_id" INTEGER NOT NULL,
    "waste_id" INTEGER NOT NULL,
    "uom_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL
);

-- CreateTable
CREATE TABLE "Videos" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "thumbnail_url" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "upload_date" TIMESTAMP(3) NOT NULL,
    "uploaded_by" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "video_order" INTEGER NOT NULL,

    CONSTRAINT "Videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Articles" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL,
    "article_order" INTEGER NOT NULL,

    CONSTRAINT "Articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogArticles" (
    "article_id" INTEGER NOT NULL,
    "accessed_by" TEXT NOT NULL,
    "accessed_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LogArticles_pkey" PRIMARY KEY ("article_id","accessed_by")
);

-- CreateTable
CREATE TABLE "LogVideos" (
    "video_id" INTEGER NOT NULL,
    "accessed_by" TEXT NOT NULL,
    "accessed_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LogVideos_pkey" PRIMARY KEY ("video_id","accessed_by")
);

-- CreateIndex
CREATE UNIQUE INDEX "Roles_name_key" ON "Roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Authorizations_id_role_id_privilege_key" ON "Authorizations"("id_role", "id_privilege");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "Users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Users_role_id_key" ON "Users"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionData_transaction_id_waste_id_uom_id_quantity_pri_key" ON "TransactionData"("transaction_id", "waste_id", "uom_id", "quantity", "price");

-- AddForeignKey
ALTER TABLE "Authorizations" ADD CONSTRAINT "Authorizations_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authorizations" ADD CONSTRAINT "Authorizations_id_privilege_fkey" FOREIGN KEY ("id_privilege") REFERENCES "Privileges"("id_privilege") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "WasteCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pricelist" ADD CONSTRAINT "Pricelist_waste_id_fkey" FOREIGN KEY ("waste_id") REFERENCES "WasteCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pricelist" ADD CONSTRAINT "Pricelist_uom_id_fkey" FOREIGN KEY ("uom_id") REFERENCES "UOM"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionData" ADD CONSTRAINT "TransactionData_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionData" ADD CONSTRAINT "TransactionData_waste_id_fkey" FOREIGN KEY ("waste_id") REFERENCES "WasteCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionData" ADD CONSTRAINT "TransactionData_uom_id_fkey" FOREIGN KEY ("uom_id") REFERENCES "UOM"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogArticles" ADD CONSTRAINT "LogArticles_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogVideos" ADD CONSTRAINT "LogVideos_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
