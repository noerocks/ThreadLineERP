/*
  Warnings:

  - Added the required column `color` to the `PurchaseOrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Color" AS ENUM ('RED', 'BLUE', 'GREEN', 'YELLOW', 'BLACK', 'WHITE', 'GRAY', 'ORANGE', 'PURPLE', 'BROWN');

-- AlterTable
ALTER TABLE "PurchaseOrderItem" ADD COLUMN     "color" "Color" NOT NULL;
