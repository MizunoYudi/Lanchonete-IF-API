import { PromocaoDAO, Promocao, NovaPromocao } from "./PromocaoDAO";
import { PrismaConnection } from "../../config/database";

export class PromocaoDAOImpl implements PromocaoDAO {
    private prisma = PrismaConnection.getInstance();

    async save(p: NovaPromocao): Promise<Promocao> {
        const criada = await this.prisma.promocao.create({
            data: {
                sabor: p.sabor.trim().toLowerCase(),
                desconto: p.desconto ?? 0.1,
                ativo: p.ativo ?? true,
            },
        });
        return this.toModel(criada);
    }

    async findBySabor(sabor: string): Promise<Promocao | null> {
        const p = await this.prisma.promocao.findUnique({
            where: { sabor: sabor.trim().toLowerCase() },
        });
        return p ? this.toModel(p) : null;
    }

    async findAll(): Promise<Promocao[]> {
        const lista = await this.prisma.promocao.findMany();
        return lista.map((p: any) => this.toModel(p));
    }

    async findAtivas(): Promise<Promocao[]> {
        const lista = await this.prisma.promocao.findMany({
            where: { ativo: true },
        });
        return lista.map((p: any) => this.toModel(p));
    }

    async update(sabor: string, p: Partial<NovaPromocao>): Promise<Promocao> {
        const atualizada = await this.prisma.promocao.update({
            where: { sabor: sabor.trim().toLowerCase() },
            data: {
                desconto: p.desconto,
                ativo: p.ativo,
            },
        });
        return this.toModel(atualizada);
    }

    async delete(sabor: string): Promise<void> {
        await this.prisma.promocao.delete({
            where: { sabor: sabor.trim().toLowerCase() },
        });
    }

    private toModel(p: any): Promocao {
        return {
            id: p.id,
            sabor: p.sabor,
            desconto: Number(p.desconto),
            ativo: p.ativo,
        };
    }
}