-- CreateTable
CREATE TABLE "promocao" (
    "id" SERIAL NOT NULL,
    "sabor" TEXT NOT NULL,
    "desconto" DECIMAL(3,2) NOT NULL DEFAULT 0.1,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "promocao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "promocao_sabor_key" ON "promocao"("sabor");
