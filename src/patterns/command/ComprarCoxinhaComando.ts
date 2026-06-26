import { Comando, ContextoTransacao } from "./Comando";
import { CoxinhaFactory } from "../factory/CoxinhaFactory";
import { Pedido } from "../state/Pedido";
import { SaborValidador } from "../chain/SaborValidador";
import { ValorNotaValidador } from "../chain/ValorNotaValidador";
import { TrocoValidador } from "../chain/TrocoValidador";
import { SlotNotasManager, Denominacao } from "../singleton/SlotNotasManager";
import { mensagemTrocoInsuficiente } from "../../utils/mensagemTroco";
import type { ResultadoCompra } from "../../model/ResultadoCompra";
import type { TrocoPorDenominacao } from "../../model/TrocoPorDenominacao";

export class ComprarCoxinhaComando implements Comando {
    constructor(
        private ctx: ContextoTransacao,
        private clienteId: number,
        private sabor: string,
        private valorNota: Denominacao
    ) { }

    async executar(): Promise<ResultadoCompra> {
        const { clienteService, precoService, subject } = this.ctx;

        const cliente = await clienteService.obterCliente(this.clienteId);
        if (!cliente) return { sucesso: false, mensagem: "Cliente não encontrado" };

        let coxinha;
        try {
            coxinha = CoxinhaFactory.criar(this.sabor);
        } catch {
            return { sucesso: false, mensagem: `Sabor desconhecido: ${this.sabor}` };
        }

        const precoFinal = precoService.precoDe(this.sabor);

        // State: VAZIO -> EM_PROCESSO
        const pedido = new Pedido();
        pedido.selecionarSabor(this.sabor, precoFinal);

        if (Number(cliente.saldo) < precoFinal) {
            return {
                sucesso: false,
                mensagem: `Saldo insuficiente. Necessário: R$ ${precoFinal.toFixed(2)}, Disponível: R$ ${Number(cliente.saldo).toFixed(2)}`,
            };
        }

        // State: EM_PROCESSO -> AGUARDANDO_PAGAMENTO
        pedido.inserirPagamento(this.valorNota);

        // Chain of Responsibility
        const validador = new SaborValidador();
        validador.setNext(new ValorNotaValidador()).setNext(new TrocoValidador());
        const resultadoValidacao = await validador.handle({
            sabor: this.sabor,
            valorNota: this.valorNota,
            precoCoxinha: precoFinal,
        });

        if (resultadoValidacao.erro) {
            if (resultadoValidacao.erro.includes("falta de cédulas")) {
                const valorTroco = Number((this.valorNota - precoFinal).toFixed(2));
                return { sucesso: false, mensagem: mensagemTrocoInsuficiente(valorTroco) };
            }
            return { sucesso: false, mensagem: resultadoValidacao.erro };
        }

        const slot = SlotNotasManager.getInstance().getSlot();
        const valorTroco = Number((this.valorNota - precoFinal).toFixed(2));

        const trocoEntregue: TrocoPorDenominacao = {};
        if (valorTroco > 0) {
            const combinacao = slot.dispensar(valorTroco);
            if (!combinacao) {
                return { sucesso: false, mensagem: mensagemTrocoInsuficiente(valorTroco) };
            }
            combinacao.forEach((qtd, nota) => {
                (trocoEntregue as Record<string, number>)[String(nota)] = qtd;
            });
        }

        slot.registrarEntrada(this.valorNota);
        await SlotNotasManager.getInstance().persistir();

        const novoSaldo = Number((Number(cliente.saldo) - precoFinal).toFixed(2));
        await clienteService.atualizarSaldo(this.clienteId, novoSaldo);
        await clienteService.atualizarUltimaSaborGuardado(this.clienteId, this.sabor);

        // State: AGUARDANDO_PAGAMENTO -> CONCLUIDO
        pedido.confirmar();

        // Observer grava o extrato
        await subject.publicar({
            clienteId: this.clienteId,
            tipoOperacao: "COMPRA",
            tipoSabor: coxinha.getSabor(),
            valorNota: this.valorNota,
            trocoDado: valorTroco,
            reembolso: 0,
            estado: pedido.estadoAtual,
        });

        return {
            sucesso: true,
            mensagem: "Compra realizada com sucesso",
            sabor: coxinha.getSabor(),
            precoPago: precoFinal,
            trocoDado: valorTroco,
            trocoEntregue,
            saldoAtual: novoSaldo,
            estado: pedido.estadoAtual,
        };
    }
}
