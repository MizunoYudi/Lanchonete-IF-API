import { CoxinhaFactory } from "../patterns/factory/CoxinhaFactory";
import { PrecoStrategyResolver } from "../patterns/strategy/PrecoStrategyResolver";
import { PromocaoService } from "./PromocaoService";

export interface PrecoCatalogoItem {
    sabor: string;
    precoBase: number;
    precoFinal: number;
    emPromocao: boolean;
    desconto: number;
}

export class PrecoService {
    private resolver: PrecoStrategyResolver;

    constructor(private promocaoService: PromocaoService = new PromocaoService()) {
        this.resolver = new PrecoStrategyResolver(this.promocaoService);
    }

    precoDe(sabor: string): number {
        const coxinha = CoxinhaFactory.criar(sabor);
        return this.resolver.calcularPreco(sabor, coxinha.getPrecoBase());
    }

    async catalogo(): Promise<PrecoCatalogoItem[]> {
        await this.promocaoService.carregar();
        
        return CoxinhaFactory.listarDisponiveis().map((sabor) => {
            const coxinha = CoxinhaFactory.criar(sabor);
            const precoBase = coxinha.getPrecoBase();
            return {
                sabor,
                precoBase,
                precoFinal: this.resolver.calcularPreco(sabor, precoBase),
                emPromocao: this.resolver.estaEmPromocao(sabor),
                desconto: this.resolver.obterDesconto(sabor),
            };
        });
    }
}