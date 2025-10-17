import React, { useEffect, useMemo, useState } from "react";
import { Scissors, Clock, MapPin, Phone, Instagram, MessageCircle } from "lucide-react";
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://baebxoyhhhrpaeocejps.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const WPP_NUMBER = "5511961728584";
const INSTA = "https://instagram.com/iamkleiton";

function todayISO() {
  const d = new Date();
  const tzOffset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - tzOffset * 60000);
  return local.toISOString().slice(0, 10);
}

const SERVICOS = [
  { title: "Corte Masculino", price: "R$ 40", desc: "Corte clássico com acabamento preciso", dur: "45 min" },
  { title: "Barba", price: "R$ 30", desc: "Modelagem e toalha quente", dur: "30 min" },
  { title: "Corte + Barba", price: "R$ 60", desc: "Combo completo com finalização", dur: "60 min" },
  { title: "Sobrancelha", price: "R$ 20", desc: "Limpeza e alinhamento natural", dur: "15 min" },
  { title: "Degradê", price: "R$ 45", desc: "Fade moderno sob medida", dur: "45 min" },
  { title: "Pacote Premium", price: "R$ 80", desc: "Corte + Barba + Sobrancelha", dur: "75 min" },
];

function gerarHorarios() {
  const arr: string[] = [];
  for (let h = 9; h <= 19; h++) {
    arr.push(`${String(h).padStart(2, "0")}:00`);
  }
  return arr;
}

