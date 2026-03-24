import Link from "next/link";

export function Footer({ companyName }: { companyName: string }) {
  return (
    <footer className="bg-warm-900 text-warm-300 py-10 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-sm gap-4">
      <div>© {new Date().getFullYear()} {companyName}</div>
      <div className="flex gap-6">
        <Link href="/impressum" className="hover:text-warm-100 transition-colors">Impressum</Link>
        <Link href="/datenschutz" className="hover:text-warm-100 transition-colors">Datenschutz</Link>
      </div>
    </footer>
  );
}
