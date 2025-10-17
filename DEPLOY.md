# Guia de Deploy - Barbearia

## Configuração para Deploy

### 1. Variáveis de Ambiente Necessárias

Configure as seguintes variáveis de ambiente no seu provedor de deploy (Vercel, Netlify, etc.):

#### Backend (API)
- `SUPABASE_URL`: URL do seu projeto Supabase
- `SUPABASE_KEY`: Chave anônima do Supabase
- `PUSHER_APP_ID`: ID da aplicação Pusher (opcional)
- `PUSHER_KEY`: Chave do Pusher (opcional)
- `PUSHER_SECRET`: Segredo do Pusher (opcional)
- `PUSHER_CLUSTER`: Cluster do Pusher (opcional, padrão: "sa1")
- `ALLOWED_ORIGINS`: URLs permitidas para CORS (separadas por vírgula)

#### Frontend (Vite)
- `VITE_SUPABASE_URL`: URL do Supabase para o frontend
- `VITE_SUPABASE_KEY`: Chave anônima do Supabase para o frontend
- `VITE_PUSHER_KEY`: Chave do Pusher para o frontend (opcional)

### 2. Deploy no Vercel

1. **Conecte seu repositório ao Vercel**
2. **Configure as variáveis de ambiente** no painel do Vercel:
   - Vá em Settings > Environment Variables
   - Adicione todas as variáveis listadas acima

3. **Deploy automático**
   - O Vercel detectará automaticamente que é um projeto Vite
   - O build será executado com `npm run build`
   - As rotas da API serão servidas automaticamente

### 3. Configuração do Supabase

1. Crie um projeto no Supabase
2. Vá em Settings > API
3. Copie a URL e a chave anônima
4. Configure as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_KEY`

### 5. Configuração do Pusher (Opcional)

1. Crie uma conta no Pusher
2. Crie uma nova aplicação
3. Configure as credenciais nas variáveis de ambiente
4. Isso habilitará atualizações em tempo real

### 6. Teste Local

Para testar localmente:

1. Copie `env.example` para `.env`
2. Configure as variáveis no arquivo `.env`
3. Execute:
   ```bash
   npm install
   npm run dev
   ```

### 7. Estrutura de Arquivos

```
├── api/                    # API routes (Vercel Functions)
│   ├── appointments/
│   └── models/
├── src/                    # Frontend React
├── server.js              # Servidor Express (desenvolvimento)
├── vercel.json            # Configuração do Vercel
└── env.example            # Exemplo de variáveis de ambiente
```

### 8. Comandos Disponíveis

- `npm run dev`: Desenvolvimento (frontend + backend)
- `npm run build`: Build para produção
- `npm run start`: Executa o servidor Express
- `npm run preview`: Preview do build

### 9. Troubleshooting

**Problema**: CORS errors
**Solução**: Configure `ALLOWED_ORIGINS` com a URL do seu domínio

**Problema**: Supabase connection failed
**Solução**: Verifique se as chaves do Supabase estão corretas

**Problema**: Build fails
**Solução**: Verifique se todas as variáveis `VITE_*` estão configuradas

