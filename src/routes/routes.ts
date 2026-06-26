/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SlotController } from './../controller/SlotController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PromocaoController } from './../controller/PromocaoController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CoxinhaController } from './../controller/CoxinhaController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ClienteController } from './../controller/ClienteController';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "EstoqueItemResponse": {
        "dataType": "refObject",
        "properties": {
            "nota": {"dataType":"double","required":true},
            "quantidade": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EstoqueResponse": {
        "dataType": "refObject",
        "properties": {
            "totalNotas": {"dataType":"double","required":true},
            "totalValor": {"dataType":"double","required":true},
            "itens": {"dataType":"array","array":{"dataType":"refObject","ref":"EstoqueItemResponse"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdicionarNotasResponse": {
        "dataType": "refObject",
        "properties": {
            "sucesso": {"dataType":"boolean","required":true},
            "mensagem": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdicionarNotasRequest": {
        "dataType": "refObject",
        "properties": {
            "nota": {"dataType":"double","required":true},
            "quantidade": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PromocaoResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "sabor": {"dataType":"string","required":true},
            "desconto": {"dataType":"double","required":true},
            "ativo": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PromocaoResultadoResponse": {
        "dataType": "refObject",
        "properties": {
            "sucesso": {"dataType":"boolean","required":true},
            "mensagem": {"dataType":"string","required":true},
            "promocao": {"ref":"PromocaoResponse"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CriarPromocaoRequest": {
        "dataType": "refObject",
        "properties": {
            "sabor": {"dataType":"string","required":true},
            "desconto": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AtualizarPromocaoRequest": {
        "dataType": "refObject",
        "properties": {
            "desconto": {"dataType":"double"},
            "ativo": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CompraResponse": {
        "dataType": "refObject",
        "properties": {
            "sucesso": {"dataType":"boolean","required":true},
            "mensagem": {"dataType":"string","required":true},
            "sabor": {"dataType":"string"},
            "precoPago": {"dataType":"double"},
            "trocoDado": {"dataType":"double"},
            "reembolso": {"dataType":"double"},
            "saldoAtual": {"dataType":"double"},
            "estado": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CompraRequest": {
        "dataType": "refObject",
        "properties": {
            "clienteId": {"dataType":"double","required":true},
            "sabor": {"dataType":"string","required":true},
            "valorNota": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TrocaRequest": {
        "dataType": "refObject",
        "properties": {
            "clienteId": {"dataType":"double","required":true},
            "saborNovo": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EstornoRequest": {
        "dataType": "refObject",
        "properties": {
            "clienteId": {"dataType":"double","required":true},
            "movimentacaoId": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PrecoCatalogoItemResponse": {
        "dataType": "refObject",
        "properties": {
            "sabor": {"dataType":"string","required":true},
            "precoBase": {"dataType":"double","required":true},
            "precoFinal": {"dataType":"double","required":true},
            "emPromocao": {"dataType":"boolean","required":true},
            "desconto": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SaborParaTrocaResponse": {
        "dataType": "refObject",
        "properties": {
            "sabor": {"dataType":"string","required":true},
            "preco": {"dataType":"double","required":true},
            "diferenca": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SaboresParaTrocaResponse": {
        "dataType": "refObject",
        "properties": {
            "saborAtual": {"dataType":"string"},
            "precoAtual": {"dataType":"double"},
            "sabores": {"dataType":"array","array":{"dataType":"refObject","ref":"SaborParaTrocaResponse"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ClienteResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "nome": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "saldo": {"dataType":"double","required":true},
            "ultimaSaborGuardado": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "senha": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RegistroRequest": {
        "dataType": "refObject",
        "properties": {
            "nome": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "senha": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SaldoResponse": {
        "dataType": "refObject",
        "properties": {
            "clienteId": {"dataType":"double","required":true},
            "saldo": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreditoRequest": {
        "dataType": "refObject",
        "properties": {
            "clienteId": {"dataType":"double","required":true},
            "valorNota": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MovimentacaoResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "clienteId": {"dataType":"double","required":true},
            "dataHora": {"dataType":"string","required":true},
            "valorNota": {"dataType":"double","required":true},
            "tipoSabor": {"dataType":"string","required":true},
            "tipoOperacao": {"dataType":"string","required":true},
            "trocoDado": {"dataType":"double","required":true},
            "reembolso": {"dataType":"double","required":true},
            "estado": {"dataType":"string","required":true},
            "estornada": {"dataType":"boolean","required":true},
            "referenciaId": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsSlotController_obterEstoque: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/api/slot/estoque',
            ...(fetchMiddlewares<RequestHandler>(SlotController)),
            ...(fetchMiddlewares<RequestHandler>(SlotController.prototype.obterEstoque)),

            async function SlotController_obterEstoque(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSlotController_obterEstoque, request, response });

                const controller = new SlotController();

              await templateService.apiHandler({
                methodName: 'obterEstoque',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSlotController_adicionarNotas: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"AdicionarNotasRequest"},
        };
        app.post('/api/slot/estoque/adicionar',
            ...(fetchMiddlewares<RequestHandler>(SlotController)),
            ...(fetchMiddlewares<RequestHandler>(SlotController.prototype.adicionarNotas)),

            async function SlotController_adicionarNotas(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSlotController_adicionarNotas, request, response });

                const controller = new SlotController();

              await templateService.apiHandler({
                methodName: 'adicionarNotas',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPromocaoController_listar: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/api/promocao/listar',
            ...(fetchMiddlewares<RequestHandler>(PromocaoController)),
            ...(fetchMiddlewares<RequestHandler>(PromocaoController.prototype.listar)),

            async function PromocaoController_listar(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPromocaoController_listar, request, response });

                const controller = new PromocaoController();

              await templateService.apiHandler({
                methodName: 'listar',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPromocaoController_criar: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"CriarPromocaoRequest"},
        };
        app.post('/api/promocao/criar',
            ...(fetchMiddlewares<RequestHandler>(PromocaoController)),
            ...(fetchMiddlewares<RequestHandler>(PromocaoController.prototype.criar)),

            async function PromocaoController_criar(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPromocaoController_criar, request, response });

                const controller = new PromocaoController();

              await templateService.apiHandler({
                methodName: 'criar',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPromocaoController_atualizar: Record<string, TsoaRoute.ParameterSchema> = {
                sabor: {"in":"path","name":"sabor","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"AtualizarPromocaoRequest"},
        };
        app.put('/api/promocao/:sabor',
            ...(fetchMiddlewares<RequestHandler>(PromocaoController)),
            ...(fetchMiddlewares<RequestHandler>(PromocaoController.prototype.atualizar)),

            async function PromocaoController_atualizar(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPromocaoController_atualizar, request, response });

                const controller = new PromocaoController();

              await templateService.apiHandler({
                methodName: 'atualizar',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPromocaoController_remover: Record<string, TsoaRoute.ParameterSchema> = {
                sabor: {"in":"path","name":"sabor","required":true,"dataType":"string"},
        };
        app.delete('/api/promocao/:sabor',
            ...(fetchMiddlewares<RequestHandler>(PromocaoController)),
            ...(fetchMiddlewares<RequestHandler>(PromocaoController.prototype.remover)),

            async function PromocaoController_remover(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPromocaoController_remover, request, response });

                const controller = new PromocaoController();

              await templateService.apiHandler({
                methodName: 'remover',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCoxinhaController_comprar: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"CompraRequest"},
        };
        app.post('/api/coxinha/comprar',
            ...(fetchMiddlewares<RequestHandler>(CoxinhaController)),
            ...(fetchMiddlewares<RequestHandler>(CoxinhaController.prototype.comprar)),

            async function CoxinhaController_comprar(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCoxinhaController_comprar, request, response });

                const controller = new CoxinhaController();

              await templateService.apiHandler({
                methodName: 'comprar',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCoxinhaController_trocar: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"TrocaRequest"},
        };
        app.post('/api/coxinha/trocar',
            ...(fetchMiddlewares<RequestHandler>(CoxinhaController)),
            ...(fetchMiddlewares<RequestHandler>(CoxinhaController.prototype.trocar)),

            async function CoxinhaController_trocar(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCoxinhaController_trocar, request, response });

                const controller = new CoxinhaController();

              await templateService.apiHandler({
                methodName: 'trocar',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCoxinhaController_estornar: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"EstornoRequest"},
        };
        app.post('/api/coxinha/estornar',
            ...(fetchMiddlewares<RequestHandler>(CoxinhaController)),
            ...(fetchMiddlewares<RequestHandler>(CoxinhaController.prototype.estornar)),

            async function CoxinhaController_estornar(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCoxinhaController_estornar, request, response });

                const controller = new CoxinhaController();

              await templateService.apiHandler({
                methodName: 'estornar',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCoxinhaController_listarPrecos: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/api/coxinha/precos',
            ...(fetchMiddlewares<RequestHandler>(CoxinhaController)),
            ...(fetchMiddlewares<RequestHandler>(CoxinhaController.prototype.listarPrecos)),

            async function CoxinhaController_listarPrecos(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCoxinhaController_listarPrecos, request, response });

                const controller = new CoxinhaController();

              await templateService.apiHandler({
                methodName: 'listarPrecos',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCoxinhaController_listarSaboresParaTroca: Record<string, TsoaRoute.ParameterSchema> = {
                clienteId: {"in":"path","name":"clienteId","required":true,"dataType":"double"},
        };
        app.get('/api/coxinha/sabores-para-troca/:clienteId',
            ...(fetchMiddlewares<RequestHandler>(CoxinhaController)),
            ...(fetchMiddlewares<RequestHandler>(CoxinhaController.prototype.listarSaboresParaTroca)),

            async function CoxinhaController_listarSaboresParaTroca(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCoxinhaController_listarSaboresParaTroca, request, response });

                const controller = new CoxinhaController();

              await templateService.apiHandler({
                methodName: 'listarSaboresParaTroca',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsClienteController_login: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"LoginRequest"},
        };
        app.post('/api/cliente/login',
            ...(fetchMiddlewares<RequestHandler>(ClienteController)),
            ...(fetchMiddlewares<RequestHandler>(ClienteController.prototype.login)),

            async function ClienteController_login(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsClienteController_login, request, response });

                const controller = new ClienteController();

              await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsClienteController_registrar: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"RegistroRequest"},
        };
        app.post('/api/cliente/registrar',
            ...(fetchMiddlewares<RequestHandler>(ClienteController)),
            ...(fetchMiddlewares<RequestHandler>(ClienteController.prototype.registrar)),

            async function ClienteController_registrar(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsClienteController_registrar, request, response });

                const controller = new ClienteController();

              await templateService.apiHandler({
                methodName: 'registrar',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsClienteController_obter: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/api/cliente/:id',
            ...(fetchMiddlewares<RequestHandler>(ClienteController)),
            ...(fetchMiddlewares<RequestHandler>(ClienteController.prototype.obter)),

            async function ClienteController_obter(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsClienteController_obter, request, response });

                const controller = new ClienteController();

              await templateService.apiHandler({
                methodName: 'obter',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsClienteController_obterSaldo: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/api/cliente/:id/saldo',
            ...(fetchMiddlewares<RequestHandler>(ClienteController)),
            ...(fetchMiddlewares<RequestHandler>(ClienteController.prototype.obterSaldo)),

            async function ClienteController_obterSaldo(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsClienteController_obterSaldo, request, response });

                const controller = new ClienteController();

              await templateService.apiHandler({
                methodName: 'obterSaldo',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsClienteController_inserirCredito: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"CreditoRequest"},
        };
        app.post('/api/cliente/credito',
            ...(fetchMiddlewares<RequestHandler>(ClienteController)),
            ...(fetchMiddlewares<RequestHandler>(ClienteController.prototype.inserirCredito)),

            async function ClienteController_inserirCredito(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsClienteController_inserirCredito, request, response });

                const controller = new ClienteController();

              await templateService.apiHandler({
                methodName: 'inserirCredito',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsClienteController_obterExtrato: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/api/cliente/:id/extrato',
            ...(fetchMiddlewares<RequestHandler>(ClienteController)),
            ...(fetchMiddlewares<RequestHandler>(ClienteController.prototype.obterExtrato)),

            async function ClienteController_obterExtrato(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsClienteController_obterExtrato, request, response });

                const controller = new ClienteController();

              await templateService.apiHandler({
                methodName: 'obterExtrato',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
