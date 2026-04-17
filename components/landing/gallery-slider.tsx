"use client";

import { useRef, useState } from "react";

interface GallerySliderProps {
  beforeImage: string;
  afterImage: string;
  title: string;
}

export function GallerySlider({ beforeImage, afterImage, title }: GallerySliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);

  function handleMove(clientX: number) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      setSliderPos((p) => Math.max(0, p - 5));
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      setSliderPos((p) => Math.min(100, p + 5));
      e.preventDefault();
    } else if (e.key === "Home") {
      setSliderPos(0);
    } else if (e.key === "End") {
      setSliderPos(100);
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-col-resize select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
      onMouseMove={(e) => e.buttons === 1 && handleMove(e.clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onKeyDown={handleKey}
      tabIndex={0}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(sliderPos)}
      aria-label={`Vorher/Nachher Vergleich: ${title}. Pfeiltasten zum Verschieben.`}
    >
      <img src={afterImage} alt={`${title} nachher`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
        <img src={beforeImage} alt={`${title} vorher`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" style={{ minWidth: containerRef.current?.offsetWidth }} />
      </div>
      <div className="absolute top-0 bottom-0 w-0.5 bg-white z-10" style={{ left: `${sliderPos}%` }} />
      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-base shadow-lg z-20" style={{ left: `${sliderPos}%` }} aria-hidden="true">↔</div>
      <span className="absolute bottom-3 left-3 text-xs font-semibold text-white bg-black/50 px-2.5 py-1 rounded-md z-10">Vorher</span>
      <span className="absolute bottom-3 right-3 text-xs font-semibold text-white bg-black/50 px-2.5 py-1 rounded-md z-10">Nachher</span>
    </div>
  );
}
