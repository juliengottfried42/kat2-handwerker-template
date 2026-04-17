export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-warm-200 border-t-green-700" />
        <p className="text-sm text-warm-500">Laden...</p>
      </div>
    </div>
  )
}
