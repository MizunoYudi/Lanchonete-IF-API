import { PromocaoDAO } from "../patterns/persistence/PromocaoDAO";
import { PromocaoDAOImpl } from "../patterns/persistence/PromocaoDAOImpl";
import type { Promocao } from "../patterns/persistence/PromocaoDAO";

export class PromocaoService {
    private promocoes: Map<string, number> = new Map();
    private promocoesCompletas: Map<string, Promocao> = new Map();

    constructor(private dao: PromocaoDAO = new PromocaoDAOImpl()) { }

    async carregar(): Promise<void> {
        const ativas = await this.dao.findAtivas();
        this.promocoes.clear();
        this.promocoesCompletas.clear();

        ativas.forEach((p) => {
            this.promocoes.set(p.sabor.toLowerCase(), p.desconto);
            this.promocoesCompletas.set(p.sabor.toLowerCase(), p);
        });
    }

    estaEmPromocao(sabor: string): boolean {
        return this.promocoes.has(sabor.trim().toLowerCase());
    }

    obterDesconto(sabor: string): number {
        return this.promocoes.get(sabor.trim().toLowerCase()) ?? 0;
    }

    async obterPromocoesAtivas(): Promise<Promocao[]> {
        await this.carregar();
        return Array.from(this.promocoesCompletas.values());
    }

    async adicionarPromocao(sabor: string, desconto: number = 0.1): Promise<Promocao> {
        const novaPromocao = await this.dao.save({ sabor, desconto, ativo: true });
        this.promocoes.set(sabor.toLowerCase(), desconto);
        this.promocoesCompletas.set(sabor.toLowerCase(), novaPromocao);
        return novaPromocao;
    }

    async removerPromocao(sabor: string): Promise<void> {
        await this.dao.delete(sabor);
        this.promocoes.delete(sabor.toLowerCase());
        this.promocoesCompletas.delete(sabor.toLowerCase());
    }

    async atualizarDesconto(sabor: string, novoDesconto: number): Promise<Promocao> {
        const atualizada = await this.dao.update(sabor, { desconto: novoDesconto });
        this.promocoes.set(sabor.toLowerCase(), novoDesconto);
        this.promocoesCompletas.set(sabor.toLowerCase(), atualizada);
        return atualizada;
    }

    async desativarPromocao(sabor: string): Promise<void> {
        await this.dao.update(sabor, { ativo: false });
        this.promocoes.delete(sabor.toLowerCase());
        this.promocoesCompletas.delete(sabor.toLowerCase());
    }
}