import { Route, Post, Get, Body, Path, Delete, Put, Controller, Tags } from "tsoa";
import { PromocaoService } from "../service/PromocaoService";
import { PromocaoDAOImpl } from "../patterns/persistence/PromocaoDAOImpl";
import type { CriarPromocaoRequest, AtualizarPromocaoRequest } from "../dto/request/PromocaoRequest";
import type { PromocaoResponse, PromocaoResultadoResponse } from "../dto/response/PromocaoResponse";

@Route("promocao")
@Tags("Promoção")
export class PromocaoController extends Controller {
    private promocaoService: PromocaoService;

    constructor() {
        super();
        this.promocaoService = new PromocaoService(new PromocaoDAOImpl());
    }

    @Get("listar")
    public async listar(): Promise<PromocaoResponse[]> {
        const promocoes = await this.promocaoService.obterPromocoesAtivas();

        return promocoes.map((p) => ({
            id: p.id,
            sabor: p.sabor,
            desconto: Number(p.desconto),
            ativo: p.ativo,
        }));
    }

    @Post("criar")
    public async criar(@Body() body: CriarPromocaoRequest): Promise<PromocaoResultadoResponse> {
        try {
            const promocao = await this.promocaoService.adicionarPromocao(
                body.sabor,
                body.desconto ?? 0.1
            );
            return {
                sucesso: true,
                mensagem: `Promoção de ${body.sabor} criada com sucesso`,
                promocao: {
                    id: promocao.id,
                    sabor: promocao.sabor,
                    desconto: Number(promocao.desconto),
                    ativo: promocao.ativo,
                },
            };
        } catch (err) {
            return {
                sucesso: false,
                mensagem: err instanceof Error ? err.message : "Erro ao criar promoção",
            };
        }
    }

    @Put("{sabor}")
    public async atualizar(
        @Path() sabor: string,
        @Body() body: AtualizarPromocaoRequest
    ): Promise<PromocaoResultadoResponse> {
        try {
            if (body.desconto !== undefined) {
                const atualizada = await this.promocaoService.atualizarDesconto(sabor, body.desconto);
                return {
                    sucesso: true,
                    mensagem: `Desconto de ${sabor} atualizado para ${(body.desconto * 100).toFixed(0)}%`,
                    promocao: {
                        id: atualizada.id,
                        sabor: atualizada.sabor,
                        desconto: Number(atualizada.desconto),
                        ativo: atualizada.ativo,
                    },
                };
            }

            if (body.ativo === false) {
                await this.promocaoService.desativarPromocao(sabor);
                return {
                    sucesso: true,
                    mensagem: `Promoção de ${sabor} desativada`,
                };
            }

            return {
                sucesso: false,
                mensagem: "Nenhuma alteração foi feita",
            };
        } catch (err) {
            return {
                sucesso: false,
                mensagem: err instanceof Error ? err.message : "Erro ao atualizar promoção",
            };
        }
    }

    @Delete("{sabor}")
    public async remover(@Path() sabor: string): Promise<PromocaoResultadoResponse> {
        try {
            await this.promocaoService.removerPromocao(sabor);
            return {
                sucesso: true,
                mensagem: `Promoção de ${sabor} removida com sucesso`,
            };
        } catch (err) {
            return {
                sucesso: false,
                mensagem: err instanceof Error ? err.message : "Erro ao remover promoção",
            };
        }
    }
}