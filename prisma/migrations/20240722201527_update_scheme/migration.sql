/*
  Warnings:

  - You are about to drop the column `userId` on the `Form` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,userPubkey,surveyAccount]` on the table `Form` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userPubkey` to the `Form` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Form_name_userId_key";

-- AlterTable
ALTER TABLE "Form" DROP COLUMN "userId",
ADD COLUMN     "userPubkey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Form_name_userPubkey_surveyAccount_key" ON "Form"("name", "userPubkey", "surveyAccount");
