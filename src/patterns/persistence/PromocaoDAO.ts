export interface Promocao {
    id: number;
    sabor: string;
    desconto: number;
    ativo: boolean;
}

export interface NovaPromocao {
    sabor: string;
    desconto?: number;
    ativo?: boolean;
}

export interface PromocaoDAO {
    save(p: NovaPromocao): Promise<Promocao>;
    findBySabor(sabor: string): Promise<Promocao | null>;
    findAll(): Promise<Promocao[]>;
    findAtivas(): Promise<Promocao[]>;
    update(sabor: string, p: Partial<NovaPromocao>): Promise<Promocao>;
    delete(sabor: string): Promise<void>;
}