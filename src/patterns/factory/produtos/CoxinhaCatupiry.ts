import { CoxinhaSabor } from "./CoxinhaSabor";
export class CoxinhaCatupiry implements CoxinhaSabor {
    getSabor(): string { return "Catupiry"; }
    getPrecoBase(): number { return 8; }
}