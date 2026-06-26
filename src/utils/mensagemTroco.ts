import { SlotNotasManager, DENOMINACOES } from "../patterns/singleton/SlotNotasManager";

/**
 * Monta a mensagem detalhada de "falta de cédulas específicas", mostrando o
 * troco necessário, o quanto seria possível dar e quais cédulas faltam.
 */
export function mensagemTrocoInsuficiente(valorTroco: number): string {
    const slot = SlotNotasManager.getInstance().getSlot();
    const disponiveis: Record<number, number> = {};
    DENOMINACOES.forEach((d) => (disponiveis[d] = slot.getQuantidade(d)));

    const denominacoesDesc = [...DENOMINACOES].sort((a, b) => b - a);
    const usadas: Array<{ nota: number; qtd: number }> = [];
    let restante = valorTroco;
    let valorAlcancado = 0;

    for (const nota of denominacoesDesc) {
        const usar = Math.min(Math.floor(restante / nota), disponiveis[nota] ?? 0);
        if (usar > 0) {
            usadas.push({ nota, qtd: usar });
            valorAlcancado += usar * nota;
            restante -= usar * nota;
        }
    }

    const faltam: Array<{ nota: number; qtd: number }> = [];
    if (restante > 0) {
        for (const nota of denominacoesDesc) {
            if ((disponiveis[nota] ?? 0) === 0) {
                const necessaria = Math.ceil(restante / nota);
                if (necessaria > 0) {
                    faltam.push({ nota, qtd: necessaria });
                    restante -= necessaria * nota;
                    if (restante <= 0) break;
                }
            }
        }
    }

    let msg = "Transação impossível: falta de cédulas específicas.\n\n";
    msg += `Troco necessário: R$ ${valorTroco.toFixed(2)}\n`;
    msg += `Troco possível: R$ ${valorAlcancado.toFixed(2)}\n\n`;
    if (usadas.length > 0) {
        msg += "Cédulas utilizadas:\n";
        usadas.forEach(({ nota, qtd }) => (msg += `  ${qtd}x R$ ${nota}\n`));
        msg += "\n";
    }
    if (faltam.length > 0) {
        msg += "Cédulas faltantes:\n";
        faltam.forEach(({ nota, qtd }) => (msg += `  ${qtd}x R$ ${nota}\n`));
    }
    return msg;
}
