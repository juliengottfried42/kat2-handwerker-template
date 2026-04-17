import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-warm-50">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-serif font-bold mb-4 text-warm-900">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-warm-800">
          Seite nicht gefunden
        </h2>
        <p className="text-lg text-warm-600 mb-8">
          Die angeforderte Seite existiert nicht oder wurde verschoben.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-green-700 px-6 py-3 text-white font-medium hover:bg-green-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-600"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  )
}
