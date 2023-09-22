/*
  Warnings:

  - The primary key for the `PesertaDidik` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `Kelas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `PesertaDidik` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `kelas` to the `Kelas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `KehadiranPiket` DROP FOREIGN KEY `KehadiranPiket_idSiswa_fkey`;

-- AlterTable
ALTER TABLE `KehadiranPiket` MODIFY `idSiswa` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Kelas` ADD COLUMN `kelas` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `PesertaDidik` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Kelas_id_key` ON `Kelas`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `PesertaDidik_id_key` ON `PesertaDidik`(`id`);

-- AddForeignKey
ALTER TABLE `KehadiranPiket` ADD CONSTRAINT `KehadiranPiket_idSiswa_fkey` FOREIGN KEY (`idSiswa`) REFERENCES `PesertaDidik`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
