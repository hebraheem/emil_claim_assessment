-- CreateTable
CREATE TABLE "public"."Claim" (
    "claimId" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dateOfIncident" TEXT NOT NULL,
    "dateOfSubmission" TEXT NOT NULL,
    "incidentType" TEXT NOT NULL,
    "attributes" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rejectionReason" TEXT,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("claimId")
);

-- CreateTable
CREATE TABLE "public"."ClaimMeta" (
    "id" SERIAL NOT NULL,
    "claimId" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "ClaimMeta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClaimMeta_claimId_idx" ON "public"."ClaimMeta"("claimId");

-- CreateIndex
CREATE UNIQUE INDEX "ClaimMeta_claimId_key_key" ON "public"."ClaimMeta"("claimId", "key");
