-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "collabValuePerHour" DOUBLE PRECISION,
ADD COLUMN     "collabWorkersCount" INTEGER,
ADD COLUMN     "collaboratorId" TEXT;

-- CreateTable
CREATE TABLE "collaborators" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "companyName" TEXT,
    "cuit" TEXT,
    "quantityWorkers" DOUBLE PRECISION NOT NULL,
    "valuePerHour" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "collaborators_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "collaborators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
