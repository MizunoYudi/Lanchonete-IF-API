-- Adiciona valor ESTORNO ao enum TipoOperacao
ALTER TYPE "TipoOperacao" ADD VALUE IF NOT EXISTS 'ESTORNO';

-- Novos campos em movimentacao
ALTER TABLE "movimentacao" ADD COLUMN IF NOT EXISTS "reembolso" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "movimentacao" ADD COLUMN IF NOT EXISTS "estado" TEXT;
ALTER TABLE "movimentacao" ADD COLUMN IF NOT EXISTS "estornada" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "movimentacao" ADD COLUMN IF NOT EXISTS "referencia_id" INTEGER;
