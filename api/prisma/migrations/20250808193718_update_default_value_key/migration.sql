/*
  Warnings:

  - You are about to drop the column `default_value` on the `ClaimConfigConfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ClaimConfigConfig" DROP COLUMN "default_value",
ADD COLUMN     "defaultValue" TEXT;
