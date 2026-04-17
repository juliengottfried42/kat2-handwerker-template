"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Unhandled error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-warm-50">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-serif font-bold mb-4 text-warm-900">
          Etwas ist schiefgelaufen
        </h1>
        <p className="text-lg text-warm-600 mb-8">
          Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-md bg-green-700 px-6 py-3 text-white font-medium hover:bg-green-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-600"
        >
          Erneut versuchen
        </button>
      </div>
    </div>
  )
}
