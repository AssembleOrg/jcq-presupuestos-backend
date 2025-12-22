/*
  Warnings:

  - You are about to drop the column `hoursSunday` on the `WorkRecord` table. All the data in the column will be lost.
  - Made the column `hoursSaturday` on table `WorkRecord` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "WorkRecord" DROP COLUMN "hoursSunday",
ALTER COLUMN "hoursSaturday" SET NOT NULL;
