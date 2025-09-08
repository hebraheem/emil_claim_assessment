-- CreateTable
CREATE TABLE "Claim" (
    "claimId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dateOfIncident" TEXT NOT NULL,
    "dateOfSubmission" TEXT NOT NULL,
    "incidentType" TEXT NOT NULL,
    "attributes" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "rejectionReason" TEXT
);

-- CreateTable
CREATE TABLE "ClaimMeta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "claimId" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "claimConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "request" JSONB NOT NULL
);

-- CreateIndex
CREATE INDEX "ClaimMeta_claimId_idx" ON "ClaimMeta"("claimId");

-- CreateIndex
CREATE UNIQUE INDEX "ClaimMeta_claimId_key_key" ON "ClaimMeta"("claimId", "key");
