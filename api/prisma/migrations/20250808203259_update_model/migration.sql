/*
  Warnings:

  - You are about to drop the `ClaimConfigConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FieldOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Steps` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ClaimConfigConfig" DROP CONSTRAINT "ClaimConfigConfig_stepsId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FieldOption" DROP CONSTRAINT "FieldOption_configId_fkey";

-- DropTable
DROP TABLE "public"."ClaimConfigConfig";

-- DropTable
DROP TABLE "public"."FieldOption";

-- DropTable
DROP TABLE "public"."Steps";

-- CreateTable
CREATE TABLE "public"."ClaimConfig" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "configs" JSONB[],

    CONSTRAINT "ClaimConfig_pkey" PRIMARY KEY ("id")
);
