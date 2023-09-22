-- CreateTable
CREATE TABLE `Kelas` (
    `id` VARCHAR(191) NOT NULL,
    `dendaPiket` BIGINT NOT NULL DEFAULT 5000,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PesertaDidik` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rombel` VARCHAR(191) NOT NULL,
    `hariPiket` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `nisn` VARCHAR(191) NOT NULL,
    `ponsel` VARCHAR(191) NULL,
    `agama` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KehadiranPiket` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rombel` VARCHAR(191) NOT NULL,
    `idSiswa` INTEGER NOT NULL,
    `proofPhoto` VARCHAR(191) NOT NULL,
    `waktu` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JadwalPiket` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rombel` VARCHAR(191) NOT NULL,
    `hari` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `JadwalPiket_hari_key`(`hari`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PesertaDidik` ADD CONSTRAINT `PesertaDidik_rombel_fkey` FOREIGN KEY (`rombel`) REFERENCES `Kelas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PesertaDidik` ADD CONSTRAINT `PesertaDidik_hariPiket_fkey` FOREIGN KEY (`hariPiket`) REFERENCES `JadwalPiket`(`hari`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KehadiranPiket` ADD CONSTRAINT `KehadiranPiket_rombel_fkey` FOREIGN KEY (`rombel`) REFERENCES `Kelas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KehadiranPiket` ADD CONSTRAINT `KehadiranPiket_idSiswa_fkey` FOREIGN KEY (`idSiswa`) REFERENCES `PesertaDidik`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalPiket` ADD CONSTRAINT `JadwalPiket_rombel_fkey` FOREIGN KEY (`rombel`) REFERENCES `Kelas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
