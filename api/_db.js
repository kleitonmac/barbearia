import mongoose from "mongoose";

let isConnected = false;

export async function connectDB(uri) {
  if (isConnected) return;
  if (!uri) throw new Error("MONGODB_URI ausente");
  if (mongoose.connection.readyState >= 1) { isConnected = true; return; }
  await mongoose.connect(uri);
  isConnected = true;
}
