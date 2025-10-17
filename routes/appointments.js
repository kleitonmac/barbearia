import express from "express";
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Configurar Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://baebxoyhhhrpaeocejps.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// List (optionally by ?date=YYYY-MM-DD)
router.get("/", async (req, res) => {
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
    
    res.json(list || []);
  } catch (err) {
    res.status(500).json({ message: "Erro ao listar agendamentos", error: String(err) });
  }
});

// Create
router.post("/", async (req, res) => {
  try {
    const { nome, telefone, servico, data, horario } = req.body || {};
    if (!nome || !telefone || !servico || !data || !horario) {
      return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
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
    
    // Criar agendamento
    const { data: doc, error } = await supabase
      .from('appointments')
      .insert([{ nome, telefone, servico, data, horario }])
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({ message: "Erro ao criar agendamento", error: error.message });
    }
    
    // realtime
    const pusher = req.app.get("pusher");
    if (pusher) {
      pusher.trigger("agendamentos", "created", doc);
    }
    
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar agendamento", error: String(err) });
  }
});

// Optional: Delete
router.delete("/:id", async (req, res) => {
  try {
    const { data: removed, error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: "Agendamento não encontrado" });
      }
      return res.status(500).json({ message: "Erro ao excluir agendamento", error: error.message });
    }
    
    const pusher = req.app.get("pusher");
    if (pusher) pusher.trigger("agendamentos", "deleted", { id: req.params.id });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Erro ao excluir agendamento", error: String(err) });
  }
});

export default router;
