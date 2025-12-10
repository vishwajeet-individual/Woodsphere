-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "buyerNote" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "makerVideo" TEXT,
ADD COLUMN     "materialOrigin" TEXT,
ADD COLUMN     "story" TEXT;
