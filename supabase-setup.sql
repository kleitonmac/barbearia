-- Script para configurar a tabela de agendamentos no Supabase
-- Execute este script no SQL Editor do Supabase

-- Criar tabela de agendamentos
CREATE TABLE IF NOT EXISTS appointments (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  servico TEXT NOT NULL,
  data DATE NOT NULL,
  horario TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para melhor performance nas consultas por data
CREATE INDEX IF NOT EXISTS idx_appointments_data ON appointments(data);

-- Criar índice único para evitar agendamentos duplicados no mesmo horário
CREATE UNIQUE INDEX IF NOT EXISTS idx_appointments_data_horario ON appointments(data, horario);

-- Habilitar Row Level Security (RLS)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública (para listar agendamentos)
CREATE POLICY "Permitir leitura pública" ON appointments
  FOR SELECT USING (true);

-- Política para permitir inserção pública (para criar agendamentos)
CREATE POLICY "Permitir inserção pública" ON appointments
  FOR INSERT WITH CHECK (true);

-- Política para permitir exclusão pública (para cancelar agendamentos)
CREATE POLICY "Permitir exclusão pública" ON appointments
  FOR DELETE USING (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
