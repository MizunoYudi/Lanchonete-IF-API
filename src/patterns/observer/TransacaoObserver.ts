import { MovimentacaoDAO } from "../persistence/MovimentacaoDAO";
import type { Movimentacao, TipoOperacao } from "../../model/Movimentacao";

/**
 * Pattern: Observer
 *
 * Quando uma transação atinge um estado final (concluída, troca, crédito ou
 * estorno), o "subject" publica um evento e os observadores reagem. Isso tira
 * do serviço a responsabilidade de gravar o extrato/logar — o serviço apenas
 * publica o que aconteceu.
 */
export interface TransacaoEvento {
    clienteId: number;
    tipoOperacao: TipoOperacao;
    tipoSabor: string;
    valorNota: number;
    trocoDado: number;
    reembolso: number;
    estado: string;
    referenciaId?: number | null;
}

export interface TransacaoObserver {
    /** Pode devolver a movimentação criada (quando aplicável). */
    aoConcluirTransacao(evento: TransacaoEvento): Promise<Movimentacao | void>;
}

export class TransacaoSubject {
    private observers: TransacaoObserver[] = [];

    inscrever(observer: TransacaoObserver): void {
        this.observers.push(observer);
    }

    async publicar(evento: TransacaoEvento): Promise<Movimentacao | undefined> {
        let movimentacao: Movimentacao | undefined;
        for (const observer of this.observers) {
            const resultado = await observer.aoConcluirTransacao(evento);
            if (resultado) movimentacao = resultado;
        }
        return movimentacao;
    }
}

/** Observer que persiste a movimentação no extrato. */
export class ExtratoObserver implements TransacaoObserver {
    constructor(private movimentacaoDAO: MovimentacaoDAO) {}

    async aoConcluirTransacao(evento: TransacaoEvento): Promise<Movimentacao> {
        return this.movimentacaoDAO.save({
            clienteId: evento.clienteId,
            valorNota: evento.valorNota,
            tipoSabor: evento.tipoSabor,
            tipoOperacao: evento.tipoOperacao,
            trocoDado: evento.trocoDado,
            reembolso: evento.reembolso,
            estado: evento.estado,
            referenciaId: evento.referenciaId,
        });
    }
}

/** Observer que apenas registra um log da operação. */
export class LogObserver implements TransacaoObserver {
    async aoConcluirTransacao(evento: TransacaoEvento): Promise<void> {
        console.log(
            `[transacao] cliente=${evento.clienteId} op=${evento.tipoOperacao} ` +
            `sabor="${evento.tipoSabor}" estado=${evento.estado}`
        );
    }
}
