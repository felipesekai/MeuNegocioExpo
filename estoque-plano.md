# Plano de Implementação – Controle de Estoque e Compras

## Objetivos
- Registrar compras de mercadorias com quantidade e custo unitário.
- Atualizar estoque automaticamente: somar na compra; subtrair na venda.
- Rastrear histórico de compras para auditoria e custo médio.
- Sincronizar dados (SQLite ↔ Firebase) mantendo integridade de estoque.

## Escopo por etapas

### Etapa 1 — Modelo e persistência
- [x] Criar tabela `purchases` em SQLite: `_id`, `productId`, `quantity`, `unitCost`, `totalCost`, `purchasedAt`, `createdAt`, `updatedAt`.
- [x] Ajustar tabela `products` para ter `quantity` (já criado) e preparar índices.
- [x] Implementar funções no DB/repository:
  - `createPurchase(purchaseData)` que grava compra e incrementa estoque.
  - `getPurchases()` / `getPurchasesByProduct(productId)`.
  - `decrementStock(productId, amount)` para uso em vendas.
- [x] Adicionar validação Yup para compras (quantidade > 0, custo > 0).

### Etapa 2 — UI e fluxo de compras
- [x] Nova tela/modal “Registrar Compra” acessível a partir de Produtos.
- [x] Form com seleção de produto, quantidade, custo unitário; mostra custo total.
- [x] Ao confirmar: chama `createPurchase` e atualiza estoque e lista de produtos.
- [x] Lista de compras (histórico) opcional na mesma tela ou seção separada.

### Etapa 3 — Integração com vendas (pedidos)
- [x] No fluxo de pedido, ao confirmar venda: `decrementStock(productId, quantity)`.
- [x] Tratar casos de estoque insuficiente: bloquear venda ou permitir negativo com aviso.
- [x] Exibir estoque atual no seletor de produtos (para decisão rápida).

### Etapa 4 — Sync e backup
- [x] Sincronizar compras (`purchases`) com Firebase:
  - Serializar compra com `productId`, `quantity`, `unitCost`, `totalCost`, `purchasedAt`, `updated_at`, `_status`.
  - Pull: recriar compras e ajustar estoque (idempotente).
  - Push: enviar compras novas/alteradas/deletadas.
- [x] Garantir que `products.quantity` permanece consistente (talvez recalcular estoque a partir de compras-vendas em caso de divergência).

### Etapa 5 — UX e relatórios
- [x] Mostrar badge de estoque e custo médio (opcional) na lista de produtos.
- [x] Histórico de compras por produto (filtro).
- [x] Exportar/compartilhar histórico de compras (CSV) via sharing.

## Considerações técnicas
- Transações: ao criar compra ou venda, usar `runInTransaction` para manter estoque consistente.
- Migração: ao criar tabela `purchases`, usar checagem `PRAGMA table_info` como no restante do código.
- Firebase rules: adicionar `purchases` com `.indexOn: ["updated_at"]` e permissões por usuário.
- Testes: unitários para `createPurchase`, `decrementStock`, sync de compras.

## Critérios de pronto
- Criar/editar compra atualiza estoque local e reflete na UI de produtos.
- Vendas decrementam estoque corretamente.
- Sync não perde quantidade e mantém histórico de compras.
- Testes básicos passando (DB + sync + validações).
