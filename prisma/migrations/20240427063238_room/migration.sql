-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TUTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Room" (
    "createdByClerkId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "maxUsers" INTEGER NOT NULL,
    "createdByIdentifier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("createdByIdentifier")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_createdByClerkId_key" ON "Room"("createdByClerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomId_key" ON "Room"("roomId");

-- CreateIndex
CREATE INDEX "Room_createdByClerkId_idx" ON "Room"("createdByClerkId");
