/*
  Warnings:

  - A unique constraint covering the columns `[teamId,isCurrent]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Subscription_teamId_key";

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "isCurrent" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_teamId_isCurrent_key" ON "Subscription"("teamId", "isCurrent");
