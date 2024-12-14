/*
  Warnings:

  - Added the required column `citaId` to the `ResumenMedico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `historialmedico` MODIFY `observaciones` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `resumenmedico` ADD COLUMN `citaId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ResumenMedico` ADD CONSTRAINT `ResumenMedico_citaId_fkey` FOREIGN KEY (`citaId`) REFERENCES `Cita`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
