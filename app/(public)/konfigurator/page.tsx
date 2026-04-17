import { getChatFlow, getServices } from "@/lib/queries";
import { ChatContainer } from "@/components/konfigurator/chat-container";
import { isSupabaseConfigured } from "@/lib/supabase";

export const metadata = { title: "Anfrage starten" };

export default async function KonfiguratorPage() {
  const steps = await getChatFlow();
  const services = await getServices();
  const isDemo = !isSupabaseConfigured;

  return (
    <main className="min-h-screen bg-warm-50 py-8">
      <div className="text-center mb-8 px-4">
        <h1 className="font-serif text-3xl text-warm-800">Anfrage starten</h1>
        <p className="text-warm-600 mt-2">Erzaehlen Sie uns, was Sie brauchen</p>
        {isDemo && (
          <div
            role="status"
            className="mt-4 inline-flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs md:text-sm px-4 py-2 rounded-lg max-w-xl text-left"
          >
            <span aria-hidden="true">ℹ️</span>
            <span>
              Demo-Modus aktiv. Anfragen werden nicht gespeichert und Foto-Upload ist deaktiviert.
              Fuer die Produktion Supabase und Resend konfigurieren.
            </span>
          </div>
        )}
      </div>
      <ChatContainer steps={steps} services={services} isDemo={isDemo} />
    </main>
  );
}
