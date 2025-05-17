/*
  Warnings:

  - You are about to drop the column `observaciones` on the `cita` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cita` DROP COLUMN `observaciones`;

-- AlterTable
ALTER TABLE `paciente` ADD COLUMN `activo` BOOLEAN NOT NULL DEFAULT true;
