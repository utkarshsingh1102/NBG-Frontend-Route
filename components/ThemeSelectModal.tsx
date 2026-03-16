"use client";

import { useState, useMemo } from "react";
import { THEMES, Theme, themeIcon } from "@/lib/mockData";

interface ThemeSelectModalProps {
  selectedIds: string[];
  onConfirm: (themes: Theme[]) => void;
  onClose: () => void;
}

const MAX_THEMES = 5;

export default function ThemeSelectModal({ selectedIds, onConfirm, onClose }: ThemeSelectModalProps) {
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState<string[]>(selectedIds);

  const filtered = useMemo(() => {
    if (!search.trim()) return THEMES;
    const q = search.toLowerCase();
    return THEMES.filter((t) => t.label.toLowerCase().includes(q));
  }, [search]);

  const toggle = (id: string) => {
    setPending((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_THEMES) return prev;
      return [...prev, id];
    });
  };

  const handleConfirm = () => {
    onConfirm(THEMES.filter((t) => pending.includes(t.id)));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Select a Theme</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleConfirm}
              disabled={pending.length === 0}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold rounded-lg transition"
            >
              Done ({pending.length} selected)
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 pt-4 pb-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search themes..."
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border-2 rounded-xl focus:outline-none transition"
              style={{ borderColor: "#f59e0b" }}
            />
          </div>
          <p className="text-xs mt-2">
            <span className="text-gray-400">250+ themes available{search.trim() && ` · ${filtered.length} matching`}</span>
            {pending.length > 0 && (
              <span className={pending.length >= MAX_THEMES ? " · text-red-500 font-semibold" : " · text-gray-500"}>
                {` ${pending.length}/${MAX_THEMES} selected`}
                {pending.length >= MAX_THEMES && " · Max reached"}
              </span>
            )}
          </p>
        </div>

        {/* Theme grid */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="mb-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm">No themes match your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-3">
              {filtered.map((theme, idx) => {
                const isSelected = pending.includes(theme.id);
                const isDisabled = !isSelected && pending.length >= MAX_THEMES;
                return (
                  <button
                    key={theme.id}
                    onClick={() => toggle(theme.id)}
                    disabled={isDisabled}
                    className={`relative rounded-xl overflow-hidden group transition-all duration-150 flex flex-col items-center p-2 border-2 ${
                      isSelected
                        ? "border-amber-400 bg-amber-50 ring-[2px] ring-amber-300 ring-offset-1"
                        : isDisabled
                        ? "border-gray-100 opacity-40 cursor-not-allowed"
                        : "border-gray-100 hover:border-amber-200 hover:shadow-md bg-white"
                    }`}
                  >
                    {/* Icon */}
                    <div className="w-full aspect-square rounded-lg overflow-hidden mb-1.5">
                      <img
                        src={themeIcon(idx)}
                        alt={theme.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    {/* Label */}
                    <p className={`text-[10px] font-semibold text-center leading-tight ${isSelected ? "text-amber-700" : "text-gray-700"}`}>
                      {theme.label}
                    </p>
                    {/* Check badge */}
                    <div className={`absolute top-1 right-1 w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      isSelected ? "bg-amber-400 border-amber-400" : "bg-white/70 border-white/80"
                    }`}>
                      {isSelected && (
                        <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
