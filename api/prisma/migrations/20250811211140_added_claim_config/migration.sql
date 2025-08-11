-- CreateTable
CREATE TABLE "public"."steps" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "configs" JSONB NOT NULL,
    "fixed" BOOLEAN,
    "orderingNumber" INTEGER,

    CONSTRAINT "steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."claim_config_configs" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "placeholder" TEXT,
    "required" BOOLEAN,
    "validation" TEXT,
    "defaultValue" TEXT,
    "orderingNumber" INTEGER,
    "dependsOn" JSONB,

    CONSTRAINT "claim_config_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."field_options" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "field_options_pkey" PRIMARY KEY ("id")
);
