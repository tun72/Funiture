/*
  Warnings:

  - You are about to alter the column `phone` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(52)`.
  - A unique constraint covering the columns `[phone]` on the table `Otp` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_lastName_key";

-- AlterTable
ALTER TABLE "Otp" ALTER COLUMN "otp" SET DATA TYPE TEXT,
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(52);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "lastName" SET DATA TYPE TEXT,
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(52);

-- CreateIndex
CREATE UNIQUE INDEX "Otp_phone_key" ON "Otp"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
