-- CreateTable
CREATE TABLE "budgets" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT,
    "manualClientName" TEXT,
    "manualClientCuit" TEXT,
    "netAmount" DOUBLE PRECISION NOT NULL,
    "hasIva" BOOLEAN NOT NULL DEFAULT false,
    "ivaPercentage" DOUBLE PRECISION,
    "ivaValue" DOUBLE PRECISION,
    "hasIibb" BOOLEAN NOT NULL DEFAULT false,
    "iibbPercentage" DOUBLE PRECISION,
    "iibbValue" DOUBLE PRECISION,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_items" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "budgetId" TEXT NOT NULL,
    "structureId" TEXT,
    "manualName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budget_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_items" ADD CONSTRAINT "budget_items_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "budgets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_items" ADD CONSTRAINT "budget_items_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;
