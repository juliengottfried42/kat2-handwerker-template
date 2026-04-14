"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ChatContactFormProps {
  onSubmit: (data: { name: string; phone: string; email: string; message?: string }) => void;
  submitting: boolean;
}

export function ChatContactForm({ onSubmit, submitting }: ChatContactFormProps) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) return;
    onSubmit({ ...form, message: form.message || undefined });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-sm" aria-label="Kontaktformular">
      <Input placeholder="Name *" aria-label="Name (Pflichtfeld)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="bg-white" />
      <Input placeholder="Telefon *" aria-label="Telefonnummer (Pflichtfeld)" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="bg-white" />
      <Input placeholder="E-Mail *" aria-label="E-Mail-Adresse (Pflichtfeld)" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="bg-white" />
      <Textarea placeholder="Nachricht (optional)" aria-label="Nachricht (optional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="bg-white" />
      <Button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-700" aria-label={submitting ? "Anfrage wird gesendet" : "Anfrage absenden"}>
        {submitting ? "Wird gesendet..." : "Anfrage absenden"}
      </Button>
    </form>
  );
}
