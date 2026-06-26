import { CoxinhaSabor } from "./CoxinhaSabor";
export class CoxinhaFrango implements CoxinhaSabor {
    getSabor(): string { return "Frango"; }
    getPrecoBase(): number { return 6; }
}