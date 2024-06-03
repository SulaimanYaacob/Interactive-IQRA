-- AlterTable
ALTER TABLE "TutorApplication" ALTER COLUMN "createdByIdentifier" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Appointment" (
    "appointmentId" TEXT NOT NULL,
    "studentClerkId" TEXT NOT NULL,
    "studentIdentifier" TEXT,
    "comments" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "rejectedComments" TEXT,
    "status" "STATUS" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("appointmentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_appointmentId_key" ON "Appointment"("appointmentId");
