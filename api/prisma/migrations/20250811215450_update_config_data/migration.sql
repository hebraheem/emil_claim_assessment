/*
  Warnings:

  - You are about to drop the `claim_config_configs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `field_options` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `steps` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."claim_config_configs";

-- DropTable
DROP TABLE "public"."field_options";

-- DropTable
DROP TABLE "public"."steps";

-- CreateTable
CREATE TABLE "public"."claimConfig" (
    "id" TEXT NOT NULL,
    "request" JSONB NOT NULL,

    CONSTRAINT "claimConfig_pkey" PRIMARY KEY ("id")
);
