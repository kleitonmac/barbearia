import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Pusher from "pusher";

import appointmentsRouter from "./routes/appointments.js";

dotenv.config();

const app = express();

// CORS
const allowed = (process.env.ALLOWED_ORIGINS || "*").split(",").map(s => s.trim());
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowed.includes("*") || allowed.includes(origin)) return cb(null, true);
    cb(new Error("CORS bloqueado para: " + origin));
  },
  credentials: true,
}));

app.use(express.json());

// Mongo
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.warn("⚠️ MONGODB_URI não definido. Configure no .env para conectar ao banco.");
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log("✅ Conectado ao MongoDB"))
    .catch(err => console.error("❌ Erro ao conectar no MongoDB:", err));
}

// Pusher (opcional)
let pusher = null;
if (process.env.PUSHER_APP_ID && process.env.PUSHER_KEY && process.env.PUSHER_SECRET) {
  pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER || "sa1",
    useTLS: true,
  });
  console.log("✅ Pusher configurado");
} else {
  console.log("ℹ️ Pusher não configurado. O realtime funcionará via 'polling'.");
}
app.set("pusher", pusher);

// Health
app.get("/", (req, res) => res.json({ ok: true, service: "realtime-booking-backend" }));

// Routes
app.use("/api/appointments", appointmentsRouter);

// Start (local dev)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API rodando na porta ${PORT}`));
