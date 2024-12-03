-- CreateTable
CREATE TABLE `Cita` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idPaciente` INTEGER NOT NULL,
    `idDoctor` INTEGER NOT NULL,
    `tipoServicio` VARCHAR(191) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `observaciones` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Cita` ADD CONSTRAINT `Cita_idPaciente_fkey` FOREIGN KEY (`idPaciente`) REFERENCES `Paciente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cita` ADD CONSTRAINT `Cita_idDoctor_fkey` FOREIGN KEY (`idDoctor`) REFERENCES `Doctor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
