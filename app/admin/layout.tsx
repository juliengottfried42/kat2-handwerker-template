import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-warm-50">
      <nav className="bg-warm-800 text-warm-100 px-6 py-3 flex items-center gap-6 text-sm">
        <span className="font-serif text-lg">Admin</span>
        <Link href="/admin" className="hover:text-white">Anfragen</Link>
        <Link href="/admin/inhalte" className="hover:text-white">Inhalte</Link>
      </nav>
      <div className="p-6">{children}</div>
    </div>
  );
}
