import { CoxinhaSabor } from "./CoxinhaSabor";
export class CoxinhaQueijo implements CoxinhaSabor {
    getSabor(): string { return "Queijo"; }
    getPrecoBase(): number { return 6; }
}