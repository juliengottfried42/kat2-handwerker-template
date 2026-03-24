"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ChatStep as ChatStepBase } from "@/lib/queries";

type ChatStep = Omit<ChatStepBase, "id" | "options"> & {
  id?: string;
  options: { label: string; value: string; next_step?: number }[];
};

export function ChatFlowEditor({ initial }: { initial: ChatStep[] }) {
  const [steps, setSteps] = useState<ChatStep[]>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateStep(index: number, field: keyof ChatStep, value: unknown) {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  }

  function addOption(stepIndex: number) {
    const updated = [...steps];
    updated[stepIndex].options = [...updated[stepIndex].options, { label: "", value: "" }];
    setSteps(updated);
  }

  function updateOption(stepIndex: number, optIndex: number, field: string, value: string) {
    const updated = [...steps];
    updated[stepIndex].options = updated[stepIndex].options.map((opt, i) =>
      i === optIndex ? { ...opt, [field]: value } : opt
    );
    setSteps(updated);
  }

  function removeOption(stepIndex: number, optIndex: number) {
    const updated = [...steps];
    updated[stepIndex].options = updated[stepIndex].options.filter((_, i) => i !== optIndex);
    setSteps(updated);
  }

  function addStep() {
    setSteps([...steps, { step_order: steps.length + 1, question: "", options: [{ label: "", value: "" }], next_step: null, show_upload: false, show_calendar: false }]);
  }

  async function save(index: number) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/chat-flow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(steps[index]),
      });
      const saved = await res.json();
      if (!res.ok) { setError(saved.error ?? "Speichern fehlgeschlagen."); return; }
      const updated = [...steps];
      updated[index] = saved;
      setSteps(updated);
    } catch { setError("Netzwerkfehler."); } finally { setSaving(false); }
  }

  async function remove(index: number) {
    if (!confirm("Wirklich löschen?")) return;
    const step = steps[index];
    if (step.id) {
      setError(null);
      try {
        const res = await fetch("/api/admin/chat-flow", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: step.id }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error ?? "Löschen fehlgeschlagen.");
          return;
        }
      } catch { setError("Netzwerkfehler."); return; }
    }
    setSteps(steps.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
      {steps.map((step, si) => (
        <div key={step.id ?? si} className="bg-white border border-warm-100 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-warm-600">Schritt {step.step_order}</span>
            <label className="flex items-center gap-1 text-xs">
              <input type="checkbox" checked={step.show_upload} onChange={(e) => updateStep(si, "show_upload", e.target.checked)} /> Upload
            </label>
            <label className="flex items-center gap-1 text-xs">
              <input type="checkbox" checked={step.show_calendar} onChange={(e) => updateStep(si, "show_calendar", e.target.checked)} /> Kalender
            </label>
          </div>
          <Textarea value={step.question} onChange={(e) => updateStep(si, "question", e.target.value)} placeholder="Frage" />
          <div className="space-y-2">
            {step.options.map((opt, oi) => (
              <div key={oi} className="flex gap-2 items-center">
                <Input className="flex-1" value={opt.label} onChange={(e) => updateOption(si, oi, "label", e.target.value)} placeholder="Label" />
                <Input className="w-32" value={opt.value} onChange={(e) => updateOption(si, oi, "value", e.target.value)} placeholder="Value" />
                <Button onClick={() => removeOption(si, oi)} variant="outline" size="sm" className="text-red-600">×</Button>
              </div>
            ))}
            <Button onClick={() => addOption(si)} variant="outline" size="sm">+ Option</Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => save(si)} disabled={saving} size="sm" className="bg-green-600 hover:bg-green-700">Speichern</Button>
            <Button onClick={() => remove(si)} variant="outline" size="sm" className="text-red-600">Löschen</Button>
          </div>
        </div>
      ))}
      <Button onClick={addStep} variant="outline">+ Schritt hinzufügen</Button>
    </div>
  );
}
