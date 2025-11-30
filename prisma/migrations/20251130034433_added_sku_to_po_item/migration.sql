/*
  Warnings:

  - Added the required column `sku` to the `PurchaseOrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PurchaseOrderItem" ADD COLUMN     "sku" TEXT NOT NULL;
