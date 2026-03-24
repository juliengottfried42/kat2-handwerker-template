"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ServicesEditor } from "./services-editor";
import { ChatFlowEditor } from "./chat-flow-editor";
import { GalleryEditor } from "./gallery-editor";

interface ContentEditorProps {
  config: Record<string, string>;
  services: any[];
  chatFlow: any[];
  gallery: any[];
}

export function ContentEditor({ config, services, chatFlow, gallery }: ContentEditorProps) {
  const [values, setValues] = useState<Record<string, string>>(config);
  const [saving, setSaving] = useState(false);

  async function saveConfig(key: string) {
    setSaving(true);
    try {
      await fetch("/api/admin/site-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: values[key] }),
      });
    } finally {
      setSaving(false);
    }
  }

  function ConfigField({ configKey, label, multiline }: { configKey: string; label: string; multiline?: boolean }) {
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
          <ConfigField configKey="hero_title" label="Hero Titel" />
          <ConfigField configKey="hero_subtitle" label="Hero Untertitel" multiline />
          <ConfigField configKey="company_name" label="Firmenname" />
          <ConfigField configKey="about_title" label="Über uns Titel" />
          <ConfigField configKey="about_text" label="Über uns Text" multiline />
          <ConfigField configKey="about_years" label="Jahre Erfahrung" />
          <ConfigField configKey="about_projects" label="Projekte" />
        </div>
      </TabsContent>
      <TabsContent value="branding">
        <div className="space-y-4">
          <ConfigField configKey="phone" label="Telefon" />
          <ConfigField configKey="email" label="E-Mail" />
          <ConfigField configKey="whatsapp" label="WhatsApp Nr." />
        </div>
      </TabsContent>
    </Tabs>
  );
}
