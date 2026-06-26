import { CalculoPrecoStrategy } from "./CalculoPrecoStrategy"
export class PrecoPadrao implements CalculoPrecoStrategy {
    calcular(base: number): number { return base; }
}