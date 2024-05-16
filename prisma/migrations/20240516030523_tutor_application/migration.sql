-- CreateTable
CREATE TABLE "TutorApplication" (
    "applicationId" TEXT NOT NULL,
    "createdByIdentifier" TEXT NOT NULL,
    "createdByClerkId" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TutorApplication_pkey" PRIMARY KEY ("applicationId")
);

-- CreateTable
CREATE TABLE "File" (
    "fileId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("fileId")
);

-- CreateIndex
CREATE UNIQUE INDEX "TutorApplication_applicationId_key" ON "TutorApplication"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "File_fileId_key" ON "File"("fileId");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "TutorApplication"("applicationId") ON DELETE RESTRICT ON UPDATE CASCADE;
