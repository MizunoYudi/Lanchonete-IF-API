import { Validador, ContextoValidacao } from "./Validador";

/** Garante que a nota inserida cobre o preço da coxinha. */
export class ValorNotaValidador extends Validador {
    protected async validar(ctx: ContextoValidacao): Promise<ContextoValidacao> {
        if (ctx.valorNota < ctx.precoCoxinha) {
            return { ...ctx, erro: "Valor inserido é menor que o preço da coxinha" };
        }
        return ctx;
    }
}
