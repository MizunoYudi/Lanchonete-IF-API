/**
 * Pattern: State
 *
 * Modela o ciclo de vida de um pedido de coxinha:
 *   VAZIO -> EM_PROCESSO -> AGUARDANDO_PAGAMENTO -> CONCLUIDO
 *   CONCLUIDO -> ESTORNADO
 *
 * Cada estado conhece apenas as transições que são válidas a partir dele;
 * qualquer transição inválida lança erro. Isso garante, por exemplo, que só
 * um pedido CONCLUIDO pode ser estornado, e que não se confirma um pedido
 * sem antes inserir o pagamento.
 */
export type NomeEstado =
    | "VAZIO"
    | "EM_PROCESSO"
    | "AGUARDANDO_PAGAMENTO"
    | "CONCLUIDO"
    | "ESTORNADO";

export interface EstadoPedido {
    nome(): NomeEstado;
    selecionarSabor(pedido: Pedido, sabor: string, preco: number): void;
    inserirPagamento(pedido: Pedido, valorNota: number): void;
    confirmar(pedido: Pedido): void;
    estornar(pedido: Pedido): void;
}

abstract class EstadoBase implements EstadoPedido {
    abstract nome(): NomeEstado;

    selecionarSabor(_pedido: Pedido, _sabor: string, _preco: number): void {
        throw new Error(`Não é possível selecionar sabor no estado ${this.nome()}`);
    }
    inserirPagamento(_pedido: Pedido, _valorNota: number): void {
        throw new Error(`Não é possível inserir pagamento no estado ${this.nome()}`);
    }
    confirmar(_pedido: Pedido): void {
        throw new Error(`Não é possível confirmar no estado ${this.nome()}`);
    }
    estornar(_pedido: Pedido): void {
        throw new Error(`Não é possível estornar no estado ${this.nome()}`);
    }
}

class EstadoVazio extends EstadoBase {
    nome(): NomeEstado { return "VAZIO"; }
    selecionarSabor(pedido: Pedido, sabor: string, preco: number): void {
        pedido.definirSabor(sabor, preco);
        pedido.mudarEstado(new EstadoEmProcesso());
    }
}

class EstadoEmProcesso extends EstadoBase {
    nome(): NomeEstado { return "EM_PROCESSO"; }
    inserirPagamento(pedido: Pedido, valorNota: number): void {
        pedido.definirPagamento(valorNota);
        pedido.mudarEstado(new EstadoAguardandoPagamento());
    }
}

class EstadoAguardandoPagamento extends EstadoBase {
    nome(): NomeEstado { return "AGUARDANDO_PAGAMENTO"; }
    confirmar(pedido: Pedido): void {
        pedido.mudarEstado(new EstadoConcluido());
    }
}

class EstadoConcluido extends EstadoBase {
    nome(): NomeEstado { return "CONCLUIDO"; }
    estornar(pedido: Pedido): void {
        pedido.mudarEstado(new EstadoEstornado());
    }
}

class EstadoEstornado extends EstadoBase {
    nome(): NomeEstado { return "ESTORNADO"; }
}

export class Pedido {
    private estado: EstadoPedido = new EstadoVazio();
    private _sabor?: string;
    private _preco = 0;
    private _valorNota = 0;

    get sabor(): string | undefined { return this._sabor; }
    get preco(): number { return this._preco; }
    get valorNota(): number { return this._valorNota; }
    get estadoAtual(): NomeEstado { return this.estado.nome(); }

    mudarEstado(novo: EstadoPedido): void { this.estado = novo; }
    definirSabor(sabor: string, preco: number): void { this._sabor = sabor; this._preco = preco; }
    definirPagamento(valorNota: number): void { this._valorNota = valorNota; }

    // Ações públicas delegadas ao estado atual
    selecionarSabor(sabor: string, preco: number): void { this.estado.selecionarSabor(this, sabor, preco); }
    inserirPagamento(valorNota: number): void { this.estado.inserirPagamento(this, valorNota); }
    confirmar(): void { this.estado.confirmar(this); }
    estornar(): void { this.estado.estornar(this); }

    /** Recria um Pedido já CONCLUIDO (ex.: ao carregar uma compra do banco para estornar). */
    static concluido(sabor: string, preco: number, valorNota: number): Pedido {
        const p = new Pedido();
        p.selecionarSabor(sabor, preco);
        p.inserirPagamento(valorNota);
        p.confirmar();
        return p;
    }
}
