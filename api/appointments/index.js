import { connectDB } from "../_db.js";
import Appointment from "../models/Appointment.js";

export default async function handler(req, res) {
  try {
    await connectDB(process.env.MONGODB_URI);
  } catch (e) {
    return res.status(500).json({ message: "Erro ao conectar no MongoDB", error: String(e) });
  }

  if (req.method === "GET") {
    try {
      const { date } = req.query;
      const q = date ? { data: String(date) } : {};
      const list = await Appointment.find(q).sort({ data: 1, horario: 1 }).lean();
      return res.status(200).json(list);
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
      const created = await Appointment.create({ nome, telefone, servico, data, horario });
      return res.status(201).json(created);
    } catch (e) {
      if (String(e).includes("duplicate key")) {
        return res.status(409).json({ message: "Este horário já foi reservado para esta data." });
      }
      return res.status(500).json({ message: "Erro ao criar agendamento", error: String(e) });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ message: "Informe o id" });
      const removed = await Appointment.findByIdAndDelete(id);
      if (!removed) return res.status(404).json({ message: "Agendamento não encontrado" });
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ message: "Erro ao excluir agendamento", error: String(e) });
    }
  }

  res.setHeader("Allow", ["GET","POST","DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
