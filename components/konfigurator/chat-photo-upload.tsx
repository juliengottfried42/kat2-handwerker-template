"use client";

import { useRef, useState } from "react";

interface ChatPhotoUploadProps {
  onUpload: (urls: string[]) => void;
  onSkip: () => void;
}

export function ChatPhotoUpload({ onUpload, onSkip }: ChatPhotoUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList) {
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) urls.push(data.url);
    }
    setUploading(false);
    onUpload(urls);
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Foto-Upload Optionen">
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" aria-label="Fotos auswaehlen" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
      <button onClick={() => fileRef.current?.click()} disabled={uploading} className="px-5 py-2.5 bg-white border border-warm-200 rounded-full text-sm font-medium text-warm-700 hover:bg-warm-100 transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600" aria-label={uploading ? "Fotos werden hochgeladen" : "Fotos hochladen"}>
        {uploading ? "Wird hochgeladen..." : "📷 Fotos hochladen"}
      </button>
      <button onClick={onSkip} disabled={uploading} className="px-5 py-2.5 bg-white border border-warm-200 rounded-full text-sm font-medium text-warm-700 hover:bg-warm-100 transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600" aria-label="Foto-Upload ueberspringen">
        Überspringen
      </button>
    </div>
  );
}
