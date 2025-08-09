/*
  Warnings:

  - Changed the type of `configs` on the `ClaimConfig` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."ClaimConfig" DROP COLUMN "configs",
ADD COLUMN     "configs" JSONB NOT NULL;
