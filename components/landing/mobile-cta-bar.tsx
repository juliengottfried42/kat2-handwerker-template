import Link from "next/link";

interface MobileCTABarProps {
  phone: string;
  whatsapp?: string;
}

export function MobileCTABar({ phone, whatsapp }: MobileCTABarProps) {
  const telHref = `tel:${phone.replace(/[^+0-9]/g, "")}`;
  const waHref = whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}` : null;

  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-warm-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)]"
      role="region"
      aria-label="Schneller Kontakt"
    >
      <div className="grid grid-cols-3 gap-0">
        <a
          href={telHref}
          className="flex flex-col items-center justify-center gap-1 py-3 min-h-[60px] text-green-700 hover:bg-warm-50 active:bg-warm-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-600"
          aria-label={`Jetzt anrufen: ${phone}`}
        >
          <span className="text-xl leading-none" aria-hidden="true">📞</span>
          <span className="text-xs font-semibold">Anrufen</span>
        </a>
        {waHref ? (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 py-3 min-h-[60px] text-[#128c7e] hover:bg-warm-50 active:bg-warm-100 transition-colors border-x border-warm-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-600"
            aria-label="WhatsApp Nachricht senden"
          >
            <span className="text-xl leading-none" aria-hidden="true">💬</span>
            <span className="text-xs font-semibold">WhatsApp</span>
          </a>
        ) : (
          <a
            href={`mailto:${phone}`}
            className="flex flex-col items-center justify-center gap-1 py-3 min-h-[60px] text-warm-700 hover:bg-warm-50 transition-colors border-x border-warm-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-600"
          >
            <span className="text-xl leading-none" aria-hidden="true">✉️</span>
            <span className="text-xs font-semibold">E-Mail</span>
          </a>
        )}
        <Link
          href="/konfigurator"
          className="flex flex-col items-center justify-center gap-1 py-3 min-h-[60px] bg-green-600 hover:bg-green-700 active:bg-green-700 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
          aria-label="Kostenlose Anfrage starten"
        >
          <span className="text-xl leading-none" aria-hidden="true">✓</span>
          <span className="text-xs font-semibold">Anfragen</span>
        </Link>
      </div>
    </div>
  );
}
