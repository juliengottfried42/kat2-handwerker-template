"use client";

interface WhatsAppButtonProps {
  number: string;
}

export function WhatsAppButton({ number }: WhatsAppButtonProps) {
  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-7 right-7 w-15 h-15 bg-[#25d366] rounded-full flex items-center justify-center text-white text-3xl shadow-lg hover:scale-110 transition-transform z-50"
      aria-label="WhatsApp"
    >
      💬
    </a>
  );
}
