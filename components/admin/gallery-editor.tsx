"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GalleryItem {
  id?: string;
  title: string;
  before_image: string;
  after_image: string;
  sort_order: number;
}

export function GalleryEditor({ initial }: { initial: GalleryItem[] }) {
  const [items, setItems] = useState<GalleryItem[]>(initial);
  const [saving, setSaving] = useState(false);

  async function handleUpload(file: File, index: number, field: "before_image" | "after_image") {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) {
      const updated = [...items];
      updated[index] = { ...updated[index], [field]: data.url };
      setItems(updated);
    }
  }

  function addItem() {
    setItems([...items, { title: "", before_image: "", after_image: "", sort_order: items.length + 1 }]);
  }

  async function save(index: number) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items[index]),
      });
      const saved = await res.json();
      if (saved.id) {
        const updated = [...items];
        updated[index] = saved;
        setItems(updated);
      }
    } finally {
      setSaving(false);
    }
  }

  async function remove(index: number) {
    const item = items[index];
    if (item.id) {
      await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
    }
    setItems(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={item.id ?? i} className="bg-white border border-warm-100 rounded-xl p-4 space-y-3">
          <div className="flex gap-3">
            <Input className="flex-1" value={item.title} onChange={(e) => { const u = [...items]; u[i] = { ...u[i], title: e.target.value }; setItems(u); }} placeholder="Titel" />
            <Input className="w-20" type="number" value={item.sort_order} onChange={(e) => { const u = [...items]; u[i] = { ...u[i], sort_order: Number(e.target.value) }; setItems(u); }} placeholder="#" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-warm-600 mb-1">Vorher</p>
              {item.before_image ? <img src={item.before_image} alt="Vorher" className="h-24 w-full object-cover rounded-lg" /> : null}
              <input type="file" accept="image/*" className="text-xs mt-1" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], i, "before_image")} />
            </div>
            <div>
              <p className="text-xs text-warm-600 mb-1">Nachher</p>
              {item.after_image ? <img src={item.after_image} alt="Nachher" className="h-24 w-full object-cover rounded-lg" /> : null}
              <input type="file" accept="image/*" className="text-xs mt-1" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], i, "after_image")} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => save(i)} disabled={saving} size="sm" className="bg-green-600 hover:bg-green-700">Speichern</Button>
            <Button onClick={() => remove(i)} variant="outline" size="sm" className="text-red-600">Löschen</Button>
          </div>
        </div>
      ))}
      <Button onClick={addItem} variant="outline">+ Galerie-Eintrag</Button>
    </div>
  );
}
