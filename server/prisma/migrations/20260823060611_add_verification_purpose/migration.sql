-- CreateEnum
CREATE TYPE "VerificationPurpose" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET');

-- AlterTable
ALTER TABLE "VerificationCode" ADD COLUMN     "purpose" "VerificationPurpose" NOT NULL DEFAULT 'EMAIL_VERIFICATION';
