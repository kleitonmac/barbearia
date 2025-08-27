import mongoose from "mongoose";

let isConnected = false;

export async function connectDB(uri) {
  if (isConnected) return;
  if (!uri) throw new Error("MONGODB_URI ausente");
  if (mongoose.connection.readyState >= 1) { isConnected = true; return; }
  const dbName = process.env.MONGODB_DB || "barbearia";
  await mongoose.connect(uri, { dbName });
  isConnected = true;
}
