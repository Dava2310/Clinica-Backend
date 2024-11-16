/*
  Warnings:

  - Added the required column `tipoUsuario` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `tipoUsuario` VARCHAR(191) NOT NULL;
