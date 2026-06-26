import type { TrocoPorDenominacao } from "./TrocoPorDenominacao";

export interface ResultadoCompra {
    sucesso: boolean;
    mensagem: string;
    sabor?: string;
    precoPago?: number;
    precoFinal?: number;
    trocoDado?: number;
    trocoEntregue?: TrocoPorDenominacao;
    reembolso?: number;
    reembolsoEntregue?: TrocoPorDenominacao;
    saldoAtual?: number;
    estado?: string;
}