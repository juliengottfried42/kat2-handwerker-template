"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

interface ChatCalendarProps {
  onSelect: (date: string) => void;
}

export function ChatCalendar({ onSelect }: ChatCalendarProps) {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <div>
      <Calendar mode="single" selected={date} onSelect={setDate} disabled={{ before: new Date() }} className="rounded-xl border border-warm-200 bg-white" />
      <Button onClick={() => date && onSelect(date.toISOString().split("T")[0])} disabled={!date} className="mt-3 bg-green-600 hover:bg-green-700">
        Termin bestätigen
      </Button>
    </div>
  );
}
