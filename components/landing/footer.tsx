import Link from "next/link";

interface FooterProps {
  companyName: string;
  phone?: string;
  email?: string;
  address?: string;
}

export function Footer({ companyName, phone, email, address }: FooterProps) {
  const year = new Date().getFullYear();
  const telHref = phone ? `tel:${phone.replace(/[^+0-9]/g, "")}` : null;
  const mailHref = email ? `mailto:${email}` : null;

  return (
    <footer className="bg-warm-900 text-warm-300 py-10 md:py-12 px-5 md:px-12" role="contentinfo">
      <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
        <div>
          <p className="font-serif text-lg text-warm-100 mb-2">{companyName}</p>
          {address && <p className="text-sm leading-relaxed text-warm-400">{address}</p>}
        </div>
        <div className="space-y-2 text-sm">
          {telHref && (
            <p>
              <a href={telHref} className="hover:text-warm-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-300 focus-visible:rounded-sm">
                <span aria-hidden="true">📞</span> {phone}
              </a>
            </p>
          )}
          {mailHref && (
            <p>
              <a href={mailHref} className="hover:text-warm-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-300 focus-visible:rounded-sm break-all">
                <span aria-hidden="true">✉️</span> {email}
              </a>
            </p>
          )}
        </div>
        <nav aria-label="Footer-Navigation" className="flex flex-col gap-2 text-sm md:items-end">
          <Link href="/impressum" className="hover:text-warm-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-300 focus-visible:rounded-sm">Impressum</Link>
          <Link href="/datenschutz" className="hover:text-warm-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-300 focus-visible:rounded-sm">Datenschutz</Link>
        </nav>
      </div>
      <p className="max-w-5xl mx-auto mt-8 pt-6 border-t border-warm-800 text-xs text-warm-500 text-center md:text-left">
        © {year} {companyName}. Alle Rechte vorbehalten.
      </p>
    </footer>
  );
}
