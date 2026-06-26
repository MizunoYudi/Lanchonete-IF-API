export interface PrecoCatalogoItemResponse {
    sabor: string;
    precoBase: number;
    precoFinal: number;
    emPromocao: boolean;
    desconto: number;
}

export interface SaborParaTrocaResponse {
    sabor: string;
    preco: number;
    diferenca: number;
}

export interface SaboresParaTrocaResponse {
    saborAtual?: string;
    precoAtual?: number;
    sabores: SaborParaTrocaResponse[];
}