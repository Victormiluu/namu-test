# Namu — Catálogo de Conteúdos

Aplicação web para explorar conteúdos de saúde e bem-estar, com recursos de busca, filtragem por categorias, visualização de detalhes e gerenciamento de favoritos.

## Tecnologias utilizadas

- **React** — construção da interface.
- **TypeScript** — tipagem estática.
- **Vite** — ambiente de desenvolvimento e build.
- **Tailwind CSS** — estilização e responsividade.
- **React Router** — navegação entre páginas.
- **Axios** — comunicação com a API.
- **Lucide React** — ícones da interface.

## Funcionalidades

- Listagem de conteúdos disponíveis no catálogo.
- Busca de conteúdos pelo título.
- Filtro por categoria.
- Paginação dos resultados.
- Visualização dos detalhes de cada conteúdo.
- Adicionar e remover conteúdos dos favoritos.
- Estados de carregamento, erro e lista vazia.
- Página 404 para rotas inexistentes.
- Interface responsiva para diferentes tamanhos de tela.

## Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) — versão compatível com o projeto.
- npm, instalado junto com o Node.js.
- A API do projeto disponível localmente.

## Como executar o projeto

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta do projeto web:

```bash
cd NOME_DA_PASTA_WEB
```

Substitua `URL_DO_REPOSITORIO` e `NOME_DA_PASTA_WEB` pelos dados do seu repositório.

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar a API

A aplicação depende da API para carregar os conteúdos, categorias e favoritos.

Por padrão, a API disponibilizada para o projeto pode ser executada em:

```text
http://localhost:3333
```

Caso a API esteja em outro repositório ou diretório, siga as instruções de inicialização dele antes de executar o front-end.

Se o projeto web utilizar variáveis de ambiente para configurar a URL da API, configure o arquivo `.env` conforme as variáveis esperadas pelo código.

### 4. Iniciar o ambiente de desenvolvimento

```bash
npm run dev
```

Após iniciar o Vite, acesse o endereço exibido no terminal, normalmente:

```text
http://localhost:5173
```

## Scripts disponíveis

Os comandos abaixo são os padrões esperados em um projeto Vite. A disponibilidade de cada script depende das configurações do `package.json`.

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o ambiente de desenvolvimento. |
| `npm run build` | Gera a versão de produção. |
| `npm run preview` | Permite visualizar localmente a versão gerada. |

## Estrutura do projeto

A estrutura pode variar conforme a organização dos arquivos, mas segue uma divisão por páginas, componentes e serviços:

```text
src/
├── components/       # Componentes reutilizáveis
├── pages/            # Páginas da aplicação
│   ├── home.tsx
│   ├── contendDetail.tsx
│   └── pageNotFound.tsx
├── services/         # Comunicação com a API
├── types/            # Tipos e interfaces TypeScript
├── App.tsx            # Rotas da aplicação
└── main.tsx           # Ponto de entrada
```

## Rotas principais

| Rota | Descrição |
|---|---|
| `/` | Catálogo de conteúdos. |
| `/contents/:id` | Detalhes de um conteúdo específico. |
| `*` | Página exibida para endereços não encontrados. |

## Observações

- A API precisa estar disponível para que as funcionalidades que dependem de dados funcionem corretamente.
- Verifique a URL configurada no cliente HTTP caso ocorram erros de conexão.
- Não inclua credenciais ou informações sensíveis no repositório.
- Os comandos e caminhos devem corresponder à configuração atual do projeto.
