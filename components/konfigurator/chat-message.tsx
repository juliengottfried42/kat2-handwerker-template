interface ChatMessageProps {
  type: "bot" | "user";
  text: string;
}

export function ChatMessageBubble({ type, text }: ChatMessageProps) {
  return (
    <div className={`flex ${type === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
          type === "bot"
            ? "bg-warm-100 text-warm-800 rounded-bl-sm"
            : "bg-green-600 text-white rounded-br-sm"
        }`}
        role={type === "bot" ? "status" : undefined}
      >
        <span className="sr-only">{type === "bot" ? "Berater:" : "Sie:"}</span>
        {text}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex justify-start" role="status" aria-label="Berater tippt...">
      <div className="bg-warm-100 px-5 py-3 rounded-2xl rounded-bl-sm flex gap-1.5" aria-hidden="true">
        <span className="w-2 h-2 bg-warm-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-warm-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 bg-warm-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
