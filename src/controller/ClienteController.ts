import { Route, Post, Get, Body, Path, Controller, Tags } from "tsoa";
import { ClienteService } from "../service/ClienteService";
import { TransacaoService } from "../service/TransacaoService";
import type { CreditoRequest } from "../dto/request/CreditoRequest";
import type { CompraResponse } from "../dto/response/CompreResponse";
import type { ClienteResponse } from "../dto/response/ClienteResponse";
import type { SaldoResponse } from "../dto/response/ClienteResponse";
import type { MovimentacaoResponse } from "../dto/response/MovimentacaoResponse";

interface LoginRequest {
    email: string;
    senha: string;
}

interface RegistroRequest {
    nome: string;
    email: string;
    senha: string;
}

@Route("cliente")
@Tags("Cliente")
export class ClienteController extends Controller {
    constructor(
        private clienteService: ClienteService = new ClienteService(),
        private transacaoService: TransacaoService = new TransacaoService()
    ) {
        super();
    }

    @Post("login")
    public async login(@Body() body: LoginRequest): Promise<ClienteResponse> {
        const resultado = await this.clienteService.login(body.email, body.senha);

        if (!resultado.sucesso || !resultado.dados) {
            this.setStatus(401);
            throw new Error(resultado.mensagem || "Login falhou");
        }

        const cliente = await this.clienteService.obterCliente(resultado.dados.id);

        if (!cliente) {
            this.setStatus(404);
            throw new Error("Cliente não encontrado");
        }

        return {
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email,
            saldo: Number(cliente.saldo),
            ultimaSaborGuardado: cliente.ultimaSaborGuardado ?? null,
        };
    }

    @Post("registrar")
    public async registrar(@Body() body: RegistroRequest): Promise<ClienteResponse> {
        const resultado = await this.clienteService.registrar(body.nome, body.email, body.senha);

        if (!resultado.sucesso) {
            this.setStatus(400);
            throw new Error(resultado.mensagem || "Falha ao registrar");
        }

        const cliente = await this.clienteService.obterCliente(resultado.dados!.id);

        if (!cliente) {
            this.setStatus(404);
            throw new Error("Cliente não encontrado");
        }

        return {
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email,
            saldo: Number(cliente.saldo),
            ultimaSaborGuardado: cliente.ultimaSaborGuardado ?? null,
        };
    }

    @Get("{id}")
    public async obter(@Path() id: number): Promise<ClienteResponse> {
        const cliente = await this.clienteService.obterCliente(id);

        if (!cliente) {
            this.setStatus(404);
            throw new Error("Cliente não encontrado");
        }

        return {
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email,
            saldo: Number(cliente.saldo),
            ultimaSaborGuardado: cliente.ultimaSaborGuardado ?? null,
        };
    }

    @Get("{id}/saldo")
    public async obterSaldo(@Path() id: number): Promise<SaldoResponse> {
        const resultado = await this.clienteService.consultarSaldo(id);

        if (!resultado.sucesso) {
            this.setStatus(404);
            throw new Error(resultado.mensagem || "Saldo não encontrado");
        }

        return {
            clienteId: id,
            saldo: resultado.saldo,
        };
    }

    @Post("credito")
    public async inserirCredito(@Body() body: CreditoRequest): Promise<CompraResponse> {
        const resultado = await this.transacaoService.inserirCredito(
            body.clienteId,
            body.valorNota as any
        );

        return {
            sucesso: resultado.sucesso,
            mensagem: resultado.mensagem,
            saldoAtual: resultado.saldoAtual,
        };
    }

    @Get("{id}/extrato")
    public async obterExtrato(@Path() id: number): Promise<MovimentacaoResponse[]> {
        const movimentacoes = await this.transacaoService.obterExtrato(id);

        return movimentacoes.map((mov) => ({
            id: mov.id!,
            clienteId: mov.clienteId,
            dataHora: mov.dataHora.toISOString(),
            valorNota: Number(mov.valorNota),
            tipoSabor: mov.tipoSabor,
            tipoOperacao: mov.tipoOperacao,
            trocoDado: Number(mov.trocoDado),
            reembolso: Number(mov.reembolso),
            estado: mov.estado ?? "",
            estornada: mov.estornada,
            referenciaId: mov.referenciaId ?? null,
        }));
    }
}