/*
  Warnings:

  - You are about to drop the column `data` on the `Layer` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Layer` table. All the data in the column will be lost.
  - You are about to drop the `Info` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `area` to the `Layer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Layer" DROP COLUMN "data",
DROP COLUMN "images",
ADD COLUMN     "area" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Info";
