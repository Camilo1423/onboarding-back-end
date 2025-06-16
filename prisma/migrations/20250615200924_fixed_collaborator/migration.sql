/*
  Warnings:

  - You are about to drop the column `technicalOnboardingDate` on the `Collaborator` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Collaborator" DROP COLUMN "technicalOnboardingDate",
ADD COLUMN     "welcomeOnboardingDone" BOOLEAN NOT NULL DEFAULT false;
