import { getChatFlow, getServices } from "@/lib/queries";
import { ChatContainer } from "@/components/konfigurator/chat-container";

export const metadata = { title: "Anfrage starten" };

export default async function KonfiguratorPage() {
  const steps = await getChatFlow();
  const services = await getServices();

  return (
    <main className="min-h-screen bg-warm-50 py-8">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl text-warm-800">Anfrage starten</h1>
        <p className="text-warm-600 mt-2">Erzählen Sie uns, was Sie brauchen</p>
      </div>
      <ChatContainer steps={steps} services={services} />
    </main>
  );
}
