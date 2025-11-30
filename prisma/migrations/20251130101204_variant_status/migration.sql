/*
  Warnings:

  - You are about to drop the column `status` on the `PurchaseOrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PurchaseOrderItem" DROP COLUMN "status";

-- DropEnum
DROP TYPE "public"."PurchaseOrderItemStatus";
