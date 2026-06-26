export interface CompraResponse {
    sucesso: boolean;
    mensagem: string;
    sabor?: string;
    precoPago?: number;
    trocoDado?: number;
    reembolso?: number;
    saldoAtual?: number;
    estado?: string;
}