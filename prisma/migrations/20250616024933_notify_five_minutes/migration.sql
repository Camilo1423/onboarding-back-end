-- AlterTable
ALTER TABLE "TechnicalOnboarding" ADD COLUMN     "notificationSent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "WelcomeOnboarding" ADD COLUMN     "notificationSent" BOOLEAN NOT NULL DEFAULT false;
