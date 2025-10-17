import express from "express";

const router = express.Router();

// Dados em memória para teste
let appointments = [
  {
    id: 1,
    nome: "João Silva",
    telefone: "27999999999",
    servico: "Corte Masculino",
    data: "2025-01-16",
    horario: "10:00",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    nome: "Maria Santos",
    telefone: "27988888888",
    servico: "Barba",
    data: "2025-01-16",
    horario: "14:00",
    created_at: new Date().toISOString()
  }
];

// List (optionally by ?date=YYYY-MM-DD)
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    let list = appointments;
    
    if (date) {
      list = appointments.filter(apt => apt.data === String(date));
    }
    
    // Ordenar por data e horário
    list.sort((a, b) => {
      if (a.data !== b.data) {
        return a.data.localeCompare(b.data);
      }
      return a.horario.localeCompare(b.horario);
    });
    
    res.json(list);
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
    const existing = appointments.find(apt => apt.data === data && apt.horario === horario);
    if (existing) {
      return res.status(409).json({ message: "Este horário já foi reservado para esta data." });
    }
    
    // Criar novo agendamento
    const newAppointment = {
      id: appointments.length + 1,
      nome,
      telefone,
      servico,
      data,
      horario,
      created_at: new Date().toISOString()
    };
    
    appointments.push(newAppointment);
    
    // realtime
    const pusher = req.app.get("pusher");
    if (pusher) {
      pusher.trigger("agendamentos", "created", newAppointment);
    }
    
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar agendamento", error: String(err) });
  }
});

// Optional: Delete
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = appointments.findIndex(apt => apt.id === id);
    
    if (index === -1) {
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }
    
    appointments.splice(index, 1);
    
    const pusher = req.app.get("pusher");
    if (pusher) pusher.trigger("agendamentos", "deleted", { id });
    
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Erro ao excluir agendamento", error: String(err) });
  }
});

export default router;
