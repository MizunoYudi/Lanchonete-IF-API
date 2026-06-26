import { Movimentacao, NovaMovimentacao } from "../../model/Movimentacao";

export interface MovimentacaoDAO {
    save(m: NovaMovimentacao): Promise<Movimentacao>;
    findById(id: number): Promise<Movimentacao | null>;
    findByClienteId(clienteId: number): Promise<Movimentacao[]>;
    marcarEstornada(id: number): Promise<void>;
}
