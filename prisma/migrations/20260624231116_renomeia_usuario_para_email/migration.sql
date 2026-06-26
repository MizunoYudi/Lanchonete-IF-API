/*
  Warnings:

  - You are about to drop the column `usuario` on the `cliente` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `cliente` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `cliente` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "cliente_usuario_key";

-- AlterTable
ALTER TABLE "cliente" DROP COLUMN "usuario",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cliente_email_key" ON "cliente"("email");
