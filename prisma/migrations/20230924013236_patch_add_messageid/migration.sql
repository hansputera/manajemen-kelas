/*
  Warnings:

  - Added the required column `messageId` to the `KehadiranPiket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `KehadiranPiket` ADD COLUMN `messageId` VARCHAR(191) NOT NULL;
