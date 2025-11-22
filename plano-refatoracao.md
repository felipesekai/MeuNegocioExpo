# Plano de Refatoracao em Sprints

## Sprint 1 – Fundamentos e limpeza (concluída)
- [x] Remover dependencias nao usadas (Realm) e documentar variaveis de ambiente em `.env`/app.json.
- [x] Padronizar chamadas async com helper de request (loading/erro) e limpar listeners Firebase.
- [x] Criar schemas de validacao (Yup/Zod) para Cliente/Produto/Pedido e aplicar nos forms.
- [x] Ajustar keyExtractor/memo/useCallback em listas criticas para evitar renders extras.

## Sprint 2 – Camadas e hooks (concluída)
- [x] Extrair camada de repositorios/DB com interface unica (SQLite + sync), evitando acesso direto em telas.
- [x] Mover logica de sync para servico isolado (pull/push, timestamps, logs, retries) via repositorio.
- [x] Criar hooks `useOrders`, `useClients`, `useProducts` com cache e invalidacao pos-mutacoes (aplicados em pedidos, clientes e carregamento de produtos).
- [x] Centralizar estados globais (auth, tema, pedidos em andamento) em contextos ou store leve (Zustand/Jotai).
- [x] Renomear arquivos `index.js` de telas/componentes para nomes descritivos (ClientScreen, ProductScreen, NewRequestScreen, LastOrdersScreen) e ajustar imports.

## Sprint 3 – UI/UX e componentes (concluída)
- [x] Padronizar inputs/botoes/listas (contador numerico, dialog de confirmacao, loader central).
- [x] Alinhar icones/tipografia/cores via tema; revisar acessibilidade (labels, touch targets).
- [x] Revisar navegacao: arquivos dedicados para navegadores, callbacks de foco para recarregar dados sem re-montar telas.

## Sprint 4 – Testes e qualidade (em andamento)
- [x] Configurar lint/format (ESLint/Prettier) e scripts CI.
- [x] Adicionar testes unitarios para services (DB/sync) e hooks; smoke tests de navegacao basica.
- [ ] Substituir patches em `node_modules` por patch-package ou solucao definitiva.

## Sprint 5 – Performance e sincronizacao avançada
- Normalizar campos (datas, numeros) antes de persistir; tratar conflitos/exclusoes no sync.
- Incremental/paginado em listas se necessario; evitar re-montar modais para acoes frequentes.
- Monitorar logs de sync/offline e ajustar estrategia de retries.
