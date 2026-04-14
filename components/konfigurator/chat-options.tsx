interface ChatOptionsProps {
  options: { label: string; value: string }[];
  onSelect: (value: string, label: string) => void;
}

export function ChatOptions({ options, onSelect }: ChatOptionsProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Antwortmoeglichkeiten">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value, opt.label)}
          className="px-5 py-2.5 bg-white border border-warm-200 rounded-full text-sm font-medium text-warm-700 hover:bg-warm-100 hover:border-warm-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
