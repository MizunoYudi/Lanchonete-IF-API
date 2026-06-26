export interface PromocaoResponse {
    id: number;
    sabor: string;
    desconto: number;
    ativo: boolean;
}

export interface PromocaoResultadoResponse {
    sucesso: boolean;
    mensagem: string;
    promocao?: PromocaoResponse;
}