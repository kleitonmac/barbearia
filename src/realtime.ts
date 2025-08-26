import Pusher from "pusher-js";

export function subscribeAppointments(
  onCreate: (data: any) => void,
  onDelete?: (data: any) => void
) {
  const key = import.meta.env.VITE_PUSHER_KEY!;
  const cluster = import.meta.env.VITE_PUSHER_CLUSTER || "sa1";

  // 🔹 Instância única do Pusher
  const pusher = new Pusher(key, { cluster });

  // 🔹 Canal onde o backend envia eventos
  const channel = pusher.subscribe("agendamentos");

  // 🔹 Bind nos eventos criados no backend
  channel.bind("created", onCreate);
  if (onDelete) channel.bind("deleted", onDelete);

  // 🔹 Cleanup (quando desmontar o componente React, por ex.)
  return () => {
    channel.unbind_all();
    channel.unsubscribe();
    pusher.disconnect();
  };
}
