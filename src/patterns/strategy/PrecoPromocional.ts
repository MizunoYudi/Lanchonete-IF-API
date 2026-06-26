import { CalculoPrecoStrategy } from "./CalculoPrecoStrategy";
export class PrecoPromocional implements CalculoPrecoStrategy {
    constructor(private desconto: number = 0.1) { }
    calcular(base: number): number {
        return Number((base * (1 - this.desconto)).toFixed(2));
    }
}