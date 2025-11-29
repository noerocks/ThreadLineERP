-- CreateEnum
CREATE TYPE "PurchaseOrderItemStatus" AS ENUM ('PENDING', 'IN_STOCK', 'OUT_OF_STOCK');

-- AlterTable
ALTER TABLE "PurchaseOrderItem" ADD COLUMN     "status" "PurchaseOrderItemStatus" NOT NULL DEFAULT 'PENDING';
