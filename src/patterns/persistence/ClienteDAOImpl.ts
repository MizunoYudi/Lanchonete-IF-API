import { PrismaConnection } from "../../config/database";
import type { Cliente } from "../../model/Cliente";
import type { ClienteDAO } from "./ClienteDAO";

export class ClienteDAOImpl implements ClienteDAO {
	private prisma = PrismaConnection.getInstance();

	async save(cliente: {
		nome: string;
		email: string;
		senhaHash: string;
		saldo?: number;
		ultimaSaborGuardado?: string;
	}): Promise<Cliente> {
		const criado = await this.prisma.cliente.create({
			data: {
				nome: cliente.nome,
				email: cliente.email,
				senhaHash: cliente.senhaHash,
				saldo: cliente.saldo ?? 0,
			},
		});
		return this.toModel(criado);
	}

	async findById(id: number): Promise<Cliente | null> {
		const cliente = await this.prisma.cliente.findUnique({ where: { id } });
		return cliente ? this.toModel(cliente) : null;
	}

	async findByEmail(email: string): Promise<Cliente | null> {
		const cliente = await this.prisma.cliente.findUnique({ where: { email } });
		return cliente ? this.toModel(cliente) : null;
	}

	async updateSaldo(id: number, saldo: number): Promise<void> {
		await this.prisma.cliente.update({
			where: { id },
			data: { saldo },
		});
	}

	async updateUltimaSaborGuardado(id: number, sabor: string | null): Promise<void> {
		await this.prisma.cliente.update({
			where: { id },
			data: { ultimaSaborGuardado: sabor },
		});
	}

	private toModel(cliente: any): Cliente {
		return {
			id: cliente.id,
			nome: cliente.nome,
			email: cliente.email,
			senhaHash: cliente.senhaHash,
			saldo: Number(cliente.saldo),
			ultimaSaborGuardado: cliente.ultimaSaborGuardado,
		};
	}
}