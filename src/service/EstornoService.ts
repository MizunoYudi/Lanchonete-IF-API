import { ClienteService } from "./ClienteService";
import { MovimentacaoDAO } from "../patterns/persistence/MovimentacaoDAO";
import { SlotNotasManager } from "../patterns/singleton/SlotNotasManager";
import { Pedido } from "../patterns/state/Pedido";
import { mensagemTrocoInsuficiente } from "../utils/mensagemTroco";
import type { ResultadoCompra } from "../model/ResultadoCompra";
import type { TrocoPorDenominacao } from "../model/TrocoPorDenominacao";
import type { Movimentacao } from "../model/Movimentacao";

export class EstornoService {
    constructor(
        private clienteService: ClienteService,
        private movimentacaoDAO: MovimentacaoDAO
    ) { }

    async executar(
        clienteId: number,
        movimentacaoId: number
    ): Promise<{
        sucesso: boolean;
        mensagem: string;
        original?: Movimentacao;
        reembolso?: number;
        reembolsoEntregue?: TrocoPorDenominacao;
        novoSaldo?: number;
        estado?: string;
    }> {
        const original = await this.movimentacaoDAO.findById(movimentacaoId);
        if (!original) {
            return { sucesso: false, mensagem: "Movimentação não encontrada" };
        }

        if (original.clienteId !== clienteId) {
            return { sucesso: false, mensagem: "Movimentação não pertence a este cliente" };
        }

        if (original.tipoOperacao !== "COMPRA") {
            return { sucesso: false, mensagem: "Apenas compras podem ser estornadas" };
        }

        if (original.estornada) {
            return { sucesso: false, mensagem: "Esta compra já foi estornada" };
        }

        const cliente = await this.clienteService.obterCliente(clienteId);
        if (!cliente) {
            return { sucesso: false, mensagem: "Cliente não encontrado" };
        }

        const precoPago = Number((original.valorNota - original.trocoDado).toFixed(2));

        const pedido = Pedido.concluido(
            original.tipoSabor,
            precoPago,
            original.valorNota
        );

        try {
            pedido.estornar();
        } catch (err) {
            return { sucesso: false, mensagem: `Transição de estado inválida: ${err instanceof Error ? err.message : "erro desconhecido"}` };
        }

        const reembolsoEntregue: TrocoPorDenominacao = {};
        if (precoPago > 0) {
            const slot = SlotNotasManager.getInstance().getSlot();
            const combinacao = slot.dispensar(precoPago);

            if (!combinacao) {
                return {
                    sucesso: false,
                    mensagem: mensagemTrocoInsuficiente(precoPago),
                };
            }

            await SlotNotasManager.getInstance().persistir();

            combinacao.forEach((qtd, nota) => {
                (reembolsoEntregue as Record<string, number>)[String(nota)] = qtd;
            });
        }

        const novoSaldo = Number((Number(cliente.saldo) + precoPago).toFixed(2));
        await this.clienteService.atualizarSaldo(clienteId, novoSaldo);

        if (
            cliente.ultimaSaborGuardado &&
            cliente.ultimaSaborGuardado.toLowerCase() === original.tipoSabor.toLowerCase()
        ) {
            await this.clienteService.atualizarUltimaSaborGuardado(clienteId, null);
        }

        await this.movimentacaoDAO.marcarEstornada(original.id!);

        return {
            sucesso: true,
            mensagem: `Estorno realizado. Reembolso de R$ ${precoPago.toFixed(2)} adicionado ao saldo`,
            original,
            reembolso: precoPago,
            reembolsoEntregue,
            novoSaldo,
            estado: pedido.estadoAtual,
        };
    }
}