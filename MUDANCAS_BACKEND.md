# LanchoneteIF — Back-end: mudanças aplicadas

## Como rodar (IMPORTANTE)

As rotas e o swagger do tsoa são **gerados** a partir dos controllers. Como
adicionei endpoints novos, é obrigatório regenerar e migrar o banco:

```bash
# 1) Aplicar a migração nova (enum ESTORNO + colunas no extrato)
npx prisma migrate dev

# 2) Subir a API (o script já roda "tsoa spec-and-routes" antes)
npm run dev
```

Se preferir aplicar a migração manualmente, o SQL está em
`prisma/migrations/20260625040000_add_estorno_estado_reembolso/migration.sql`.

> `src/routes/routes.ts` e `src/generated/swagger.json` no zip ainda são os
> antigos — eles são **sobrescritos** automaticamente por `npm run dev` /
> `npm run build:routes`. Não edite à mão.

## Design Patterns (6, sem contar DAO nem Singleton)

| Pattern | Onde | O que faz |
|---|---|---|
| **Factory** | `patterns/factory/CoxinhaFactory.ts` (+ `produtos/`) | Cria as coxinhas por sabor. Produtos foram movidos de `strategy/` para cá. |
| **Strategy** | `patterns/strategy/` (`PrecoStrategyResolver`, `PrecoPadrao`, `PrecoPromocional`) | **Agora aplicado de verdade**: o resolver escolhe a estratégia por sabor em runtime e alimenta o catálogo de preços. |
| **Chain of Responsibility** | `patterns/chain/` (`Validador` + 3 validadores) | **Unificado** numa única abstração (antes havia duas concorrentes). Valida sabor → valor da nota → troco. |
| **State** | `patterns/state/Pedido.ts` | Ciclo do pedido `VAZIO → EM_PROCESSO → AGUARDANDO_PAGAMENTO → CONCLUIDO` / `ESTORNADO`; transições inválidas lançam erro. |
| **Command** | `patterns/command/` (`Comprar`, `Trocar`, `InserirCredito`, `Estornar` + `Invocador`) | Cada operação é um comando; estorno é o comando compensatório. |
| **Observer** | `patterns/observer/TransacaoObserver.ts` | Ao concluir/estornar/creditar, o subject notifica `ExtratoObserver` (grava extrato) e `LogObserver`. |

Infra (não contam como obrigatórios): **DAO** (`persistence/`), **Singleton** (`SlotNotasManager`, `PrismaConnection`).

> A `TransacaoFacade` (código morto, duplicava o `TransacaoService`) foi **removida**.

## Correções funcionais

1. **Preço exibido** — novo `GET /coxinha/precos` retorna `{sabor, precoBase, precoFinal, emPromocao}` calculado via Strategy. O mesmo cálculo é usado na compra/troca, então o que aparece é o que é cobrado.
2. **Troca devolve/cobra a diferença** — removida a trava de "mesma faixa de preço". Downgrade reembolsa a diferença ao **saldo** debitando cédulas do `slot_notas`; upgrade cobra a diferença do saldo. O `ResultadoCompra` traz `reembolso`, `reembolsoEntregue` e `saldoAtual`.
3. **Estorno** — novo `POST /coxinha/estornar` (`{clienteId, movimentacaoId}`). Reembolsa o preço pago (nota − troco) ao saldo, debita as cédulas, libera a reserva (se ainda for o sabor guardado), marca a compra como `estornada` e registra um lançamento `ESTORNO`. Não permite estornar duas vezes nem estornar o que não é compra.
4. **Compras sequenciais** — modelo de "uma reserva ativa + histórico ilimitado". Cada compra concluída entra no extrato; a reserva passa a ser a última compra (alinhado ao enunciado: "uma coxinha reservada").
5. **`inserirCredito` corrigido** — antes **não gravava no extrato** (lançamentos `CREDITO` nunca apareciam) e não passava pela máquina. Agora registra a cédula no slot e grava no extrato via Observer.

## Modelo de reembolso (para defender na banca)

Reembolso (troca p/ mais barata e estorno) é **creditado ao saldo** e as
**cédulas equivalentes são debitadas do `slot_notas`** (mesma lógica do troco).
Se não houver combinação de cédulas para o valor, a operação falha com
"Transação impossível: falta de cédulas específicas" — coerente com a compra.

## Novos campos no banco (`movimentacao`)

- `reembolso` (Decimal) — valor reembolsado ao saldo
- `estado` (Text) — estado final do pedido (State)
- `estornada` (Boolean) — marca a compra original já estornada
- `referencia_id` (Int) — liga o lançamento `ESTORNO` à compra original

E o enum `TipoOperacao` ganhou o valor `ESTORNO`.
