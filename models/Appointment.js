import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  telefone: { type: String, required: true, trim: true },
  servico: { type: String, required: true, trim: true },
  data: { type: String, required: true },     // YYYY-MM-DD
  horario: { type: String, required: true },  // HH:mm
  expiresAt: { type: Date, default: () => new Date(Date.now() + 24*60*60*1000), index: { expires: '0s' } }
}, { timestamps: true, collection: 'prime' });

// Unique index to avoid duplicates for the same slot
AppointmentSchema.index({ data: 1, horario: 1 }, { unique: true });

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);
