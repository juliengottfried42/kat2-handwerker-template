"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ServicesEditor } from "./services-editor";
import { ChatFlowEditor } from "./chat-flow-editor";
import { GalleryEditor } from "./gallery-editor";
import type { Service, ChatStep, GalleryItem } from "@/lib/queries";

interface ConfigFieldProps {
  configKey: string;
  label: string;
  multiline?: boolean;
  values: Record<string, string>;
  setValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  saving: boolean;
  saveConfig: (key: string) => Promise<void>;
}

function ConfigField({ configKey, label, multiline, values, setValues, saving, saveConfig }: ConfigFieldProps) {
  const Component = multiline ? Textarea : Input;
  return (
    <div className="flex gap-3 items-start">
      <label className="w-40 text-sm text-warm-600 pt-2">{label}</label>
      <Component
        className="flex-1 bg-white"
        value={values[configKey] ?? ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValues({ ...values, [configKey]: e.target.value })}
      />
      <Button onClick={() => saveConfig(configKey)} disabled={saving} size="sm" className="bg-green-600 hover:bg-green-700">
        Speichern
      </Button>
    </div>
  );
}

interface ContentEditorProps {
  config: Record<string, string>;
  services: Service[];
  chatFlow: ChatStep[];
  gallery: GalleryItem[];
}

export function ContentEditor({ config, services, chatFlow, gallery }: ContentEditorProps) {
  const [values, setValues] = useState<Record<string, string>>(config);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveConfig(key: string) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/site-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: values[key] }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Speichern fehlgeschlagen."); return; }
    } catch { setError("Netzwerkfehler."); } finally { setSaving(false); }
  }

  return (
    <Tabs defaultValue="leistungen">
      <TabsList className="mb-6">
        <TabsTrigger value="leistungen">Leistungen</TabsTrigger>
        <TabsTrigger value="chatflow">Chat-Flow</TabsTrigger>
        <TabsTrigger value="galerie">Galerie</TabsTrigger>
        <TabsTrigger value="texte">Texte</TabsTrigger>
        <TabsTrigger value="branding">Branding</TabsTrigger>
      </TabsList>
      <TabsContent value="leistungen"><ServicesEditor initial={services} /></TabsContent>
      <TabsContent value="chatflow"><ChatFlowEditor initial={chatFlow} /></TabsContent>
      <TabsContent value="galerie"><GalleryEditor initial={gallery} /></TabsContent>
      <TabsContent value="texte">
        <div className="space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          <ConfigField configKey="hero_title" label="Hero Titel" values={values} setValues={setValues} saving={saving} saveConfig={saveConfig} />
          <ConfigField configKey="hero_subtitle" label="Hero Untertitel" multiline values={values} setValues={setValues} saving={saving} saveConfig={saveConfig} />
          <ConfigField configKey="company_name" label="Firmenname" values={values} setValues={setValues} saving={saving} saveConfig={saveConfig} />
          <ConfigField configKey="about_title" label="Über uns Titel" values={values} setValues={setValues} saving={saving} saveConfig={saveConfig} />
          <ConfigField configKey="about_text" label="Über uns Text" multiline values={values} setValues={setValues} saving={saving} saveConfig={saveConfig} />
          <ConfigField configKey="about_years" label="Jahre Erfahrung" values={values} setValues={setValues} saving={saving} saveConfig={saveConfig} />
          <ConfigField configKey="about_projects" label="Projekte" values={values} setValues={setValues} saving={saving} saveConfig={saveConfig} />
        </div>
      </TabsContent>
      <TabsContent value="branding">
        <div className="space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          <ConfigField configKey="phone" label="Telefon" values={values} setValues={setValues} saving={saving} saveConfig={saveConfig} />
          <ConfigField configKey="email" label="E-Mail" values={values} setValues={setValues} saving={saving} saveConfig={saveConfig} />
          <ConfigField configKey="whatsapp" label="WhatsApp Nr." values={values} setValues={setValues} saving={saving} saveConfig={saveConfig} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
