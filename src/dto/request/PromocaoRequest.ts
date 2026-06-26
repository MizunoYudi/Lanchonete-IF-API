export interface CriarPromocaoRequest {
    sabor: string;
    desconto?: number;
}

export interface AtualizarPromocaoRequest {
    desconto?: number;
    ativo?: boolean;
}