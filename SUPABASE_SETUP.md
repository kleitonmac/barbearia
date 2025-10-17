# Configuração do Supabase

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta ou faça login
3. Clique em "New Project"
4. Preencha os dados do projeto:
   - **Name**: barbearia
   - **Database Password**: (escolha uma senha forte)
   - **Region**: escolha a região mais próxima (ex: South America)

## 2. Configurar a Tabela

1. No painel do Supabase, vá em **SQL Editor**
2. Execute o script do arquivo `supabase-setup.sql`
3. Isso criará a tabela `appointments` com todas as configurações necessárias

## 3. Obter as Chaves de API

1. No painel do Supabase, vá em **Settings** > **API**
2. Copie as seguintes informações:
   - **Project URL** (ex: `https://baebxoyhhhrpaeocejps.supabase.co`)
   - **anon public** key (chave pública)

## 4. Configurar Variáveis de Ambiente

### Para Desenvolvimento Local:
Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua_chave_anon_aqui

# Frontend (Vite)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_KEY=sua_chave_anon_aqui

# Pusher (opcional)
VITE_PUSHER_KEY=sua_chave_pusher
PUSHER_APP_ID=seu_app_id
PUSHER_KEY=sua_chave_pusher
PUSHER_SECRET=seu_secret_pusher
PUSHER_CLUSTER=sa1

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

### Para Deploy (Vercel):
Configure as variáveis no painel do Vercel:
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_KEY`

## 5. Estrutura da Tabela

A tabela `appointments` terá a seguinte estrutura:

```sql
CREATE TABLE appointments (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  servico TEXT NOT NULL,
  data DATE NOT NULL,
  horario TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 6. Políticas de Segurança

O script configura automaticamente:
- ✅ Leitura pública (para listar agendamentos)
- ✅ Inserção pública (para criar agendamentos)
- ✅ Exclusão pública (para cancelar agendamentos)
- ✅ Índice único para evitar agendamentos duplicados
- ✅ Row Level Security (RLS) habilitado

## 7. Teste da Configuração

1. Execute o projeto:
   ```bash
   npm run dev
   ```

2. Acesse `http://localhost:5174`

3. Teste criando um agendamento

4. Verifique no painel do Supabase se o registro foi criado na tabela `appointments`

## 8. Troubleshooting

**Erro**: "Supabase não configurado"
- Verifique se as variáveis `SUPABASE_URL` e `SUPABASE_KEY` estão definidas

**Erro**: "relation 'appointments' does not exist"
- Execute o script `supabase-setup.sql` no SQL Editor do Supabase

**Erro**: "permission denied"
- Verifique se as políticas RLS estão configuradas corretamente

**Erro**: "duplicate key value violates unique constraint"
- Isso é normal! Significa que o horário já está ocupado para aquela data
