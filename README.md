# MeuNegocioExpo

## Descrição do Projeto

O MeuNegocioExpo é um aplicativo móvel desenvolvido com React Native e Expo, projetado para auxiliar na gestão de pequenos negócios. Ele oferece funcionalidades para gerenciar clientes, produtos e pedidos, facilitando o controle das operações diárias.

## Funcionalidades

*   **Autenticação de Usuários**: Cadastro e login de usuários.
*   **Gestão de Clientes**: Adicionar, editar, visualizar e listar clientes.
*   **Gestão de Produtos**: Adicionar, editar, visualizar e listar produtos.
*   **Gestão de Pedidos/Requisições**: Criar novos pedidos, visualizar e gerenciar itens.
*   **Navegação Intuitiva**: Utiliza Drawer Navigation e Top Tab Navigation para uma experiência de usuário fluida.
*   **Persistência de Dados**: Integração com Firebase para armazenamento de dados.

## Tecnologias Utilizadas

*   **React Native**: Framework para construção de aplicativos móveis nativos usando JavaScript/TypeScript.
*   **Expo**: Plataforma para desenvolvimento universal de aplicativos React Native, facilitando a configuração e o build.
*   **Firebase**: Backend-as-a-Service (BaaS) para autenticação e banco de dados (Firestore/Realtime Database).
*   **React Navigation**: Solução de navegação para aplicativos React Native.
*   **Styled Components / StyleSheet**: Para estilização dos componentes.

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

*   **Node.js**: Versão 14 ou superior.
*   **npm** (Node Package Manager) ou **Yarn**: Gerenciador de pacotes.
*   **Expo CLI**: Ferramenta de linha de comando do Expo.

Você pode instalar o Expo CLI globalmente usando:
```bash
npm install -g expo-cli
# ou
yarn global add expo-cli
```

## Instalação e Execução

Siga os passos abaixo para configurar e rodar o projeto em sua máquina local:

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd MeuNegocioExpo
    ```
    *(Substitua `<URL_DO_SEU_REPOSITORIO>` pela URL real do seu repositório Git.)*

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configuração do Firebase:**
    Este projeto utiliza Firebase para autenticação e banco de dados. Você precisará configurar seu próprio projeto Firebase:
    *   Crie um novo projeto no [Firebase Console](https://console.firebase.google.com/).
    *   Adicione um aplicativo web ao seu projeto Firebase para obter as credenciais de configuração.
    *   Crie um arquivo `src/services/firebaseConfig.js` (ou edite o existente `src/services/firebaseConnect.js` se já contiver placeholders) e adicione suas credenciais:

    ```javascript
    // src/services/firebaseConnect.js (Exemplo)
    import firebase from 'firebase/app';
    import 'firebase/auth';
    import 'firebase/firestore';

    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    export const auth = firebase.auth();
    export const db = firebase.firestore();
    export default firebase;
    ```
    *   Certifique-se de habilitar os serviços de Autenticação (e.g., Email/Password) e Firestore no seu projeto Firebase.

4.  **Inicie o aplicativo:**
    ```bash
    expo start
    ```

    Após executar o comando, um servidor de desenvolvimento será iniciado e um QR code será exibido no seu terminal.

5.  **Execute no seu dispositivo/emulador:**
    *   **Com o aplicativo Expo Go:** Baixe o aplicativo "Expo Go" na App Store (iOS) ou Google Play Store (Android). Abra o aplicativo e escaneie o QR code exibido no seu terminal.
    *   **Emulador Android/iOS:** Se você tiver um emulador configurado (Android Studio ou Xcode), pressione `a` para Android ou `i` para iOS no terminal onde o `expo start` está rodando.
    *   **Navegador Web:** Pressione `w` para abrir o aplicativo em um navegador web (funcionalidades nativas podem não estar disponíveis).

## Estrutura do Projeto

```
.
├── App.js                  # Ponto de entrada principal do aplicativo
├── app.json                # Configurações do Expo
├── babel.config.js         # Configuração do Babel
├── package.json            # Dependências e scripts do projeto
├── assets/                 # Imagens e ícones do aplicativo
└── src/
    ├── components/         # Componentes reutilizáveis da UI
    ├── contexts/           # Contextos globais (e.g., autenticação)
    ├── database/           # Lógica de interação com o banco de dados
    ├── pages/              # Telas/páginas do aplicativo
    ├── route/              # Configuração de navegação (React Navigation)
    ├── services/           # Serviços externos (e.g., Firebase)
    └── utils/              # Utilitários, estilos e temas
```

## Contribuindo

Contribuições são bem-vindas! Se você deseja contribuir, por favor, siga estes passos:

1.  Faça um fork do repositório.
2.  Crie uma nova branch (`git checkout -b feature/sua-feature`).
3.  Faça suas alterações e commit-as (`git commit -m 'feat: Adiciona nova funcionalidade X'`).
4.  Envie para a branch original (`git push origin feature/sua-feature`).
5.  Abra um Pull Request.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
