-- CreateTable
CREATE TABLE "Kmz" (
    "id" TEXT NOT NULL,
    "idx" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kmz_pkey" PRIMARY KEY ("id")
);
