interface ChatOptionsProps {
  options: { label: string; value: string }[];
  onSelect: (value: string, label: string) => void;
}

export function ChatOptions({ options, onSelect }: ChatOptionsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2" role="group" aria-label="Antwortmoeglichkeiten">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onSelect(opt.value, opt.label)}
          className="inline-flex items-center justify-center sm:justify-start min-h-[48px] px-5 py-3 bg-white border border-warm-200 rounded-xl sm:rounded-full text-base sm:text-sm font-medium text-warm-800 hover:bg-warm-100 hover:border-warm-300 active:bg-warm-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-green-600"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
