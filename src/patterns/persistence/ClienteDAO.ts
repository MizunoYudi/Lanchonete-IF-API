import type { Cliente } from "../../model/Cliente";

export interface ClienteDAO {
	save(cliente: {
		nome: string;
		email: string;
		senhaHash: string;
		saldo?: number;
		ultimaSaborGuardado?: string;
	}): Promise<Cliente>;
	findById(id: number): Promise<Cliente | null>;
	findByEmail(email: string): Promise<Cliente | null>;
	updateSaldo(id: number, saldo: number): Promise<void>;
	updateUltimaSaborGuardado(id: number, sabor: string | null): Promise<void>;
}