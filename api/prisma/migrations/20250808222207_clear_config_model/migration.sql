/*
  Warnings:

  - You are about to drop the `ClaimConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClaimConfigConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClaimConfigOption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ClaimConfigConfig" DROP CONSTRAINT "ClaimConfigConfig_claimConfigId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClaimConfigOption" DROP CONSTRAINT "ClaimConfigOption_configId_fkey";

-- DropTable
DROP TABLE "public"."ClaimConfig";

-- DropTable
DROP TABLE "public"."ClaimConfigConfig";

-- DropTable
DROP TABLE "public"."ClaimConfigOption";
