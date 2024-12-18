/*
  Warnings:

  - You are about to drop the column `horaEstimada` on the `cita` table. All the data in the column will be lost.
  - Added the required column `especialidad` to the `Cita` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cita` DROP COLUMN `horaEstimada`,
    ADD COLUMN `especialidad` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `OpcionesCita` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idDoctor` INTEGER NOT NULL,
    `idCita` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OpcionesCita` ADD CONSTRAINT `OpcionesCita_idDoctor_fkey` FOREIGN KEY (`idDoctor`) REFERENCES `Doctor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OpcionesCita` ADD CONSTRAINT `OpcionesCita_idCita_fkey` FOREIGN KEY (`idCita`) REFERENCES `Cita`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
