-- CreateTable
CREATE TABLE "public"."Steps" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ClaimConfigConfig" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "placeholder" TEXT,
    "required" BOOLEAN,
    "validation" TEXT,
    "default_value" TEXT,
    "orderingNumber" INTEGER,
    "stepsId" TEXT NOT NULL,

    CONSTRAINT "ClaimConfigConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FieldOption" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "configId" TEXT NOT NULL,

    CONSTRAINT "FieldOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ClaimConfigConfig" ADD CONSTRAINT "ClaimConfigConfig_stepsId_fkey" FOREIGN KEY ("stepsId") REFERENCES "public"."Steps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FieldOption" ADD CONSTRAINT "FieldOption_configId_fkey" FOREIGN KEY ("configId") REFERENCES "public"."ClaimConfigConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
