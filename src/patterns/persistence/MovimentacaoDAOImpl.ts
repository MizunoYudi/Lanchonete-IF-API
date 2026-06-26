import { MovimentacaoDAO } from "./MovimentacaoDAO";
import { Movimentacao, NovaMovimentacao } from "../../model/Movimentacao";
import { PrismaConnection } from "../../config/database";

export class MovimentacaoDAOImpl implements MovimentacaoDAO {
    private prisma = PrismaConnection.getInstance();

    async save(m: NovaMovimentacao): Promise<Movimentacao> {
        const criado = await this.prisma.movimentacao.create({
            data: {
                clienteId: m.clienteId,
                valorNota: m.valorNota,
                tipoSabor: m.tipoSabor,
                tipoOperacao: m.tipoOperacao,
                trocoDado: m.trocoDado,
                reembolso: m.reembolso ?? 0,
                estado: m.estado ?? null,
                referenciaId: m.referenciaId ?? null,
            },
            include: { cliente: true },
        });
        return this.toModel(criado);
    }

    async findById(id: number): Promise<Movimentacao | null> {
        const m = await this.prisma.movimentacao.findUnique({
            where: { id },
            include: { cliente: true },
        });
        return m ? this.toModel(m) : null;
    }

    async findByClienteId(clienteId: number): Promise<Movimentacao[]> {
        const lista = await this.prisma.movimentacao.findMany({
            where: { clienteId },
            orderBy: { dataHora: "desc" },
            include: { cliente: true },
        });
        return lista.map((m) => this.toModel(m));
    }

    async marcarEstornada(id: number): Promise<void> {
        await this.prisma.movimentacao.update({
            where: { id },
            data: { estornada: true },
        });
    }

    private toModel(m: any): Movimentacao {
        return {
            id: m.id,
            clienteId: m.clienteId,
            email: m.cliente.email,
            dataHora: m.dataHora,
            valorNota: Number(m.valorNota),
            tipoSabor: m.tipoSabor,
            tipoOperacao: m.tipoOperacao,
            trocoDado: Number(m.trocoDado),
            reembolso: Number(m.reembolso),
            estado: m.estado,
            estornada: m.estornada,
            referenciaId: m.referenciaId,
        };
    }
}
