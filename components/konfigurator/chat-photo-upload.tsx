"use client";

import { useRef, useState } from "react";

interface ChatPhotoUploadProps {
  onUpload: (urls: string[]) => void;
  onSkip: () => void;
}

export function ChatPhotoUpload({ onUpload, onSkip }: ChatPhotoUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFiles(files: FileList) {
    setUploading(true);
    setUploadError(null);
    const urls: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) {
          setUploadError(data.error ?? "Upload fehlgeschlagen.");
          continue;
        }
        if (data.url) urls.push(data.url);
      }
    } catch {
      setUploadError("Netzwerkfehler beim Upload.");
    } finally {
      setUploading(false);
    }
    if (urls.length > 0) onUpload(urls);
  }

  return (
    <div className="flex flex-col gap-2" role="group" aria-label="Foto-Upload Optionen">
      <div className="flex flex-wrap gap-2">
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" aria-label="Fotos auswaehlen" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
        <button onClick={() => fileRef.current?.click()} disabled={uploading} className="min-h-[48px] px-5 py-3 bg-white border border-warm-200 rounded-full text-sm font-medium text-warm-700 hover:bg-warm-100 transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600" aria-label={uploading ? "Fotos werden hochgeladen" : "Fotos hochladen"}>
          {uploading ? "Wird hochgeladen..." : "📷 Fotos hochladen"}
        </button>
        <button onClick={onSkip} disabled={uploading} className="min-h-[48px] px-5 py-3 bg-white border border-warm-200 rounded-full text-sm font-medium text-warm-700 hover:bg-warm-100 transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600" aria-label="Foto-Upload ueberspringen">
          Ueberspringen
        </button>
      </div>
      {uploadError && (
        <p role="alert" className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {uploadError}
        </p>
      )}
    </div>
  );
}
