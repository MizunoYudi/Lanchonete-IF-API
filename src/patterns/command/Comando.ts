import { ClienteService } from "../../service/ClienteService";
import { PrecoService } from "../../service/PrecoService";
import { MovimentacaoDAO } from "../persistence/MovimentacaoDAO";
import { TransacaoSubject } from "../observer/TransacaoObserver";
import type { ResultadoCompra } from "../../model/ResultadoCompra";

/**
 * Pattern: Command
 *
 * Cada operação do caixa (comprar, trocar, inserir crédito, estornar) é
 * encapsulada como um Comando com um método executar(). O estorno é um
 * comando compensatório que desfaz os efeitos de uma compra concluída.
 */
export interface Comando {
    executar(): Promise<ResultadoCompra>;
}

/** Dependências compartilhadas pelos comandos (injetadas pelo serviço). */
export interface ContextoTransacao {
    clienteService: ClienteService;
    precoService: PrecoService;
    movimentacaoDAO: MovimentacaoDAO;
    subject: TransacaoSubject;
}

/** Invoker: executa comandos e mantém um histórico das operações. */
export class InvocadorTransacoes {
    private historico: Comando[] = [];

    async executar(comando: Comando): Promise<ResultadoCompra> {
        const resultado = await comando.executar();
        if (resultado.sucesso) {
            this.historico.push(comando);
        }
        return resultado;
    }

    get quantidadeExecutada(): number {
        return this.historico.length;
    }
}
