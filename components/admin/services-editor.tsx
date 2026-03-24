"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Service {
  id?: string;
  title: string;
  description: string;
  icon: string;
  price_from: number | null;
  sort_order: number;
}

export function ServicesEditor({ initial }: { initial: Service[] }) {
  const [services, setServices] = useState<Service[]>(initial);
  const [saving, setSaving] = useState(false);

  function addService() {
    setServices([...services, { title: "", description: "", icon: "🔧", price_from: null, sort_order: services.length + 1 }]);
  }

  function updateField(index: number, field: keyof Service, value: string | number | null) {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  }

  async function save(index: number) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(services[index]),
      });
      const saved = await res.json();
      if (saved.id) {
        const updated = [...services];
        updated[index] = saved;
        setServices(updated);
      }
    } finally {
      setSaving(false);
    }
  }

  async function remove(index: number) {
    const svc = services[index];
    if (svc.id) {
      await fetch("/api/admin/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: svc.id }),
      });
    }
    setServices(services.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {services.map((svc, i) => (
        <div key={svc.id ?? i} className="bg-white border border-warm-100 rounded-xl p-4 space-y-3">
          <div className="flex gap-3">
            <Input className="w-16" value={svc.icon} onChange={(e) => updateField(i, "icon", e.target.value)} placeholder="Icon" />
            <Input className="flex-1" value={svc.title} onChange={(e) => updateField(i, "title", e.target.value)} placeholder="Titel" />
            <Input className="w-32" type="number" value={svc.price_from ?? ""} onChange={(e) => updateField(i, "price_from", e.target.value ? Number(e.target.value) : null)} placeholder="ab CHF" />
            <Input className="w-20" type="number" value={svc.sort_order} onChange={(e) => updateField(i, "sort_order", Number(e.target.value))} placeholder="#" />
          </div>
          <Textarea value={svc.description} onChange={(e) => updateField(i, "description", e.target.value)} placeholder="Beschreibung" />
          <div className="flex gap-2">
            <Button onClick={() => save(i)} disabled={saving} size="sm" className="bg-green-600 hover:bg-green-700">Speichern</Button>
            <Button onClick={() => remove(i)} variant="outline" size="sm" className="text-red-600">Löschen</Button>
          </div>
        </div>
      ))}
      <Button onClick={addService} variant="outline">+ Leistung hinzufügen</Button>
    </div>
  );
}
