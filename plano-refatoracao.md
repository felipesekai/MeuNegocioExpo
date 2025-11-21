# Plano de Refatoração

## Camadas e separação
- Extrair camada de repositórios/DB com interface única (SQLite + sync), evitando acesso direto em telas.
- Mover lógica de sync para um serviço isolado com fila/estado.

## Estado e hooks
- Centralizar estados globais (auth, tema, pedidos em andamento) em contextos ou Zustand/Jotai.
- Criar hooks `useOrders`, `useClients`, `useProducts` para leitura/cache e invalidação pós-mutações.

## Fluxos assíncronos
- Padronizar chamadas async com `try/catch` e feedback de loading/erro.
- Criar helper de `request` com toasts e logs; remover `useEffect` duplicado e limpar listeners Firebase.

## UI/UX e componentes
- Padronizar inputs/botões/listas em componentes compartilhados (contador numérico, dialog de confirmação, loader).
- Alinhar ícones/tipografia/cores via theme; revisar acessibilidade (labels, touch targets).

## Navegação
- Garantir type-safety/proptypes nas rotas; mover criação de navegadores para arquivos dedicados.
- Usar callbacks de foco para recarregar dados em vez de re-montar telas inteiras.

## Modelos e validação
- Definir schemas (Yup/Zod) para entidades (Cliente, Produto, Pedido) e reuso em forms e sync.
- Normalizar campos (datas, números) antes de persistir.

## Sync/offline
- Isolar diff/pull/push em módulo; manter timestamps/versões claros; tratar conflitos e exclusões.
- Adicionar logs e retries.

## Testes e qualidade
- Adicionar testes unitários para services (DB/sync) e hooks; smoke tests de navegação.
- Configurar lint/format (ESLint/Prettier) e scripts CI.

## Configuração e secrets
- Centralizar variáveis (Firebase, etc.) em `.env`/app.json; remover dependências não usadas (Realm).
- Substituir patches em node_modules por patch-package ou alternativas estáveis.

## Performance e listas
- Usar `keyExtractor` consistente, `memo`/`useCallback` nos itens de lista.
- Evitar re-renders re-montando modais; carregar dados de forma incremental/paginada se necessário.
