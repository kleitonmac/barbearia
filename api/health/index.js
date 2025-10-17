import { connectDB } from "../_db.js";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "barbearia";
  const masked = uri ? uri.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:***@') : null;
  try {
    await connectDB(uri);
    const state = mongoose.connection.readyState; // 1 = connected
    return res.status(200).json({ ok: true, mongo: { connected: state === 1, state, dbName }, uri: masked });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      message: "Falha ao conectar no MongoDB",
      error: String(e?.message || e),
      name: e?.name,
      code: e?.code,
      uri: masked,
      dbName,
    });
  }
}


