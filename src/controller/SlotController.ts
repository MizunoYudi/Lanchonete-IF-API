import { Route, Post, Get, Controller, Tags, Body } from "tsoa";
import { SlotNotasManager } from "../patterns/singleton/SlotNotasManager";
import type { AdicionarNotasRequest } from "../dto/request/SlotRequest";
import type { EstoqueResponse, AdicionarNotasResponse } from "../dto/response/SlotResponse";

@Route("slot")
@Tags("Slot de Notas")
export class SlotController extends Controller {
    @Get("estoque")
    public async obterEstoque(): Promise<EstoqueResponse> {
        const slot = SlotNotasManager.getInstance();
        const resumo = slot.obterResumoEstoque();

        const totalNotas = resumo.reduce((sum, item) => sum + item.quantidade, 0);
        const totalValor = resumo.reduce((sum, item) => sum + item.nota * item.quantidade, 0);

        return {
            totalNotas,
            totalValor,
            itens: resumo.map((item) => ({
                nota: item.nota,
                quantidade: item.quantidade,
            })),
        };
    }

    @Post("estoque/adicionar")
    public async adicionarNotas(@Body() body: AdicionarNotasRequest): Promise<AdicionarNotasResponse> {
        try {
            const slot = SlotNotasManager.getInstance();
            await slot.adicionarAoEstoque(body.nota, body.quantidade);
            await slot.persistir();

            return {
                sucesso: true,
                mensagem: `${body.quantidade}x R$ ${body.nota} adicionados ao estoque`,
            };
        } catch (err) {
            return {
                sucesso: false,
                mensagem: err instanceof Error ? err.message : "Erro ao adicionar notas",
            };
        }
    }
}