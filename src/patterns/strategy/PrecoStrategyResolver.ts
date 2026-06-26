import { CalculoPrecoStrategy } from "./CalculoPrecoStrategy";
import { PrecoPadrao } from "./PrecoPadrao";
import { PrecoPromocional } from "./PrecoPromocional";
import { PromocaoService } from "../../service/PromocaoService";

export class PrecoStrategyResolver {
    private padrao: CalculoPrecoStrategy = new PrecoPadrao();

    constructor(private promocaoService: PromocaoService) { }

    resolver(sabor: string): CalculoPrecoStrategy {
        const desconto = this.promocaoService.obterDesconto(sabor);
        if (desconto > 0) {
            return new PrecoPromocional(desconto);
        }
        return this.padrao;
    }

    estaEmPromocao(sabor: string): boolean {
        return this.promocaoService.estaEmPromocao(sabor);
    }

    obterDesconto(sabor: string): number {
        return this.promocaoService.obterDesconto(sabor);
    }

    calcularPreco(sabor: string, precoBase: number): number {
        return this.resolver(sabor).calcular(precoBase);
    }
}