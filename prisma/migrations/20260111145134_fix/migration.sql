/*
  Warnings:

  - Added the required column `data` to the `Layer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Layer" ADD COLUMN     "data" JSONB NOT NULL;
