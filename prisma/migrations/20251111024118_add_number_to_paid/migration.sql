-- AlterTable
ALTER TABLE "paids" ADD COLUMN "number" TEXT;

-- Poblar números secuenciales para registros existentes
DO $$
DECLARE
    rec RECORD;
    seq_num INTEGER := 1;
    number_value TEXT;
BEGIN
    FOR rec IN 
        SELECT id, "createdAt" 
        FROM "paids" 
        WHERE "number" IS NULL 
        ORDER BY "createdAt" ASC
    LOOP
        number_value := '001-' || LPAD(seq_num::TEXT, 5, '0');
        UPDATE "paids" SET "number" = number_value WHERE id = rec.id;
        seq_num := seq_num + 1;
    END LOOP;
END $$;

-- CreateIndex
CREATE UNIQUE INDEX "paids_number_key" ON "paids"("number");

-- CreateIndex
CREATE INDEX "paids_number_idx" ON "paids"("number");

