import express from "express";
import Appointment from "../models/Appointment.js";

const router = express.Router();

// List (optionally by ?date=YYYY-MM-DD)
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    const query = date ? { data: String(date) } : {};
    const list = await Appointment.find(query).sort({ data: 1, horario: 1 }).lean();
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
    // create
    const doc = await Appointment.create({ nome, telefone, servico, data, horario });
    // realtime
    const pusher = req.app.get("pusher");
    if (pusher) {
      pusher.trigger("agendamentos", "created", doc.toObject());
    }
    res.status(201).json(doc);
  } catch (err) {
    // Duplicate slot
    if (String(err).includes("duplicate key")) {
      return res.status(409).json({ message: "Este horário já foi reservado para esta data." });
    }
    res.status(500).json({ message: "Erro ao criar agendamento", error: String(err) });
  }
});

// Optional: Delete
router.delete("/:id", async (req, res) => {
  try {
    const removed = await Appointment.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Agendamento não encontrado" });
    const pusher = req.app.get("pusher");
    if (pusher) pusher.trigger("agendamentos", "deleted", { _id: req.params.id });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Erro ao excluir agendamento", error: String(err) });
  }
});

export default router;
