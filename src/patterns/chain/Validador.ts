/**
 * Pattern: Chain of Responsibility
 *
 * Base única para todos os validadores da cadeia de compra. Cada validador
 * decide se aprova e repassa ao próximo, ou interrompe a cadeia com um erro.
 */
export interface ContextoValidacao {
    sabor: string;
    valorNota: number;
    precoCoxinha: number;
    erro?: string;
}

export abstract class Validador {
    private proximo?: Validador;

    setNext(proximo: Validador): Validador {
        this.proximo = proximo;
        return proximo;
    }

    async handle(ctx: ContextoValidacao): Promise<ContextoValidacao> {
        const resultado = await this.validar(ctx);
        if (resultado.erro) return resultado;
        if (this.proximo) return this.proximo.handle(resultado);
        return resultado;
    }

    protected abstract validar(ctx: ContextoValidacao): Promise<ContextoValidacao>;
}
