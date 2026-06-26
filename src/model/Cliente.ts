export interface Cliente {
    id: number;
    nome: string;
    email: string;
    senhaHash: string;
    saldo: number;
    ultimaSaborGuardado?: string;
}

export interface ClienteDTO {
    id: number;
    nome: string;
    email: string;
    saldo: number;
    ultimaSaborGuardado?: string;
}