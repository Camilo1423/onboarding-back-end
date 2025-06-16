/*
  Warnings:

  - You are about to drop the column `meetingPassword` on the `OnboardingAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `notified` on the `OnboardingAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `meetingPassword` on the `WelcomeOnboardingAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `notified` on the `WelcomeOnboardingAssignment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OnboardingAssignment" DROP COLUMN "meetingPassword",
DROP COLUMN "notified";

-- AlterTable
ALTER TABLE "WelcomeOnboardingAssignment" DROP COLUMN "meetingPassword",
DROP COLUMN "notified";
