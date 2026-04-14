import Link from "next/link";

export function Footer({ companyName }: { companyName: string }) {
  return (
    <footer className="bg-warm-900 text-warm-300 py-10 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-sm gap-4" role="contentinfo">
      <div>© {new Date().getFullYear()} {companyName}</div>
      <nav aria-label="Footer-Navigation" className="flex gap-6">
        <Link href="/impressum" className="hover:text-warm-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-300 focus-visible:rounded-sm">Impressum</Link>
        <Link href="/datenschutz" className="hover:text-warm-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-300 focus-visible:rounded-sm">Datenschutz</Link>
      </nav>
    </footer>
  );
}
