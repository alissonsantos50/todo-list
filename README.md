# Aplicação Lista de Tarefas

Este README contém as instruções para configurar e executar a aplicação Lista de Tarefas.

## Como Começar

### Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado:

- Node.js (versão LTS recomendada)
- npm (vem com o Node.js)
- Docker e Docker Compose (para executar o PostgreSQL)

### Instalação

1.  **Clone o repositório:**

    ```bash
    git clone <url-do-repositorio>
    cd todo-list
    ```

2.  **Configuração do Backend:**

    ```bash
    cd backend
    npm install
    ```

3.  **Configuração do Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```

### Variáveis de Ambiente

Crie um arquivo `.env` no diretório `backend/` com base no `backend/.env_example`.

Exemplo de `backend/.env`:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=todo_app
JWT_SECRET=sua_chave_secreta_jwt
```

Crie um arquivo `.env` no diretório `frontend/` com base no `frontend/.env_example`.

Exemplo de `frontend/.env`:

```
VITE_API_URL=http://localhost:3000
```

### Configuração do Banco de Dados

1.  **Inicie o PostgreSQL com Docker Compose:**
    Navegue até o diretório `backend/` e execute:

    ```bash
    docker compose up -d
    ```

## Executando a Aplicação

### Backend

No diretório `backend/`:

```bash
npm run dev
```

A API do backend estará disponível em `http://localhost:3000` (ou na porta especificada no .env).

### Frontend

No diretório `frontend/`:

```bash
npm run dev
```

A aplicação frontend estará disponível em `http://localhost:5173`.
