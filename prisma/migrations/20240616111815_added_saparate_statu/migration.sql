/*
  Warnings:

  - You are about to drop the column `rejectedComments` on the `Appointment` table. All the data in the column will be lost.
  - Changed the type of `status` on the `Appointment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `TutorApplication` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TUTOR_APPLICATION_STATUS" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "APPOINTMENT_STATUS" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "rejectedComments",
ADD COLUMN     "cancelReason" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "APPOINTMENT_STATUS" NOT NULL;

-- AlterTable
ALTER TABLE "TutorApplication" DROP COLUMN "status",
ADD COLUMN     "status" "TUTOR_APPLICATION_STATUS" NOT NULL;

-- DropEnum
DROP TYPE "STATUS";
