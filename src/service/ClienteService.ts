import bcrypt from "bcrypt";
import { ClienteDAO } from "../patterns/persistence/ClienteDAO";
import { ClienteDAOImpl } from "../patterns/persistence/ClienteDAOImpl";
import { validarEmail } from "../utils/validarEmail";
import type { Cliente } from "../model/Cliente";

export class ClienteService {
    constructor(
        private clienteRepository: ClienteDAO= new ClienteDAOImpl()
    ) {}

    async registrar(nome: string, email: string, senha: string): Promise<{
        sucesso: boolean;
        mensagem?: string;
        dados?: { id: number; nome: string; email: string };
    }> {
        // Validar email
        if (!validarEmail(email)) {
            return {
                sucesso: false,
                mensagem: "Email inválido"
            };
        }
 
        // Verificar se email já existe
        const existente = await this.clienteRepository.findByEmail(email.trim().toLowerCase());
        if (existente) {
            return {
                sucesso: false,
                mensagem: "Já existe um cliente cadastrado com esse email"
            };
        }
 
        // Hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);
 
        // Salvar cliente
        const cliente = await this.clienteRepository.save({
            nome,
            email: email.trim().toLowerCase(),
            senhaHash,
            saldo: 0
        });
 
        return {
            sucesso: true,
            dados: {
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email
            }
        };
    }

    async login(email: string, senha: string): Promise<{
        sucesso: boolean;
        mensagem?: string;
        dados?: { id: number; nome: string; saldo: number };
    }> {
        const cliente = await this.clienteRepository.findByEmail(email.trim().toLowerCase());
        if (!cliente) {
            return {
                sucesso: false,
                mensagem: "Email ou senha inválidos"
            };
        }
        const senhaCorreta = await bcrypt.compare(senha, cliente.senhaHash);
        if (!senhaCorreta) {
            return {
                sucesso: false,
                mensagem: "Email ou senha inválidos"
            };
        }
 
        return {
            sucesso: true,
            dados: {
                id: cliente.id,
                nome: cliente.nome,
                saldo: Number(cliente.saldo)
            }
        };
    }

    async consultarSaldo(clienteId: number): Promise<{
        sucesso: boolean;
        saldo: number;
        mensagem?: string;
    }> {
        const cliente = await this.clienteRepository.findById(clienteId);
        
        if (!cliente) {
            return {
                sucesso: false,
                saldo: 0,
                mensagem: "Cliente não encontrado"
            };
        }
 
        return {
            sucesso: true,
            saldo: Number(cliente.saldo)
        };
    }

 
    async obterCliente(clienteId: number): Promise<Cliente | null> {
        return this.clienteRepository.findById(clienteId);
    }
 
    async atualizarUltimaSaborGuardado(clienteId: number, sabor: string | null): Promise<void> {
        await this.clienteRepository.updateUltimaSaborGuardado(clienteId, sabor);
    }
 
    async atualizarSaldo(clienteId: number, novoSaldo: number): Promise<void> {
        await this.clienteRepository.updateSaldo(clienteId, novoSaldo);
    }
}