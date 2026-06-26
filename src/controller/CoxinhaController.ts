import { Route, Post, Get, Body, Path, Controller, Tags } from "tsoa";
import { TransacaoService } from "../service/TransacaoService";
import type { CompraRequest } from "../dto/request/CompraRequest";
import type { TrocaRequest } from "../dto/request/TrocaRequest";
import type { EstornoRequest } from "../dto/request/EstornoRequest";
import type { CompraResponse } from "../dto/response/CompraResponse";
import type { SaboresParaTrocaResponse } from "../dto/response/PrecoCatalogoResponse";
import type { PrecoCatalogoItemResponse } from "../dto/response/PrecoCatalogoResponse";

@Route("coxinha")
@Tags("Coxinha")
export class CoxinhaController extends Controller {
    constructor(private transacaoService: TransacaoService = new TransacaoService()) {
        super();
    }

    @Get("sabores")
    public async listarSabores(): Promise<string[]> {
        return ["frango", "catupiry", "carne", "queijo"];
    }

    @Post("comprar")
    public async comprar(@Body() body: CompraRequest): Promise<CompraResponse> {
        const resultado = await this.transacaoService.comprarCoxinha(
            body.clienteId,
            body.sabor,
            body.valorNota as any
        );

        return {
            sucesso: resultado.sucesso,
            mensagem: resultado.mensagem,
            sabor: resultado.sabor,
            precoPago: resultado.precoPago,
            trocoDado: resultado.trocoDado,
            reembolso: resultado.reembolso,
            saldoAtual: resultado.saldoAtual,
            estado: resultado.estado,
        };
    }

    @Post("trocar")
    public async trocar(@Body() body: TrocaRequest): Promise<CompraResponse> {
        const resultado = await this.transacaoService.trocarSabor(
            body.clienteId,
            body.saborNovo
        );

        return {
            sucesso: resultado.sucesso,
            mensagem: resultado.mensagem,
            sabor: resultado.sabor,
            precoPago: resultado.precoPago,
            reembolso: resultado.reembolso,
            saldoAtual: resultado.saldoAtual,
        };
    }

    @Post("estornar")
    public async estornar(@Body() body: EstornoRequest): Promise<CompraResponse> {
        const resultado = await this.transacaoService.estornarCompra(
            body.clienteId,
            body.movimentacaoId
        );

        return {
            sucesso: resultado.sucesso,
            mensagem: resultado.mensagem,
            reembolso: resultado.reembolso,
            saldoAtual: resultado.saldoAtual,
            estado: resultado.estado,
        };
    }

    @Get("precos")
    public async listarPrecos(): Promise<PrecoCatalogoItemResponse[]> {
        const resultado = await this.transacaoService.catalogoPrecos();
        return resultado.map((item) => ({
            sabor: item.sabor,
            precoBase: item.precoBase,
            precoFinal: item.precoFinal,
            emPromocao: item.emPromocao,
            desconto: item.desconto,
        }));
    }

    @Get("sabores-para-troca/{clienteId}")
    public async listarSaboresParaTroca(
        @Path() clienteId: number
    ): Promise<SaboresParaTrocaResponse> {
        return this.transacaoService.listarSaboresParaTroca(clienteId);
    }
}