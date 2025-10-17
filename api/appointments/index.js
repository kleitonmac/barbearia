const PORT = process.env.PORT || 3000;
import { connectDB } from "../_db.js";
import Appointment from "../models/Appointment.js";

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
