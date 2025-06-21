import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface ClientConfig {
  clientName?: string;
  logo?: string;
  color?: string;
  review: string;
  sav: string;
  webhook: string;
}

export default function Contact() {
  const router = useRouter();

  if (!router.isReady) return null;

  const clientId = router.query.client as string | undefined;
  const [config, setConfig] = useState<ClientConfig | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) return;
    fetch(`/config/${clientId}.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setConfig)
      .catch(() =>
        setError(
          "Configuration client introuvable. Veuillez vérifier l'URL ou contacter le support."
        )
      );
  }, [clientId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!config) return;

    setSending(true);
    setError(null);

    const form = e.currentTarget;
    const data = {
      client: clientId,
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch(config.webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSent(true);
    } catch (err: any) {
      setError("Échec de l'envoi. Vérifiez votre connexion ou réessayez plus tard.");
    } finally {
      setSending(false);
    }
  }

  if (!clientId)
    return (
      <p className="p-4 text-center">Aucun identifiant client fourni.</p>
    );

  if (error)
    return (
      <p className="p-4 text-center text-red-600">
        {error}
      </p>
    );

  if (!config)
    return (
      <p className="p-4 text-center">Chargement…</p>
    );

  if (sent)
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-6 shadow-md rounded text-center max-w-md">
          <h1 className="text-green-600 text-2xl font-semibold mb-2">
            Merci&nbsp;!
          </h1>
          <p>
            Votre message a bien été transmis à{" "}
            {config.clientName || "notre équipe"}.
          </p>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded p-6 w-full max-w-md space-y-4"
      >
        {config.logo && (
          <img src={config.logo} alt="logo" className="h-10 mx-auto" />
        )}
        <h1 className="text-2xl font-bold text-red-600">
          Une remarque pour {config.clientName || "nous"} ?
        </h1>
        <input
          name="name"
          placeholder="Nom"
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="E-mail"
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="message"
          placeholder="Votre message"
          required
          className="w-full p-2 border rounded h-28"
        />
        <button
          type="submit"
          disabled={sending}
          className="w-full bg-red-600 text-white py-2 rounded disabled:opacity-50"
        >
          {sending ? "Envoi en cours…" : "Envoyer"}
        </button>
      </form>
    </main>
  );
}
