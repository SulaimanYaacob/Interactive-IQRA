/*
  Warnings:

  - Changed the type of `status` on the `TutorApplication` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('STUDENT', 'TUTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- AlterTable
ALTER TABLE "TutorApplication" DROP COLUMN "status",
ADD COLUMN     "status" "STATUS" NOT NULL;

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "Status";
