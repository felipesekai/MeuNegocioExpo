# Plano de Migração para "Offline-First"

O objetivo desta migração é transformar o aplicativo para que ele funcione 100% offline ("offline-first"), utilizando a conexão com a internet apenas como um recurso secundário para backup de dados na nuvem (Firebase).

## Etapas da Migração

1.  **Configurar um Banco de Dados Local:**
    *   Adicionar e configurar uma biblioteca de banco de dados local no projeto (Ex: WatermelonDB ou Expo SQLite).
    *   Definir o schema do banco de dados (tabelas, colunas, relacionamentos) para espelhar a estrutura de dados atual.

2.  **Criar uma Camada de Repositório de Dados:**
    *   Desenvolver uma camada de abstração ("repositório") para centralizar todas as operações de dados (CRUD).
    *   Isso garantirá que o restante do aplicativo interaja apenas com o repositório, e não diretamente com o banco de dados.

3.  **Refatorar o Fluxo de Autenticação e Navegação:**
    *   Modificar a lógica de navegação para que o aplicativo inicie diretamente na tela principal, sem exigir login.
    *   O login se tornará um recurso opcional dentro do aplicativo, e não uma barreira de entrada.

4.  **Adaptar as Telas e Componentes:**
    *   Refatorar todas as telas e componentes para que leiam e escrevam dados através da nova camada de repositório.
    *   Remover chamadas diretas ao Firebase e indicadores de carregamento de rede para operações de dados do dia a dia.

5.  **Implementar a Funcionalidade de Backup (Login Opcional):**
    *   Criar uma nova tela (ex: "Conta" ou "Backup e Sincronização") onde o usuário poderá, opcionalmente, fazer login com sua conta.
    *   Reutilizar os componentes de `SignIn` e `SignUp` neste novo fluxo.

6.  **Desenvolver o Serviço de Sincronização:**
    *   Implementar a lógica que compara os dados do banco de dados local com os dados no Firebase.
    *   Criar as rotinas para enviar (upload) e receber (download) as alterações, garantindo que ambos os lados fiquem consistentes após a sincronização.

---

## Detalhamento em Sprints

### Sprint 1: Fundação e Camada de Dados
*O foco desta sprint é construir a base de dados local e a camada de serviço que o aplicativo usará.*

- [ ] **Tarefa 1.1:** Instalar e configurar a biblioteca de banco de dados local (WatermelonDB).
- [ ] **Tarefa 1.2:** Criar o schema do banco de dados local, definindo os modelos para `Clients`, `Products`, e `Orders`.
- [ ] **Tarefa 1.3:** Implementar a camada de repositório (`src/database/repository.js`) com as funções CRUD iniciais (ex: `getAllClients`, `createProduct`, `updateOrder`).
- [ ] **Tarefa 1.4 (Opcional):** Criar testes unitários para o repositório para garantir que as operações no banco de dados local funcionem corretamente.

### Sprint 2: Migração da Aplicação para Uso Offline
*O foco desta sprint é refatorar o aplicativo para que ele dependa exclusivamente da camada de dados local criada na Sprint 1.*

- [ ] **Tarefa 2.1:** Alterar o roteador principal (`src/route/index.js`) para carregar as rotas do aplicativo (`app.routes.js`) diretamente, removendo a obrigatoriedade do login inicial.
- [ ] **Tarefa 2.2:** Refatorar a seção de Clientes (`src/pages/Client/*`) para consumir dados do repositório local.
- [ ] **Tarefa 2.3:** Refatorar a seção de Produtos (`src/pages/Product/*`) para consumir dados do repositório local.
- [ ] **Tarefa 2.4:** Refatorar a seção de Pedidos (`src/pages/NewRequest/*`) para consumir dados do repositório local.
- [ ] **Tarefa 2.5:** Revisar e remover indicadores de carregamento (`ActivityIndicator`) que dependiam de chamadas de rede nas seções migradas.

### Sprint 3: Implementação do Backup e Sincronização
*O foco desta sprint é reintroduzir a funcionalidade online como um recurso de backup opcional.*

- [ ] **Tarefa 3.1:** Criar uma nova tela de "Conta e Backup" no menu do aplicativo.
- [ ] **Tarefa 3.2:** Mover e adaptar o fluxo de `SignIn`/`SignUp` para a nova tela de Conta, usando o `auth.js` para gerenciar o estado de login de backup.
- [ ] **Tarefa 3.3:** Implementar o serviço de sincronização (`src/services/sync.js`) que será ativado após o login.
    - [ ] **Sub-tarefa 3.3.1:** Criar a lógica para enviar registros locais (novos ou modificados) para o Firebase.
    - [ ] **Sub-tarefa 3.3.2:** Criar a lógica para baixar registros do Firebase (novos ou modificados) para o banco de dados local.
- [ ] **Tarefa 3.4:** Adicionar um botão "Sincronizar Agora" na tela de Conta.
- [ ] **Tarefa 3.5:** Exibir informações de status para o usuário, como a data e hora da última sincronização bem-sucedida.
