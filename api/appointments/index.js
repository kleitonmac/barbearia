import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://baebxoyhhhrpaeocejps.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function applyCors(req, res) {
  const normalize = (u) => String(u || "").toLowerCase().replace(/\/$/, "");
  const allowed = (process.env.ALLOWED_ORIGINS || "https://barbearia-eta-steel.vercel.app/")
    .split(",")
    .map((s) => normalize(s.trim()))
    .filter(Boolean);
  const originRaw = req.headers?.origin || "";
  const origin = normalize(originRaw);
  const xfProto = (req.headers["x-forwarded-proto"] || "https").toString().split(",")[0].trim();
  const xfHost = (req.headers["x-forwarded-host"] || req.headers["host"] || "").toString().split(",")[0].trim();
  const siteOrigin = normalize(`${xfProto}://${xfHost}`);
  const wildcard = allowed.includes("*");
  const isAllowed = wildcard || (origin && allowed.includes(origin));
  const allowOrigin = origin ? (isAllowed ? originRaw : "null") : (wildcard ? "*" : (allowed[0] || siteOrigin || "*"));
  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
}

export default async function handler(req, res) {
  applyCors(req, res);

  if (req.method === "OPTIONS") {
    // Preflight
    return res.status(204).end();
  }

  // Verificar se Supabase está configurado
  if (!supabaseKey) {
    return res.status(500).json({ message: "Supabase não configurado. Configure SUPABASE_KEY no ambiente." });
  }

  if (req.method === "GET") {
    try {
      const { date } = req.query;
      let query = supabase.from('appointments').select('*');
      
      if (date) {
        query = query.eq('data', String(date));
      }
      
      const { data: list, error } = await query.order('data', { ascending: true }).order('horario', { ascending: true });
      
      if (error) {
        return res.status(500).json({ message: "Erro ao listar agendamentos", error: error.message });
      }
      
      return res.status(200).json(list || []);
    } catch (e) {
      return res.status(500).json({ message: "Erro ao listar agendamentos", error: String(e) });
    }
  }

  if (req.method === "POST") {
    try {
      const { nome, telefone, servico, data, horario } = req.body || {};
      if (!nome || !telefone || !servico || !data || !horario) {
        return res.status(400).json({ message: "Campos obrigatórios faltando" });
      }
      
      // Verificar se já existe agendamento para o mesmo horário e data
      const { data: existing, error: checkError } = await supabase
        .from('appointments')
        .select('id')
        .eq('data', data)
        .eq('horario', horario)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        return res.status(500).json({ message: "Erro ao verificar agendamento existente", error: checkError.message });
      }
      
      if (existing) {
        return res.status(409).json({ message: "Este horário já foi reservado para esta data." });
      }
      
      const { data: created, error } = await supabase
        .from('appointments')
        .insert([{ nome, telefone, servico, data, horario }])
        .select()
        .single();
      
      if (error) {
        return res.status(500).json({ message: "Erro ao criar agendamento", error: error.message });
      }
      
      return res.status(201).json(created);
    } catch (e) {
      return res.status(500).json({ message: "Erro ao criar agendamento", error: String(e) });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ message: "Informe o id" });
      
      const { data: removed, error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: "Agendamento não encontrado" });
        }
        return res.status(500).json({ message: "Erro ao excluir agendamento", error: error.message });
      }
      
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ message: "Erro ao excluir agendamento", error: String(e) });
    }
  }

  res.setHeader("Allow", ["GET","POST","DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
