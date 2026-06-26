export interface EstoqueItemResponse {
    nota: number;
    quantidade: number;
}

export interface EstoqueResponse {
    totalNotas: number;
    totalValor: number;
    itens: EstoqueItemResponse[];
}

export interface AdicionarNotasResponse {
    sucesso: boolean;
    mensagem: string;
}