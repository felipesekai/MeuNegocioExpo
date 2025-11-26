# Meu Negócio

Aplicação desenvolvida em React Native (Expo) para gerenciamento de um pequeno negócio.

## Features

- Cadastro e gerenciamento de clientes.
- Cadastro e gerenciamento de produtos (com controle de estoque).
- Criação e gerenciamento de pedidos (com atualização automática de estoque).
- Gerenciamento de compras em lotes (Purchase Batches), com atualização de estoque.
- Autenticação de usuários com Firebase (cadastro, login, logout).
- Sincronização de dados entre Firebase Realtime Database e o banco de dados SQLite local.
- Navegação intuitiva com React Navigation (Drawer, Top Tabs, Stack).
- Formulários com validação utilizando Unform e Yup.

## Tecnologias

- **React Native**: Framework para construção de aplicativos móveis nativos.
- **Expo**: Ferramenta que facilita o desenvolvimento, build e deploy de apps React Native.
- **Firebase**: Backend as a Service para autenticação, database em tempo real e mais.
- **SQLite**: Banco de dados local para persistência de dados offline e sincronização.
- **React Navigation**: Solução de navegação para aplicativos React Native.
- **Styled Components**: Para estilização de componentes com CSS-in-JS.
- **Unform**: Biblioteca para criação de formulários performáticos no React.
- **Yup**: Validação de schemas para formulários.
- **date-fns**: Utilitário para manipulação de datas.
- **Nova Arquitetura React Native (New Architecture Enabled)**: Utilizando a nova arquitetura para melhor performance.

## Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/felipesekai/MeuNegocioExpo.git
    cd MeuNegocioExpo
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Configure o Firebase:
    -   Crie um projeto no Firebase.
    -   Adicione um aplicativo Android e iOS ao seu projeto Firebase.
    -   Baixe `google-services.json` (Android) e `GoogleService-Info.plist` (iOS) e coloque-os na raiz do projeto.
    -   Atualize `firebaseConfig` em `src/services/firebaseConnect.js` com suas credenciais.

## Rodando a Aplicação

-   Para iniciar o projeto no modo de desenvolvimento:
    ```bash
    npm start
    ```
-   Para rodar no Android:
    ```bash
    npm run android
    ```
-   Para rodar no iOS:
    ```bash
    npm run ios
    ```
-   Para rodar na web:
    ```bash
    npm run web
    ```

## Testes

Para executar os testes automatizados do projeto:
```bash
npm test
```

## Linting e Formatação

Para manter a qualidade e consistência do código:

-   Para verificar o lint:
    ```bash
    npm run lint
    ```
-   Para formatar o código automaticamente:
    ```bash
    npm run format
    ```

## Estrutura do Projeto

```
/MeuNegocioExpo
├───.expo/
├───assets/
├───src/
│   ├───components/       # Componentes de UI reutilizáveis
│   ├───contexts/         # Contextos globais (Autenticação, Estado Global)
│   ├───database/         # Abstração e operações com SQLite
│   ├───hooks/            # Hooks customizados para lógica de negócio
│   ├───pages/            # Telas principais da aplicação
│   ├───route/            # Configuração de navegação (React Navigation)
│   ├───services/         # Serviços externos (Firebase, Export, Sync)
│   ├───utils/            # Funções utilitárias e estilos
│   └───validation/       # Schemas de validação (Yup)
├───__mocks__/            # Mocks para testes
├───__tests__/            # Testes unitários e de integração
└───package.json          # Metadados do projeto e dependências
```

eas build --platform android --profile preview