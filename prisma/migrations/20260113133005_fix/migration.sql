/*
  Warnings:

  - Added the required column `fileName` to the `Kmz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Kmz" ADD COLUMN     "fileName" TEXT NOT NULL;
