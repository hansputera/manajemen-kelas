-- DropForeignKey
ALTER TABLE `PesertaDidik` DROP FOREIGN KEY `PesertaDidik_hariPiket_fkey`;

-- AlterTable
ALTER TABLE `PesertaDidik` MODIFY `hariPiket` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `PesertaDidik` ADD CONSTRAINT `PesertaDidik_hariPiket_fkey` FOREIGN KEY (`hariPiket`) REFERENCES `JadwalPiket`(`hari`) ON DELETE SET NULL ON UPDATE CASCADE;
