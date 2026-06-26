export interface ClienteResponse {
    id: number;
    nome: string;
    email: string;
    saldo: number;
    ultimaSaborGuardado: string | null;
}

export interface SaldoResponse {
    clienteId: number;
    saldo: number;
}