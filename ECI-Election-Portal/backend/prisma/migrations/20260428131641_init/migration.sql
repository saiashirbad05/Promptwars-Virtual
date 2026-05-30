-- CreateEnum
CREATE TYPE "Role" AS ENUM ('VOTER', 'ADMIN', 'OFFICIAL');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('FILED', 'UNDER_REVIEW', 'INVESTIGATED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "epicNumber" TEXT,
    "role" "Role" NOT NULL DEFAULT 'VOTER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "party" TEXT NOT NULL,
    "constituency" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "assets" BIGINT NOT NULL,
    "criminalCases" INTEGER NOT NULL DEFAULT 0,
    "education" TEXT NOT NULL,
    "photoUrl" TEXT,
    "socialTwitter" TEXT,
    "socialFacebook" TEXT,
    "socialInstagram" TEXT,
    "socialWebsite" TEXT,
    "affidavitUrl" TEXT,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grievance" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT,
    "constituency" TEXT,
    "evidenceUrl" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'FILED',
    "severity" "Severity" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grievance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Turnout" (
    "id" TEXT NOT NULL,
    "constituency" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "predicted" DOUBLE PRECISION NOT NULL,
    "actual" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Turnout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_epicNumber_key" ON "User"("epicNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Grievance_ticketId_key" ON "Grievance"("ticketId");

-- AddForeignKey
ALTER TABLE "Grievance" ADD CONSTRAINT "Grievance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
