"use client";

import { useState } from "react";

interface RandomRemixGeneratorProps {
  totalThemes?: number;
  onGenerate?: (count: number) => void;
}

export default function RandomRemixGenerator({ totalThemes = 314, onGenerate }: RandomRemixGeneratorProps) {
  const [count, setCount] = useState(5);
  const [toast, setToast] = useState(false);

  const handleGenerate = () => {
    if (onGenerate) {
      onGenerate(count);
    } else {
      setToast(true);
      setTimeout(() => setToast(false), 2000);
    }
  };

  return (
    <>
      <section
        className="rounded-2xl bg-white border-2 border-dashed border-amber-200 px-8 py-6 flex flex-col items-center gap-3 shadow-sm"
      >
        {/* Title */}
        <div className="flex items-center gap-2">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M16 3h5m0 0v5m0-5l-6 6M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-1M16 21h5m0 0v-5m0 5l-6-6" />
          </svg>
          <h3 className="text-base font-bold text-gray-900">Random Remix Generator</h3>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 text-center">
          Let us pick a random game and theme (from all{" "}
          <span className="font-semibold text-gray-700">{totalThemes}</span> themes) for you!
        </p>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-1">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Number of remixes:
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
            className="w-16 text-center text-sm font-semibold border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 bg-white"
          />
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-200 hover:border-amber-300 hover:bg-amber-50 text-gray-700 hover:text-amber-700 text-sm font-semibold rounded-xl transition-all shadow-sm"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M16 3h5m0 0v5m0-5l-6 6M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-1M16 21h5m0 0v-5m0 5l-6-6" />
            </svg>
            Generate {count} Random
          </button>
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-xl animate-fade-in">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M16 3h5m0 0v5m0-5l-6 6M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-1M16 21h5m0 0v-5m0 5l-6-6" />
          </svg>
          Generating {count} random remixes…
        </div>
      )}
    </>
  );
}
