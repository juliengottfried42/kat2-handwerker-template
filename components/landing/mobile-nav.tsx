"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface MobileNavProps {
  companyName: string;
  phone: string;
}

const LINKS = [
  { href: "#leistungen", label: "Leistungen" },
  { href: "#galerie", label: "Arbeiten" },
  { href: "#bewertungen", label: "Bewertungen" },
  { href: "#ueber", label: "Ueber uns" },
  { href: "#kontakt", label: "Kontakt" },
];

export function MobileNav({ phone }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label="Menue oeffnen"
        className="md:hidden inline-flex items-center justify-center min-w-[48px] min-h-[48px] rounded-lg text-warm-700 hover:bg-warm-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>

      {open && (
        <div
          className="md:hidden fixed inset-0 z-[90] bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-label="Hauptmenue"
          onClick={() => setOpen(false)}
        >
          <div
            id="mobile-nav-panel"
            className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col pb-[env(safe-area-inset-bottom)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-warm-200">
              <span className="font-serif text-lg text-warm-800">Menue</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Menue schliessen"
                className="inline-flex items-center justify-center min-w-[48px] min-h-[48px] rounded-lg text-warm-700 hover:bg-warm-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto">
              <ul className="flex flex-col py-2">
                {LINKS.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block px-5 py-4 min-h-[52px] text-base font-medium text-warm-800 border-b border-warm-100 hover:bg-warm-50 active:bg-warm-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-600"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="border-t border-warm-200 p-4 space-y-3">
              <a
                href={`tel:${phone.replace(/[^+0-9]/g, "")}`}
                className="flex items-center justify-center gap-2 w-full min-h-[52px] bg-warm-100 text-warm-800 rounded-xl font-semibold text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                aria-label={`Anrufen: ${phone}`}
              >
                <span aria-hidden="true">📞</span> {phone}
              </a>
              <Link
                href="/konfigurator"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-full min-h-[52px] bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-600"
              >
                Kostenlose Anfrage starten
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
