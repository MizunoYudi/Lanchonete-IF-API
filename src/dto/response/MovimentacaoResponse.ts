export interface MovimentacaoResponse {
    id: number;
    clienteId: number;
    dataHora: string;
    valorNota: number;
    tipoSabor: string;
    tipoOperacao: string;
    trocoDado: number;
    reembolso: number;
    estado: string;
    estornada: boolean;
    referenciaId: number | null;
}