import { CoxinhaSabor } from "./CoxinhaSabor";
export class CoxinhaCarne implements CoxinhaSabor {
    getSabor(): string { return "Carne"; }
    getPrecoBase(): number { return 10; }
}