export default function App() {
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    servico: "Corte Masculino",
    data: todayISO(),
    horario: "",
  });
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const horarios = useMemo(() => gerarHorarios(), []);
  const date = form.data;

  // 🔄 Carregar agendamentos do dia (usa backend Express em /api/appointments)
  async function load() {
    setLoading(true);
    try {
      const targetDate = date || todayISO();
      const res = await fetch(`/api/appointments?date=${encodeURIComponent(targetDate)}`, {
        headers: { Accept: "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        console.error("Erro ao buscar agendamentos", res.status);
        setItems([]);
      } else {
        const data = await res.json();
        const normalized = (data || []).map((d: any) => ({ ...d, id: d._id || d.id }));
        setItems(normalized);
      }
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [date]);

  // 🔁 Atualização em tempo real / polling fallback
  useEffect(() => {
    let stopRealtime: (() => void) | null = null;
    const key = import.meta.env.VITE_PUSHER_KEY;
    if (key) {
      import("./realtime")
        .then((mod) => {
          if (mod && typeof mod.subscribeAppointments === "function") {
            stopRealtime = mod.subscribeAppointments(() => load(), undefined);
          }
        })
        .catch((e) => console.warn("Realtime não disponível:", e));
    }

    const poll = setInterval(() => load(), 7000);
    return () => {
      if (stopRealtime) stopRealtime();
      clearInterval(poll);
    };
  }, []);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // 💾 Criar agendamento via backend Express
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.nome || !form.telefone || !form.horario) {
      setError("Preencha todos os campos!");
      return;
    }

    try {
      const res = await fetch(`/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (res.status === 409) {
        setError("Este horário já foi reservado para esta data.");
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.message || "Erro ao criar agendamento.");
        return;
      }

      alert("Agendamento criado com sucesso!");
      setForm({ nome: "", telefone: "", servico: "Corte Masculino", data: todayISO(), horario: "" });
      load();
    } catch (err) {
      console.error(err);
      setError("Erro ao criar agendamento.");
    }
  }

  const endereco = "Rua Uberlândia, S/N – Serra, ES";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed z-50 top-0 left-0 right-0 backdrop-blur bg-black/40">
        <div className="container px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors className="h-7 w-7 text-amber-500" />
            <span className="text-xl font-bold tracking-wide">Prime Barbearia</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="nav-link">Início</a>
            <a href="#services" className="nav-link">Serviços</a>
            <a href="#about" className="nav-link">Sobre</a>
            <a href="#booking" className="nav-link">Agendamento</a>
            <a href="#contact" className="nav-link">Contato</a>
          </div>
          <a href={`https://wa.me/${WPP_NUMBER}`} target="_blank" className="btn-gold px-4 py-2">WhatsApp</a>
        </div>
      </nav>

      {/* Hero */}
      <header id="home" className="relative h-[92vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1512690459411-b9245cef1f61?q=80&w=1600&auto=format&fit=crop")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black" />
        </div>
        <div className="container px-6 h-full flex items-center">
          <div className="max-w-2xl mt-24">
            <h1 className="h1 text-5xl md:text-6xl font-extrabold mb-5">Seu estilo, nossa tradição</h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Elegância moderna, atendimento de primeira e acabamentos impecáveis.
            </p>
            <a href="#booking" className="btn-gold px-8 py-4 inline-block hover:bg-black hover:text-amber-500 ring-1 ring-amber-500 transition">
              Agende agora
            </a>
          </div>
        </div>
      </header>

      {/* Serviços */}
      <section id="services" className="py-20 bg-zinc-950">
        <div className="container px-6">
          <h2 className="h1 text-4xl font-bold mb-12 text-center">Nossos Serviços</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {SERVICOS.map((s) => (
              <div key={s.title} className="card">
                <div className="card-inner">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-semibold">{s.title}</h3>
                    <span className="text-amber-400 text-xl font-bold">{s.price}</span>
                  </div>
                  <p className="text-gray-300 mb-4">{s.desc}</p>
                  <div className="flex items-center text-gray-400">
                    <Clock className="w-5 h-5 mr-2" /> {s.dur}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agendamento */}
      <section id="booking" className="py-20 bg-black">
        <div className="container px-6">
          <h2 className="h1 text-4xl font-bold mb-8 text-center">Agende seu horário</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulário */}
            <div className="card">
              <div className="card-inner">
                <form onSubmit={onSubmit} className="grid gap-4">
                  <input name="nome" value={form.nome} onChange={onChange} placeholder="Seu nome" className="bg-zinc-800 rounded-xl p-3 outline-none" required />
                  <input name="telefone" value={form.telefone} onChange={onChange} placeholder="Telefone (somente números)" className="bg-zinc-800 rounded-xl p-3 outline-none" required />
                  <select name="servico" value={form.servico} onChange={onChange} className="bg-zinc-800 rounded-xl p-3 outline-none">
                    {SERVICOS.map(s => <option key={s.title}>{s.title}</option>)}
                  </select>
                  <input type="date" name="data" value={form.data} onChange={onChange} className="bg-zinc-800 rounded-xl p-3 outline-none" required />

                  <div>
                    <p className="text-sm text-neutral-300 mb-2">Horário</p>
                    <div className="flex flex-wrap gap-2">
                      {horarios.map(h => {
                        const ocupado = items.some(a => a.horario === h);
                        const active = form.horario === h;
                        return (
                          <button
                            type="button"
                            key={h}
                            disabled={ocupado}
                            onClick={() => setForm({ ...form, horario: h })}
                            className={[
                              "px-3 py-2 rounded-lg text-sm transition-all",
                              ocupado ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" :
                              active ? "bg-amber-500 text-black" :
                              "bg-zinc-800 hover:bg-zinc-700"
                            ].join(" ")}
                          >
                            {h}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {error && <div className="text-red-400 text-sm">{error}</div>}
                  <button className="btn-gold px-4 py-3 hover:bg-black hover:text-amber-500 ring-1 ring-amber-500">
                    Confirmar Agendamento
                  </button>
                </form>
              </div>
            </div>

            {/* Lista */}
            <div className="card">
              <div className="card-inner">
                <h3 className="text-xl font-semibold mb-4">Agendamentos de {date}</h3>
                {loading ? (
                  <p>Carregando…</p>
                ) : (
                  <ul className="space-y-3">
                    {items.length === 0 && <li className="text-neutral-400">Sem agendamentos.</li>}
                    {items.map((a) => (
                      <li key={a.id} className="bg-zinc-800 rounded-xl p-3">
                        <div className="font-medium">{a.nome} • {a.servico}</div>
                        <div className="text-sm text-neutral-400">{a.horario} – {a.telefone}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contact" className="py-16 bg-zinc-900">
        <div className="container px-6 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <MapPin className="h-7 w-7 mx-auto mb-3 text-amber-500" />
            <h3 className="text-lg font-semibold mb-1">Endereço</h3>
            <p className="text-gray-300">{endereco}</p>
          </div>
          <div>
            <Phone className="h-7 w-7 mx-auto mb-3 text-amber-500" />
            <h3 className="text-lg font-semibold mb-1">Telefone</h3>
            <a href={`https://wa.me/${WPP_NUMBER}`} target="_blank" className="text-gray-300 hover:text-amber-400">(11) 96172-8584</a>
          </div>
          <div>
            <Instagram className="h-7 w-7 mx-auto mb-3 text-amber-500" />
            <h3 className="text-lg font-semibold mb-1">Instagram</h3>
            <a href={INSTA} target="_blank" className="text-gray-300 hover:text-amber-400">@iamkleiton</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8 text-center">
        <div className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Prime Barbearia. Todos os direitos reservados.
        </div>
      </footer>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/${WPP_NUMBER}`}
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition"
        target="_blank"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
