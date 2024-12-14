-- DropForeignKey
ALTER TABLE `cita` DROP FOREIGN KEY `Cita_idDoctor_fkey`;

-- AlterTable
ALTER TABLE `cita` ADD COLUMN `horaEstimada` VARCHAR(191) NULL,
    MODIFY `idDoctor` INTEGER NULL,
    MODIFY `fecha` DATETIME(3) NULL,
    MODIFY `estado` VARCHAR(191) NOT NULL DEFAULT 'Solicitada',
    MODIFY `observaciones` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Cita` ADD CONSTRAINT `Cita_idDoctor_fkey` FOREIGN KEY (`idDoctor`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
