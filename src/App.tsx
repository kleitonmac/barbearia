import React, { useState } from "react";
import {
  Scissors,
  Clock,
  MapPin,
  Phone,
  Instagram,
  Facebook,
  MessageCircle,
} from "lucide-react";

function App() {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    servico: "Corte Clássico",
    data: "",
    horario: "",
  });

  const [agendamentos, setAgendamentos] = useState<
    { nome: string; telefone: string; servico: string; data: string; horario: string }[]
  >([]);

  // Tabela de horários fixos (09h → 19h)
  const horariosDisponiveis = Array.from({ length: 11 }, (_, i) => {
    const hora = 9 + i;
    return `${hora.toString().padStart(2, "0")}:00`;
  });

  const formatarData = (data: string) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica se horário já está ocupado
    const conflito = agendamentos.find(
      (a) => a.data === formData.data && a.horario === formData.horario
    );
    if (conflito) {
      alert(`Esse horário já está ocupado por ${conflito.nome}`);
      return;
    }

    // Adiciona novo agendamento
    setAgendamentos([...agendamentos, formData]);

    // Mensagem única para a barbearia
    const mensagem = encodeURIComponent(
      `*Novo Agendamento*\n\n` +
        `👤 *Nome:* ${formData.nome}\n` +
        `📞 *Telefone:* ${formData.telefone}\n` +
        `✂️ *Serviço:* ${formData.servico}\n` +
        `📅 *Data:* ${formatarData(formData.data)}\n` +
        `⏰ *Horário:* ${formData.horario}\n\n` +
        `📌 O cliente já recebeu a confirmação automática no site.`
    );

    // Número da barbearia
    const numeroBarbearia = "5511961728584";

    // Abre o WhatsApp com a mensagem completa
    window.open(`https://wa.me/${numeroBarbearia}?text=${mensagem}`, "_blank");

    // Limpa formulário
    setFormData({
      nome: "",
      telefone: "",
      servico: "Corte Clássico",
      data: "",
      horario: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <header className="relative h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <nav className="relative z-10 container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Scissors className="h-8 w-8 text-amber-500" />
              <span className="text-2xl font-bold">PRIME</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="hover:text-amber-500 transition">
                Início
              </a>
              <a href="#services" className="hover:text-amber-500 transition">
                Serviços
              </a>
              <a href="#contact" className="hover:text-amber-500 transition">
                Contato
              </a>
            </div>
          </div>
        </nav>

        <div className="relative z-10 container mx-auto px-6 h-[calc(100vh-88px)] flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-6xl font-bold mb-6">
              Mais que aparência. É atitude Prime
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Seu estilo merece o toque Prime: tradição, precisão e sofisticação em uma barbearia clássica com experiência premium — mais que um corte, uma experiência Prime.
            </p>
            <a
              href="#booking"
              className="bg-amber-500 text-black px-8 py-4 rounded-md font-semibold hover:bg-amber-600 transition"
            >
              Agende seu Horário
            </a>
          </div>
        </div>
      </header>


       {/* Services Section */}
      <section id="services" className="py-20 bg-zinc-900">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">Nossos Serviços Premium</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Corte Clássico',
                price: 'R$ 60',
                description: 'Corte preciso adaptado ao seu estilo',
                duration: '45 min'
              },
              {
                title: 'Barba',
                price: 'R$ 40',
                description: 'Modelagem e acabamento profissional',
                duration: '30 min'
              },
              {
                title: 'Nevou',
                price: 'R$ 70',
                description: 'O corte Nevou é a escolha ideal para quem busca atitude e personalidade. Com fios descoloridos em tons platinados ou brancos. ',
                duration: '30 min'
              },
              {
                title: 'Corte e Pigmentação',
                price: 'R$ 50',
                description: 'Corte com retoque de cor para realçar o visual',
                duration: '30 min'
              },
              {
                title: 'Pacote Completo',
                price: 'R$ 90',
                description: 'Corte, barba e tratamento com toalha quente',
                duration: '75 min'
              }
            ].map((service, index) => (
              <div
                key={index}
                className="bg-zinc-800 p-8 rounded-lg hover:transform hover:-translate-y-2 transition duration-300"
              >
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-3xl font-bold text-amber-500 mb-4">{service.price}</p>
                <p className="text-gray-400 mb-4">{service.description}</p>
                <div className="flex items-center text-gray-400">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{service.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">
            Agende seu Horário
          </h2>
          <div className="max-w-md mx-auto bg-zinc-900 p-8 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2">Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Seu nome"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Telefone</label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="DDD + Número (apenas números)"
                  pattern="[0-9]{10,11}"
                  title="Digite seu DDD + número (apenas números)"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Serviço</label>
                <select
                  name="servico"
                  value={formData.servico}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                >
                  <option>Corte Clássico</option>
                  <option>Nevou</option>
                  <option>Corte Pigmentação</option>
                  <option>Barba</option>
                  <option>Pacote Completo</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Data</label>
                <input
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Horário</label>
                <select
                  name="horario"
                  value={formData.horario}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                >
                  <option value="">Selecione um horário</option>
                  {horariosDisponiveis.map((h, i) => (
                    <option key={i} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-amber-500 text-black py-3 rounded-md font-semibold hover:bg-amber-600 transition"
              >
                Confirmar Agendamento
              </button>
            </form>
          </div>

          {/* Lista de horários ocupados */}
          <div className="max-w-md mx-auto mt-8 bg-zinc-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Horários Ocupados</h3>
            {agendamentos.length === 0 ? (
              <p className="text-gray-400">Nenhum agendamento ainda.</p>
            ) : (
              <ul className="space-y-2">
                {agendamentos.map((a, i) => (
                  <li key={i} className="bg-zinc-900 p-3 rounded-md text-sm">
                    <span className="font-bold">{a.nome}</span> - {a.servico}{" "}
                    <br />
                    📅 {formatarData(a.data)} ⏰ {a.horario}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
     <section id="contact" className="py-20 bg-zinc-900">
  <div className="container mx-auto px-6">
    <h2 className="text-4xl font-bold mb-16 text-center">Entre em Contato</h2>
    <div className="grid md:grid-cols-3 gap-8">
      <div className="text-center">
        <MapPin className="h-8 w-8 mx-auto mb-4 text-amber-500" />
        <h3 className="text-xl font-bold mb-2">Localização</h3>
        <p className="text-gray-400">
          R. Cecília Meireles, 55
          <br />
          Serra, ES
        </p>
      </div>
      <div className="text-center">
        <Phone className="h-8 w-8 mx-auto mb-4 text-amber-500" />
        <h3 className="text-xl font-bold mb-2">Telefone</h3>
        <p className="text-gray-400">(11) 96172-8584</p>
      </div>
      <div className="text-center">
        <Clock className="h-8 w-8 mx-auto mb-4 text-amber-500" />
        <h3 className="text-xl font-bold mb-2">Horário</h3>
        <p className="text-gray-400">
          Seg-Sáb: 9h - 19h
          <br />
          Dom: Fechado
        </p>
      </div>

      {/* Redes sociais centralizadas abaixo */}
      <div className="flex justify-center items-center space-x-6 mt-8 md:col-span-3">
        <a href="https://www.instagram.com/iamkleiton/" className="text-gray-400 hover:text-amber-500" target="_blank" rel="noopener noreferrer">
          <Instagram className="h-6 w-6" />
        </a>
        <a href="https://www.facebook.com/kleiton.santosmacedo" className="text-gray-400 hover:text-amber-500" target="_blank" rel="noopener noreferrer">
          <Facebook className="h-6 w-6" />
        </a>
      </div>
    </div>
  </div>
</section>

      {/* Footer + WhatsApp Button */}
      <footer className="bg-black py-8">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Scissors className="h-6 w-6 text-amber-500" />
              <span className="font-bold">Prime Barbershop</span>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            <p>&copy; 2025 Prime Barbershop. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/5511961728584"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition"
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}



export default App;
