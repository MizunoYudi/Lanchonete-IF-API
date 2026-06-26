import { Validador, ContextoValidacao } from "./Validador";
import { SlotNotasManager } from "../singleton/SlotNotasManager";

/** Garante que existe combinação de cédulas para o troco. */
export class TrocoValidador extends Validador {
    protected async validar(ctx: ContextoValidacao): Promise<ContextoValidacao> {
        const valorTroco = Number((ctx.valorNota - ctx.precoCoxinha).toFixed(2));
        if (valorTroco > 0) {
            const slot = SlotNotasManager.getInstance().getSlot();
            const combinacao = slot.calcularTroco(valorTroco);
            if (!combinacao) {
                return { ...ctx, erro: "Transação impossível: falta de cédulas específicas para o troco" };
            }
        }
        return ctx;
    }
}
