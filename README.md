# Be The Hero

Aplicação da Semana OmniStack 11. ONGs cadastram casos que precisam de ajuda e recebem um ID de acesso para gerenciá-los.

| | Stack |
|---|---|
| **Backend** | Node.js, Express 5, Knex 3, SQLite (dev) / PostgreSQL (prod), JWT, Zod |
| **Frontend** | React 19, Vite 8, wouter, Axios |
| **Testes** | Vitest, Supertest, Testing Library |

Requer **Node.js 20 ou superior**.

---

## Como rodar

O projeto tem dois pacotes independentes. Cada um precisa das próprias dependências e do próprio `.env`.

### Backend

```bash
cd backend
npm install
cp .env.example .env     # ajuste se necessário
npm run migrate          # cria as tabelas
npm run dev              # http://localhost:3333
```

### Frontend

Em outro terminal, com o backend já rodando:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev              # http://localhost:5173
```

---

## Variáveis de ambiente

### `backend/.env`

| Variável | Padrão | Descrição |
|---|---|---|
| `NODE_ENV` | `development` | `development`, `test` ou `production` |
| `PORT` | `3333` | Porta da API |
| `CORS_ORIGIN` | `http://localhost:5173` | Origem liberada; aceita lista separada por vírgula |
| `JWT_SECRET` | — | Segredo dos tokens. **Obrigatório em produção** — a aplicação não sobe sem ele |
| `JWT_EXPIRES_IN` | `1d` | Validade do token |
| `DATABASE_FILENAME` | `./src/database/db.sqlite` | Arquivo SQLite (dev/test) |
| `DATABASE_URL` | — | String de conexão PostgreSQL (produção) |
| `PAGE_SIZE` | `5` | Casos por página em `GET /incidents` |

Gere um segredo com `openssl rand -hex 32`.

### `frontend/.env`

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3333` | URL base da API |

---

## Testes

```bash
cd backend  && npm test    # 19 casos — rotas, validação, autorização
cd frontend && npm test    # 10 casos — roteamento, guards, fluxo de login
```

Os testes de backend usam SQLite em memória e não tocam no banco de desenvolvimento.

---

## API

Base: `http://localhost:3333`

| Método | Rota | Auth | Descrição |
|---|---|:---:|---|
| `GET` | `/health` | | Verificação de disponibilidade |
| `POST` | `/ongs` | | Cadastra uma ONG e devolve o ID de acesso |
| `GET` | `/ongs` | | Lista as ONGs |
| `POST` | `/session` | | Troca o ID de acesso por um token JWT |
| `GET` | `/incidents` | | Lista casos paginados; total em `X-Total-Count` |
| `POST` | `/incidents` | ✔ | Cadastra um caso |
| `DELETE` | `/incidents/:id` | ✔ | Remove um caso da própria ONG |
| `GET` | `/profile` | ✔ | Lista os casos da ONG autenticada |

Rotas autenticadas exigem `Authorization: Bearer <token>`.

### Exemplo

```bash
# 1. cadastro — devolve { "id": "04eb9e4e" }
curl -X POST http://localhost:3333/ongs \
  -H 'Content-Type: application/json' \
  -d '{"name":"APAD","email":"contato@apad.org","whatsapp":"11999998888","city":"São Paulo","uf":"SP"}'

# 2. login — devolve { "name": "APAD", "token": "eyJ..." }
curl -X POST http://localhost:3333/session \
  -H 'Content-Type: application/json' \
  -d '{"id":"04eb9e4e"}'

# 3. cadastrar um caso
curl -X POST http://localhost:3333/incidents \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer eyJ...' \
  -d '{"title":"Cadelinha atropelada","description":"Precisa de cirurgia","values":120.50}'
```

### Erros

Falhas de validação retornam `422` com o campo e a mensagem de cada problema:

```json
{
  "error": "Dados inválidos na requisição.",
  "details": [
    { "field": "body.email", "message": "E-mail inválido." },
    { "field": "body.uf", "message": "UF deve ter 2 letras." }
  ]
}
```

---

## Build de produção

```bash
cd frontend && npm run build     # gera dist/
cd backend  && npm start
```

Em produção, defina `NODE_ENV=production`, `JWT_SECRET` e `DATABASE_URL` (PostgreSQL) e rode `npm run migrate` antes de subir a API.

---

## Estrutura

```
backend/
  src/
    app.js              Aplicação Express (sem listen — usada nos testes)
    server.js           Entrypoint
    config/env.js       Configuração centralizada
    controllers/        Handlers das rotas
    middlewares/        auth (JWT), validate (Zod), errorHandler
    schemas/            Schemas Zod de validação
    database/           Conexão e migrations
  tests/

frontend/
  src/
    routes.jsx          Rotas e guard de autenticação
    pages/              Logon, Register, Profile, NewIncident
    services/           api (Axios + interceptors), auth (sessão)
  tests/
```

---

## Licença

[MIT](LICENSE)
