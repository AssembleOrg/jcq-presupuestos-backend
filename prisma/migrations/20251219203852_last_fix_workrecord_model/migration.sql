/*
  Warnings:

  - Added the required column `hoursSaturday` to the `WorkRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hoursSunday` to the `WorkRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkRecord" ADD COLUMN     "hoursSaturday" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "hoursSunday" DOUBLE PRECISION NOT NULL;
