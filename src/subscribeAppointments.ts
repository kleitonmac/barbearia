import Pusher from "pusher-js";

type EventHandler = (evt: { type: "created"|"deleted"; data?: any } | null) => void;

export function subscribeAppointments(cb: EventHandler) {
  const key = import.meta.env.VITE_PUSHER_KEY;
  const cluster = import.meta.env.VITE_PUSHER_CLUSTER || "sa1";
  if (key) {
    const pusher = new Pusher(key, { cluster, forceTLS: true });
    const channel = pusher.subscribe("agendamentos");
    const created = (data: any) => cb({ type: "created", data });
    const deleted = (data: any) => cb({ type: "deleted", data });
    channel.bind("created", created);
    channel.bind("deleted", deleted);
    return () => { channel.unbind("created", created); channel.unbind("deleted", deleted); pusher.unsubscribe("agendamentos"); pusher.disconnect(); };
  }
  // no pusher configured
  return () => {};
}
