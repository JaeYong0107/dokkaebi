-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "paymentProvider" TEXT,
ADD COLUMN     "paymentTxId" TEXT,
ADD COLUMN     "recipient" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "recipientPhone" TEXT,
ADD COLUMN     "shippingAddress" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "shippingMemo" TEXT,
ADD COLUMN     "taxInvoiceRequested" BOOLEAN NOT NULL DEFAULT false;
