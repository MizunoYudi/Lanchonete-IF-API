import { Validador, ContextoValidacao } from "./Validador";

/** Garante que um sabor válido foi informado. */
export class SaborValidador extends Validador {
    protected async validar(ctx: ContextoValidacao): Promise<ContextoValidacao> {
        if (!ctx.sabor || ctx.sabor.trim() === "") {
            return { ...ctx, erro: "Sabor inválido" };
        }
        return ctx;
    }
}
