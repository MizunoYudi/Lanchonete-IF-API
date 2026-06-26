import { CoxinhaSabor } from "./produtos/CoxinhaSabor";
import { CoxinhaFrango } from "./produtos/CoxinhaFrango";
import { CoxinhaCatupiry } from "./produtos/CoxinhaCatupiry";
import { CoxinhaCarne } from "./produtos/CoxinhaCarne";
import { CoxinhaQueijo } from "./produtos/CoxinhaQueijo";

type Construtor = () => CoxinhaSabor;

export class CoxinhaFactory {
    private static registro = new Map<string, Construtor>([
        ["frango", () => new CoxinhaFrango()],
        ["catupiry", () => new CoxinhaCatupiry()],
        ["carne", () => new CoxinhaCarne()],
        ["queijo", () => new CoxinhaQueijo()],
    ]);

    static registrar(nome: string, construtor: Construtor): void {
        CoxinhaFactory.registro.set(nome.toLowerCase(), construtor);
    }

    static criar(nomeSabor: string): CoxinhaSabor {
        const chave = nomeSabor.trim().toLowerCase();
        const construtor = CoxinhaFactory.registro.get(chave);
        if (!construtor) throw new Error(`Sabor desconhecido: ${nomeSabor}`);
        return construtor();
    }

    static listarDisponiveis(): string[] {
        return Array.from(CoxinhaFactory.registro.keys());
    }
}