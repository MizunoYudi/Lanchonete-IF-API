-- CreateEnum
CREATE TYPE "TipoOperacao" AS ENUM ('COMPRA', 'TROCA_SABOR', 'CREDITO');

-- CreateTable
CREATE TABLE "cliente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "saldo" DECIMAL(10,2) NOT NULL DEFAULT 0,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimentacao" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "data_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor_nota" DECIMAL(10,2) NOT NULL,
    "tipo_sabor" TEXT NOT NULL,
    "tipo_operacao" "TipoOperacao" NOT NULL,
    "troco_dado" DECIMAL(10,2) NOT NULL DEFAULT 0,

    CONSTRAINT "movimentacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slot_notas" (
    "valor_nota" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "slot_notas_pkey" PRIMARY KEY ("valor_nota")
);

-- CreateIndex
CREATE UNIQUE INDEX "cliente_usuario_key" ON "cliente"("usuario");

-- AddForeignKey
ALTER TABLE "movimentacao" ADD CONSTRAINT "movimentacao_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
