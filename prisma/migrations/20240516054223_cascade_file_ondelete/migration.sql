-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_applicationId_fkey";

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "TutorApplication"("applicationId") ON DELETE CASCADE ON UPDATE CASCADE;
