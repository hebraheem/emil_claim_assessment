/*
  Warnings:

  - You are about to drop the column `configs` on the `ClaimConfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ClaimConfig" DROP COLUMN "configs";

-- CreateTable
CREATE TABLE "public"."ClaimConfigConfig" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT,
    "validation" TEXT,
    "orderingNumber" INTEGER,
    "defaultValue" TEXT,
    "placeholder" TEXT,
    "required" BOOLEAN,
    "claimConfigId" TEXT NOT NULL,

    CONSTRAINT "ClaimConfigConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ClaimConfigOption" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "configId" TEXT NOT NULL,

    CONSTRAINT "ClaimConfigOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ClaimConfigConfig" ADD CONSTRAINT "ClaimConfigConfig_claimConfigId_fkey" FOREIGN KEY ("claimConfigId") REFERENCES "public"."ClaimConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClaimConfigOption" ADD CONSTRAINT "ClaimConfigOption_configId_fkey" FOREIGN KEY ("configId") REFERENCES "public"."ClaimConfigConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
