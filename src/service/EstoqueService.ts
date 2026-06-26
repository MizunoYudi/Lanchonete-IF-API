import { SlotNotasManager } from "../patterns/singleton/SlotNotasManager";

export class EstoqueService {
    private slotManager: SlotNotasManager;

    constructor() {
        this.slotManager = SlotNotasManager.getInstance();
    }

    async obterEstoque(): Promise<Array<{ nota: number; quantidade: number }>> {
        return this.slotManager.obterResumoEstoque();
    }

    async atualizarEstoque(nota: number, quantidade: number): Promise<{
        sucesso: boolean;
        mensagem: string;
    }> {
        try {
            if (![2, 5, 10, 20, 50, 100, 200].includes(nota)) {
                return {
                    sucesso: false,
                    mensagem: `Nota inválida: R$ ${nota}. Notas permitidas: 2, 5, 10, 20, 50, 100, 200`
                };
            }

            if (quantidade < 0) {
                return {
                    sucesso: false,
                    mensagem: "Quantidade não pode ser negativa"
                };
            }

            await this.slotManager.atualizarEstoque(nota, quantidade);

            return {
                sucesso: true,
                mensagem: `Estoque de R$ ${nota} atualizado para ${quantidade}`
            };
        } catch (err) {
            return {
                sucesso: false,
                mensagem: `Erro ao atualizar estoque: ${err instanceof Error ? err.message : "Erro desconhecido"}`
            };
        }
    }

    async adicionarAoEstoque(nota: number, quantidade: number): Promise<{
        sucesso: boolean;
        mensagem: string;
    }> {
        try {
            if (![2, 5, 10, 20, 50, 100, 200].includes(nota)) {
                return {
                    sucesso: false,
                    mensagem: `Nota inválida: R$ ${nota}`
                };
            }

            if (quantidade <= 0) {
                return {
                    sucesso: false,
                    mensagem: "Quantidade deve ser maior que zero"
                };
            }

            await this.slotManager.adicionarAoEstoque(nota, quantidade);

            return {
                sucesso: true,
                mensagem: `${quantidade} nota(s) de R$ ${nota} adicionada(s) com sucesso`
            };
        } catch (err) {
            return {
                sucesso: false,
                mensagem: `Erro ao adicionar ao estoque: ${err instanceof Error ? err.message : "Erro desconhecido"}`
            };
        }
    }

    async removerDoEstoque(nota: number, quantidade: number): Promise<{
        sucesso: boolean;
        mensagem: string;
    }> {
        try {
            if (![2, 5, 10, 20, 50, 100, 200].includes(nota)) {
                return {
                    sucesso: false,
                    mensagem: `Nota inválida: R$ ${nota}`
                };
            }

            if (quantidade <= 0) {
                return {
                    sucesso: false,
                    mensagem: "Quantidade deve ser maior que zero"
                };
            }

            const estoqueAtual = this.slotManager.getQuantidade(nota);
            if (estoqueAtual < quantidade) {
                return {
                    sucesso: false,
                    mensagem: `Quantidade insuficiente. Disponível: ${estoqueAtual}, Solicitado: ${quantidade}`
                };
            }

            await this.slotManager.removerDoEstoque(nota, quantidade);

            return {
                sucesso: true,
                mensagem: `${quantidade} nota(s) de R$ ${nota} removida(s) com sucesso`
            };
        } catch (err) {
            return {
                sucesso: false,
                mensagem: `Erro ao remover do estoque: ${err instanceof Error ? err.message : "Erro desconhecido"}`
            };
        }
    }

    async zerarEstoque(): Promise<{
        sucesso: boolean;
        mensagem: string;
    }> {
        try {
            this.slotManager.zerarEstoque();
            await this.slotManager.persistir();

            return {
                sucesso: true,
                mensagem: "Estoque zerado com sucesso"
            };
        } catch (err) {
            return {
                sucesso: false,
                mensagem: `Erro ao zerar estoque: ${err instanceof Error ? err.message : "Erro desconhecido"}`
            };
        }
    }

    getQuantidade(nota: number): number {
        return this.slotManager.getQuantidade(nota);
    }
}