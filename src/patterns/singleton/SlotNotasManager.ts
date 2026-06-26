import { PrismaConnection } from "../../config/database";

export type Denominacao = 2 | 5 | 10 | 20 | 50 | 100 | 200;

export const DENOMINACOES: Denominacao[] = [2, 5, 10, 20, 50, 100, 200];

export class SlotNotasManager {
    private static instance: SlotNotasManager;
    private denominacoes: Map<number, number> = new Map();
    private prisma = PrismaConnection.getInstance();

    private constructor() {
        DENOMINACOES.forEach((nota) => {
            this.denominacoes.set(nota, 0);
        });
    }

    static getInstance(): SlotNotasManager {
        if (!SlotNotasManager.instance) {
            SlotNotasManager.instance = new SlotNotasManager();
        }
        return SlotNotasManager.instance;
    }

    async carregarDoDb(): Promise<void> {
        const dados = await this.prisma.slotNotas.findMany();
        dados.forEach((item: { valorNota: number; quantidade: number; }) => {
            this.denominacoes.set(item.valorNota, item.quantidade);
        });
    }

    getSlot(): SlotNotasManager {
        return this;
    }

    getQuantidade(nota: number): number {
        return this.denominacoes.get(nota) ?? 0;
    }

    obterDados(): Map<number, number> {
        return this.denominacoes;
    }

    public calcularTroco(valor: number): Map<number, number> | null {
        if (valor <= 0) return new Map();

        const disponiveis = new Map<number, number>();
        DENOMINACOES.forEach((nota) => {
            disponiveis.set(nota, this.denominacoes.get(nota) ?? 0);
        });

        const resultado = this.dfsEncontrarTroco(valor, DENOMINACOES, disponiveis, {});

        if (!resultado) return null;

        const mapa = new Map<number, number>();
        Object.entries(resultado).forEach(([nota, qtd]) => {
            if (qtd > 0) {
                mapa.set(Number(nota), qtd as number);
            }
        });

        return mapa;
    }

    private dfsEncontrarTroco(
        valor: number,
        denominacoes: Denominacao[],
        disponiveis: Map<number, number>,
        usadas: Record<number, number>
    ): Record<number, number> | null {
        if (valor === 0) {
            return usadas;
        }

        if (valor < 0) {
            return null;
        }

        for (const denom of denominacoes) {
            const qtdDisponivel = disponiveis.get(denom) ?? 0;
            const qtdUsada = usadas[denom] ?? 0;

            if (qtdUsada < qtdDisponivel) {
                const novoUsadas = { ...usadas, [denom]: qtdUsada + 1 };

                const resultado = this.dfsEncontrarTroco(
                    valor - denom,
                    denominacoes,
                    disponiveis,
                    novoUsadas
                );

                if (resultado) {
                    return resultado;
                }
            }
        }

        return null;
    }

    dispensar(valor: number): Map<number, number> | null {
        const combinacao = this.calcularTroco(valor);
        if (!combinacao) return null;
        this.confirmarUso(combinacao);
        return combinacao;
    }

    confirmarUso(combinacao: Map<number, number>): void {
        combinacao.forEach((qtd, nota) => {
            const qtdAtual = this.denominacoes.get(nota) ?? 0;
            this.denominacoes.set(nota, qtdAtual - qtd);
        });
    }

    registrarEntrada(nota: Denominacao): void {
        const qtdAtual = this.denominacoes.get(nota) ?? 0;
        this.denominacoes.set(nota, qtdAtual + 1);
    }

    async persistir(): Promise<void> {
        for (const [nota, qtd] of this.denominacoes.entries()) {
            await this.prisma.slotNotas.upsert({
                where: { valorNota: nota },
                update: { quantidade: qtd },
                create: { valorNota: nota, quantidade: qtd },
            });
        }
    }

    async atualizarEstoque(nota: number, quantidade: number): Promise<void> {
        if (!DENOMINACOES.includes(nota as Denominacao)) {
            throw new Error(`Nota R$ ${nota} inválida`);
        }

        this.denominacoes.set(nota, quantidade);

        await this.prisma.slotNotas.upsert({
            where: { valorNota: nota },
            update: { quantidade },
            create: { valorNota: nota, quantidade },
        });
    }

    async adicionarAoEstoque(nota: number, quantidade: number): Promise<void> {
        if (!DENOMINACOES.includes(nota as Denominacao)) {
            throw new Error(`Nota R$ ${nota} inválida`);
        }

        const qtdAtual = this.denominacoes.get(nota) ?? 0;
        const novaQuantidade = qtdAtual + quantidade;

        await this.atualizarEstoque(nota, novaQuantidade);
    }

    async removerDoEstoque(nota: number, quantidade: number): Promise<void> {
        if (!DENOMINACOES.includes(nota as Denominacao)) {
            throw new Error(`Nota R$ ${nota} inválida`);
        }

        const qtdAtual = this.denominacoes.get(nota) ?? 0;
        if (qtdAtual < quantidade) {
            throw new Error(`Quantidade insuficiente de R$ ${nota}`);
        }

        const novaQuantidade = qtdAtual - quantidade;
        await this.atualizarEstoque(nota, novaQuantidade);
    }

    zerarEstoque(): void {
        DENOMINACOES.forEach((nota) => {
            this.denominacoes.set(nota, 0);
        });
    }

    obterResumoEstoque(): Array<{ nota: number; quantidade: number }> {
        const resumo: Array<{ nota: number; quantidade: number }> = [];
        this.denominacoes.forEach((quantidade, nota) => {
            resumo.push({ nota, quantidade });
        });
        return resumo.sort((a, b) => a.nota - b.nota);
    }
}