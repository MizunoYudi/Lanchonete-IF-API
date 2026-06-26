import { MovimentacaoDAO } from "../patterns/persistence/MovimentacaoDAO";
import { MovimentacaoDAOImpl } from "../patterns/persistence/MovimentacaoDAOImpl";
import { ClienteService } from "./ClienteService";
import { PrecoService } from "./PrecoService";
import { CoxinhaFactory } from "../patterns/factory/CoxinhaFactory";
import {
    TransacaoSubject,
    ExtratoObserver,
    LogObserver,
} from "../patterns/observer/TransacaoObserver";
import { ContextoTransacao, InvocadorTransacoes } from "../patterns/command/Comando";
import { ComprarCoxinhaComando } from "../patterns/command/ComprarCoxinhaComando";
import { TrocarSaborComando } from "../patterns/command/TrocarSaborComando";
import { InserirCreditoComando } from "../patterns/command/InserirCreditoComando";
import { EstornarComando } from "../patterns/command/EstornarComando";
import { Denominacao } from "../patterns/singleton/SlotNotasManager";
import type { ResultadoCompra } from "../model/ResultadoCompra";
import type { Movimentacao } from "../model/Movimentacao";

export class TransacaoService {
    private subject = new TransacaoSubject();
    private invocador = new InvocadorTransacoes();
    private ctx: ContextoTransacao;

    constructor(
        private clienteService: ClienteService = new ClienteService(),
        private precoService: PrecoService = new PrecoService(),
        private movimentacaoRepository: MovimentacaoDAO = new MovimentacaoDAOImpl()
    ) {
        this.subject.inscrever(new ExtratoObserver(this.movimentacaoRepository));
        this.subject.inscrever(new LogObserver());

        this.ctx = {
            clienteService: this.clienteService,
            precoService: this.precoService,
            movimentacaoDAO: this.movimentacaoRepository,
            subject: this.subject,
        };
    }

    async comprarCoxinha(clienteId: number, sabor: string, valorNota: Denominacao): Promise<ResultadoCompra> {
        return this.invocador.executar(new ComprarCoxinhaComando(this.ctx, clienteId, sabor, valorNota));
    }

    async trocarSabor(clienteId: number, saborNovo: string): Promise<ResultadoCompra> {
        return this.invocador.executar(new TrocarSaborComando(this.ctx, clienteId, saborNovo));
    }

    async inserirCredito(clienteId: number, valorNota: Denominacao): Promise<ResultadoCompra> {
        return this.invocador.executar(new InserirCreditoComando(this.ctx, clienteId, valorNota));
    }

    async estornarCompra(clienteId: number, movimentacaoId: number): Promise<ResultadoCompra> {
        return this.invocador.executar(
            new EstornarComando(this.ctx, clienteId, movimentacaoId)
        );
    }

    async obterExtrato(clienteId: number): Promise<Movimentacao[]> {
        return this.movimentacaoRepository.findByClienteId(clienteId);
    }

    catalogoPrecos() {
        return this.precoService.catalogo();
    }

    async listarSaboresParaTroca(clienteId: number): Promise<{
        saborAtual?: string;
        precoAtual?: number;
        sabores: Array<{ sabor: string; preco: number; diferenca: number }>;
    }> {
        const cliente = await this.clienteService.obterCliente(clienteId);
        if (!cliente || !cliente.ultimaSaborGuardado) {
            return { sabores: [] };
        }

        const precoAtual = this.precoService.precoDe(cliente.ultimaSaborGuardado);
        const sabores = CoxinhaFactory.listarDisponiveis()
            .filter((s) => s.toLowerCase() !== cliente.ultimaSaborGuardado!.toLowerCase())
            .map((sabor) => {
                const preco = this.precoService.precoDe(sabor);
                return { sabor, preco, diferenca: Number((preco - precoAtual).toFixed(2)) };
            });

        return { saborAtual: cliente.ultimaSaborGuardado, precoAtual, sabores };
    }
}
