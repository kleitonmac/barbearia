# Barbearia – Backend + Frontend (Vite + Vercel API)

- Porta do front local: **5173**
- API local: **http://localhost:3000**
- Produção (Vercel): use as functions em `/api` (não precisa rodar `server.js` na Vercel).

## Rodar local
1. `cp .env.example .env` e preencha `MONGODB_URI` (seu cluster público) e, opcionalmente, variáveis do Pusher.
2. `npm install`
3. Em um terminal: `npm run dev:server`
4. Em outro terminal: `npm run dev:client` (abre em `http://localhost:5173`).

> Também pode usar `npm run dev` se preferir abrir dois processos em paralelo (precisa do `npm-run-all`).

## Deploy na Vercel
- Faça upload do projeto e configure as variáveis de ambiente no painel da Vercel:
  - `MONGODB_URI`
  - (opcional) `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `PUSHER_CLUSTER`
- A Vercel irá:
  - Criar as serverless functions de `api/**` para a API.
  - Fazer o build do Vite para `/dist` e servir como estático.
- O frontend usa `/api/appointments` (mesmo host) por padrão, então não precisa mudar nada.

## Expiração de agendamentos
- Cada documento tem `expiresAt` com TTL de **24h** no MongoDB. O banco apaga automaticamente após 24h.
- O frontend troca de dia automaticamente e atualiza a lista.

## Rotas
- `GET /api/appointments?date=YYYY-MM-DD`
- `POST /api/appointments` – body: `{ nome, telefone, servico, data, horario }`
- `DELETE /api/appointments/:id`

