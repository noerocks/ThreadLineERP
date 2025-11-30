/*
  Warnings:

  - You are about to drop the column `color` on the `PurchaseOrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `PurchaseOrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `shoeSize` on the `PurchaseOrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `PurchaseOrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `PurchaseOrderItem` table. All the data in the column will be lost.
  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productVariantId` to the `PurchaseOrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Inventory" DROP CONSTRAINT "Inventory_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PurchaseOrderItem" DROP CONSTRAINT "PurchaseOrderItem_productId_fkey";

-- AlterTable
ALTER TABLE "PurchaseOrderItem" DROP COLUMN "color",
DROP COLUMN "productId",
DROP COLUMN "shoeSize",
DROP COLUMN "size",
DROP COLUMN "sku",
ADD COLUMN     "productVariantId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Inventory";

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "size" "ShirtSize",
    "shoeSize" DOUBLE PRECISION DEFAULT 0,
    "color" "Color" NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
