import Link from "next/link";
import { getSiteConfig } from "@/lib/queries";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig();

  return (
    <>
      <nav className="flex justify-between items-center px-6 md:px-12 py-4 bg-white shadow-sm sticky top-0 z-50">
        <Link href="/" className="font-serif text-xl text-warm-700">{config.company_name}</Link>
        <ul className="hidden md:flex items-center gap-7">
          <li><a href="#leistungen" className="text-sm font-medium text-warm-600 hover:text-warm-500">Leistungen</a></li>
          <li><a href="#galerie" className="text-sm font-medium text-warm-600 hover:text-warm-500">Arbeiten</a></li>
          <li><a href="#bewertungen" className="text-sm font-medium text-warm-600 hover:text-warm-500">Bewertungen</a></li>
          <li><a href="#ueber" className="text-sm font-medium text-warm-600 hover:text-warm-500">Über uns</a></li>
          <li><Link href="/konfigurator" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors">Jetzt anfragen</Link></li>
        </ul>
      </nav>
      {children}
    </>
  );
}
