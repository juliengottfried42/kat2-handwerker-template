"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string | null;
  answers: Record<string, string>;
  photos: string[];
  preferred_date: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

export function InquiryDetail({ inquiry }: { inquiry: Inquiry }) {
  const [status, setStatus] = useState(inquiry.status);
  const [notes, setNotes] = useState(inquiry.notes ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch(`/api/anfrage`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: inquiry.id, status, notes }),
    });
    setSaving(false);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="font-serif text-2xl text-warm-800">{inquiry.name}</h1>
        <Badge>{status}</Badge>
      </div>

      <div className="bg-white rounded-xl border border-warm-100 p-6 space-y-3">
        <h3 className="font-semibold text-warm-800">Kontakt</h3>
        <p><a href={`tel:${inquiry.phone}`} className="text-green-600 hover:underline">📞 {inquiry.phone}</a></p>
        <p><a href={`mailto:${inquiry.email}`} className="text-green-600 hover:underline">✉️ {inquiry.email}</a></p>
        <p><a href={`https://wa.me/${inquiry.phone.replace(/\s/g, "").replace("+", "")}`} className="text-green-600 hover:underline">💬 WhatsApp</a></p>
        {inquiry.preferred_date && <p>📅 Wunschtermin: {inquiry.preferred_date}</p>}
        {inquiry.message && <p>💬 {inquiry.message}</p>}
      </div>

      <div className="bg-white rounded-xl border border-warm-100 p-6 space-y-3">
        <h3 className="font-semibold text-warm-800">Antworten</h3>
        {Object.entries(inquiry.answers).map(([q, a]) => (
          <div key={q}><span className="text-warm-600">{q}:</span> <strong>{a}</strong></div>
        ))}
      </div>

      {inquiry.photos.length > 0 && (
        <div className="bg-white rounded-xl border border-warm-100 p-6">
          <h3 className="font-semibold text-warm-800 mb-3">Fotos</h3>
          <div className="grid grid-cols-2 gap-3">
            {inquiry.photos.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                <img src={url} alt={`Foto ${i + 1}`} className="rounded-lg w-full h-40 object-cover" />
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-warm-100 p-6 space-y-4">
        <h3 className="font-semibold text-warm-800">Bearbeiten</h3>
        <Select value={status} onValueChange={(v) => { if (v !== null) setStatus(v); }}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="neu">Neu</SelectItem>
            <SelectItem value="beantwortet">Beantwortet</SelectItem>
            <SelectItem value="erledigt">Erledigt</SelectItem>
          </SelectContent>
        </Select>
        <Textarea placeholder="Interne Notizen..." value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Button onClick={save} disabled={saving} className="bg-green-600 hover:bg-green-700">
          {saving ? "Speichern..." : "Speichern"}
        </Button>
      </div>
    </div>
  );
}
