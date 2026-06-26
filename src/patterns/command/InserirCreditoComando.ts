import { Comando, ContextoTransacao } from "./Comando";
import { SlotNotasManager, Denominacao } from "../singleton/SlotNotasManager";
import type { ResultadoCompra } from "../../model/ResultadoCompra";

export class InserirCreditoComando implements Comando {
    constructor(
        private ctx: ContextoTransacao,
        private clienteId: number,
        private valorNota: Denominacao
    ) {}

    async executar(): Promise<ResultadoCompra> {
        const { clienteService, subject } = this.ctx;

        const cliente = await clienteService.obterCliente(this.clienteId);
        if (!cliente) return { sucesso: false, mensagem: "Cliente não encontrado" };

        // A cédula inserida entra na máquina (slot de notas)
        const slot = SlotNotasManager.getInstance();
        slot.getSlot().registrarEntrada(this.valorNota);
        await slot.persistir();

        const novoSaldo = Number((Number(cliente.saldo) + this.valorNota).toFixed(2));
        await clienteService.atualizarSaldo(this.clienteId, novoSaldo);

        await subject.publicar({
            clienteId: this.clienteId,
            tipoOperacao: "CREDITO",
            tipoSabor: "-",
            valorNota: this.valorNota,
            trocoDado: 0,
            reembolso: 0,
            estado: "CONCLUIDO",
        });

        return {
            sucesso: true,
            mensagem: `Crédito de R$ ${this.valorNota.toFixed(2)} adicionado com sucesso`,
            saldoAtual: novoSaldo,
            estado: "CONCLUIDO",
        };
    }
}
