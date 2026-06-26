import { Comando, ContextoTransacao } from "./Comando";
import { EstornoService } from "../../service/EstornoService";
import type { ResultadoCompra } from "../../model/ResultadoCompra";

export class EstornarComando implements Comando {
    private estornoService: EstornoService;

    constructor(
        private ctx: ContextoTransacao,
        private clienteId: number,
        private movimentacaoId: number
    ) {
        this.estornoService = new EstornoService(
            ctx.clienteService,
            ctx.movimentacaoDAO
        );
    }

    async executar(): Promise<ResultadoCompra> {
        const resultado = await this.estornoService.executar(
            this.clienteId,
            this.movimentacaoId
        );

        if (!resultado.sucesso) {
            return {
                sucesso: false,
                mensagem: resultado.mensagem,
            };
        }

        await this.ctx.subject.publicar({
            clienteId: this.clienteId,
            tipoOperacao: "ESTORNO",
            tipoSabor: resultado.original!.tipoSabor,
            valorNota: 0,
            trocoDado: 0,
            reembolso: resultado.reembolso!,
            estado: resultado.estado!,
            referenciaId: resultado.original!.id,
        });

        return {
            sucesso: true,
            mensagem: resultado.mensagem,
            sabor: resultado.original!.tipoSabor,
            reembolso: resultado.reembolso,
            reembolsoEntregue: resultado.reembolsoEntregue,
            saldoAtual: resultado.novoSaldo,
            estado: resultado.estado,
        };
    }
}