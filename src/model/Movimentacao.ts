export type TipoOperacao = "COMPRA" | "TROCA_SABOR" | "CREDITO" | "ESTORNO";

export interface Movimentacao {
    id?: number;
    clienteId: number;
    email: string;
    dataHora: Date;
    valorNota: number;
    tipoSabor: string;
    tipoOperacao: TipoOperacao;
    trocoDado: number;
    reembolso: number;
    estado?: string | null;
    estornada: boolean;
    referenciaId?: number | null;
}

/** Dados necessários para registrar uma nova movimentação. */
export interface NovaMovimentacao {
    clienteId: number;
    valorNota: number;
    tipoSabor: string;
    tipoOperacao: TipoOperacao;
    trocoDado: number;
    reembolso?: number;
    estado?: string | null;
    referenciaId?: number | null;
}
