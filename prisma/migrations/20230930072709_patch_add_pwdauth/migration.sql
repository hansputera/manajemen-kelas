/*
  Warnings:

  - You are about to drop the column `ponselPelapaor` on the `KehadiranPiket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `KehadiranPiket` DROP COLUMN `ponselPelapaor`,
    ADD COLUMN `ponselPelapor` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `PesertaDidik` ADD COLUMN `passwordAuth` VARCHAR(191) NULL;
