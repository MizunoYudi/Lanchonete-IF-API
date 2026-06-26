import { Comando, ContextoTransacao } from "./Comando";
import { CoxinhaFactory } from "../factory/CoxinhaFactory";
import { SlotNotasManager } from "../singleton/SlotNotasManager";
import { mensagemTrocoInsuficiente } from "../../utils/mensagemTroco";
import type { ResultadoCompra } from "../../model/ResultadoCompra";
import type { TrocoPorDenominacao } from "../../model/TrocoPorDenominacao";

export class TrocarSaborComando implements Comando {
    constructor(
        private ctx: ContextoTransacao,
        private clienteId: number,
        private saborNovo: string
    ) {}

    async executar(): Promise<ResultadoCompra> {
        const { clienteService, precoService, subject } = this.ctx;

        const cliente = await clienteService.obterCliente(this.clienteId);
        if (!cliente) return { sucesso: false, mensagem: "Cliente não encontrado" };
        if (!cliente.ultimaSaborGuardado) {
            return { sucesso: false, mensagem: "Nenhuma coxinha guardada para trocar" };
        }

        let antigo, novo;
        try {
            antigo = CoxinhaFactory.criar(cliente.ultimaSaborGuardado);
            novo = CoxinhaFactory.criar(this.saborNovo);
        } catch {
            return { sucesso: false, mensagem: `Sabor desconhecido: ${this.saborNovo}` };
        }

        const precoAntigo = precoService.precoDe(cliente.ultimaSaborGuardado);
        const precoNovo = precoService.precoDe(this.saborNovo);
        const diferenca = Number((precoNovo - precoAntigo).toFixed(2));

        let novoSaldo = Number(cliente.saldo);
        let reembolso = 0;
        const reembolsoEntregue: TrocoPorDenominacao = {};

        if (diferenca > 0) {
            // Upgrade: cobra a diferença do saldo
            if (novoSaldo < diferenca) {
                return {
                    sucesso: false,
                    mensagem: `Saldo insuficiente para a troca. Diferença: R$ ${diferenca.toFixed(2)}, Disponível: R$ ${novoSaldo.toFixed(2)}`,
                };
            }
            novoSaldo = Number((novoSaldo - diferenca).toFixed(2));
        } else if (diferenca < 0) {
            // Downgrade: reembolsa a diferença ao saldo, debitando cédulas do slot
            reembolso = Math.abs(diferenca);
            const slot = SlotNotasManager.getInstance().getSlot();
            const combinacao = slot.dispensar(reembolso);
            if (!combinacao) {
                return { sucesso: false, mensagem: mensagemTrocoInsuficiente(reembolso) };
            }
            await SlotNotasManager.getInstance().persistir();
            combinacao.forEach((qtd, nota) => {
                (reembolsoEntregue as Record<string, number>)[String(nota)] = qtd;
            });
            novoSaldo = Number((novoSaldo + reembolso).toFixed(2));
        }

        if (novoSaldo !== Number(cliente.saldo)) {
            await clienteService.atualizarSaldo(this.clienteId, novoSaldo);
        }
        await clienteService.atualizarUltimaSaborGuardado(this.clienteId, this.saborNovo);

        await subject.publicar({
            clienteId: this.clienteId,
            tipoOperacao: "TROCA_SABOR",
            tipoSabor: `${antigo.getSabor()} -> ${novo.getSabor()}`,
            valorNota: 0,
            trocoDado: 0,
            reembolso,
            estado: "CONCLUIDO",
        });

        return {
            sucesso: true,
            mensagem:
                diferenca < 0
                    ? `Troca realizada. Reembolso de R$ ${reembolso.toFixed(2)} adicionado ao saldo`
                    : diferenca > 0
                    ? `Troca realizada. Diferença de R$ ${diferenca.toFixed(2)} debitada do saldo`
                    : "Troca de sabor realizada",
            sabor: novo.getSabor(),
            precoFinal: precoNovo,
            reembolso,
            reembolsoEntregue,
            saldoAtual: novoSaldo,
            estado: "CONCLUIDO",
        };
    }
}
