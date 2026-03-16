"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { THEMES, Theme } from "@/lib/mockData";

const MAX_THEMES = 5;

const OPTION_META = [
  {
    id: 1,
    label: "Inline Expand / Collapse",
    desc: "A button that toggles a scrollable theme grid directly below it — no overlay.",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h8" />
      </svg>
    ),
  },
  {
    id: 2,
    label: "Horizontal Chip Strip",
    desc: "All themes as a horizontally scrollable row of pill buttons — always visible.",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10M7 12h10M7 17h4" />
      </svg>
    ),
  },
  {
    id: 3,
    label: "Slide-in Drawer",
    desc: "A panel slides in from the right side — page stays visible behind it.",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    id: 4,
    label: "Search Autocomplete",
    desc: "Type a theme name — matching suggestions appear in a small dropdown below.",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    id: 5,
    label: "Anchored Popover",
    desc: "A compact floating grid appears anchored right next to the button on click.",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

// ── Shared chip ──────────────────────────────────────────────────────────────
function ThemeChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-amber-200">
      {label}
      <button onClick={onRemove} className="ml-0.5 hover:text-red-600 transition-colors">
        <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}

// ── Theme card (used in grid layouts) ────────────────────────────────────────
function ThemeCard({
  theme,
  isSelected,
  isDisabled,
  onClick,
}: {
  theme: Theme;
  idx?: number;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`relative rounded-xl flex flex-col items-center p-2 border-2 transition-all duration-150 ${
        isSelected
          ? "border-amber-400 bg-amber-50 ring-[2px] ring-amber-300 ring-offset-1"
          : isDisabled
          ? "border-gray-100 opacity-40 cursor-not-allowed"
          : "border-gray-100 hover:border-amber-200 hover:shadow-md bg-white"
      }`}
    >
      <div className={`w-full h-10 rounded-lg mb-1.5 flex items-center justify-center text-2xl ${
        isSelected ? "bg-amber-100" : "bg-gray-50"
      }`}>
        {theme.emoji}
      </div>
      <p className={`text-[11px] font-semibold text-center leading-tight ${isSelected ? "text-amber-700" : "text-gray-700"}`}>
        {theme.label}
      </p>
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
}

// ── Option 1: Inline Expand/Collapse ─────────────────────────────────────────
function Option1({
  selectedThemes,
  onToggle,
}: {
  selectedThemes: Theme[];
  onToggle: (t: Theme, idx?: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return THEMES;
    const q = search.toLowerCase();
    return THEMES.filter((t) => t.label.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className="space-y-3">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-between w-full px-4 py-3 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-sm transition"
      >
        <div className="flex items-center gap-2">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          <span>{expanded ? "Collapse Themes" : "Browse Themes"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-700 bg-white px-2.5 py-0.5 rounded-full">
            250+ available
          </span>
          <svg
            width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="border border-amber-100 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="p-3 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search themes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 bg-amber-50"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">
              250+ themes available{search.trim() && ` · ${filtered.length} matching`}
              {selectedThemes.length > 0 && (
                <span className={selectedThemes.length >= MAX_THEMES ? " · text-red-500 font-semibold" : " · text-gray-500"}>
                  {` · ${selectedThemes.length}/${MAX_THEMES} selected`}
                  {selectedThemes.length >= MAX_THEMES && " · Max reached"}
                </span>
              )}
            </p>
          </div>
          <div className="max-h-[280px] overflow-y-auto p-3">
            <div className="grid grid-cols-5 gap-2">
              {filtered.map((theme) => {
                const idx = THEMES.indexOf(theme);
                const isSelected = selectedThemes.some((t) => t.id === theme.id);
                const isDisabled = !isSelected && selectedThemes.length >= MAX_THEMES;
                return (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    idx={idx}
                    isSelected={isSelected}
                    isDisabled={isDisabled}
                    onClick={() => onToggle(theme, idx)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Option 2: Horizontal Chip Strip ──────────────────────────────────────────
function Option2({
  selectedThemes,
  onToggle,
}: {
  selectedThemes: Theme[];
  onToggle: (t: Theme, idx?: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-gray-500">Scroll horizontally · click to select up to {MAX_THEMES}</p>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          selectedThemes.length >= MAX_THEMES ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"
        }`}>
          {selectedThemes.length}/{MAX_THEMES}
        </span>
      </div>
      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2 w-max">
          {THEMES.map((theme, idx) => {
            const isSelected = selectedThemes.some((t) => t.id === theme.id);
            const isDisabled = !isSelected && selectedThemes.length >= MAX_THEMES;
            return (
              <button
                key={theme.id}
                onClick={() => onToggle(theme, idx)}
                disabled={isDisabled}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap border transition-all flex-shrink-0 ${
                  isSelected
                    ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                    : isDisabled
                    ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-200 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50"
                }`}
              >
                <span className="text-sm leading-none">{theme.emoji}</span>
                {theme.label}
                {isSelected && (
                  <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Option 3: Slide-in Drawer ─────────────────────────────────────────────────
function Option3({
  selectedThemes,
  onToggle,
}: {
  selectedThemes: Theme[];
  onToggle: (t: Theme, idx?: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return THEMES;
    const q = search.toLowerCase();
    return THEMES.filter((t) => t.label.toLowerCase().includes(q));
  }, [search]);

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-sm transition"
        >
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Open Theme Drawer
          <span className="text-xs font-bold text-amber-700 bg-white px-2 py-0.5 rounded-full">250+</span>
        </button>
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
          selectedThemes.length >= MAX_THEMES ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"
        }`}>
          {selectedThemes.length}/{MAX_THEMES} selected
        </span>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[340px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">Select Themes</h3>
            <p className={`text-[10px] mt-0.5 ${selectedThemes.length >= MAX_THEMES ? "text-red-500 font-semibold" : "text-gray-400"}`}>
              {selectedThemes.length}/{MAX_THEMES} selected{selectedThemes.length >= MAX_THEMES && " · Max reached"}
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer search */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search themes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-400 bg-white"
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5">
            250+ themes available{search.trim() && ` · ${filtered.length} matching`}
          </p>
        </div>

        {/* Drawer grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-3 gap-2">
            {filtered.map((theme) => {
              const idx = THEMES.indexOf(theme);
              const isSelected = selectedThemes.some((t) => t.id === theme.id);
              const isDisabled = !isSelected && selectedThemes.length >= MAX_THEMES;
              return (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  idx={idx}
                  isSelected={isSelected}
                  isDisabled={isDisabled}
                  onClick={() => onToggle(theme, idx)}
                />
              );
            })}
          </div>
        </div>

        {/* Drawer footer */}
        <div className="px-4 py-3 border-t border-gray-100">
          <button
            onClick={() => setOpen(false)}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition"
          >
            Done · {selectedThemes.length} selected
          </button>
        </div>
      </div>
    </>
  );
}

// ── Option 4: Search Autocomplete ─────────────────────────────────────────────
function Option4({
  selectedThemes,
  onToggle,
}: {
  selectedThemes: Theme[];
  onToggle: (t: Theme, idx?: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return THEMES.filter((t) => t.label.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="space-y-2">
      <div ref={ref} className="relative max-w-sm">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Type a theme name e.g. Space, Ocean..."
            value={query}
            disabled={selectedThemes.length >= MAX_THEMES}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => { if (query.trim()) setOpen(true); }}
            className="w-full pl-9 pr-4 py-2.5 text-sm border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-400 bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
          />
          <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
            selectedThemes.length >= MAX_THEMES ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"
          }`}>
            {selectedThemes.length}/{MAX_THEMES}
          </span>
        </div>

        {open && suggestions.length > 0 && (
          <div className="absolute z-30 top-full mt-1 w-full bg-white rounded-xl border border-gray-100 shadow-2xl overflow-hidden">
            {suggestions.map((theme) => {
              const idx = THEMES.indexOf(theme);
              const isSelected = selectedThemes.some((t) => t.id === theme.id);
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    onToggle(theme, idx);
                    setQuery("");
                    setOpen(false);
                  }}
                  className={`flex items-center gap-2.5 w-full px-3 py-2 text-left transition-colors hover:bg-amber-50 ${
                    isSelected ? "bg-amber-50" : ""
                  }`}
                >
                  <span className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-lg flex-shrink-0">{theme.emoji}</span>
                  <span className="flex-1 text-sm font-medium text-gray-800">{theme.label}</span>
                  {isSelected && (
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {open && query.trim() && suggestions.length === 0 && (
          <div className="absolute z-30 top-full mt-1 w-full bg-white rounded-xl border border-gray-100 shadow-xl px-4 py-4 text-center">
            <p className="text-xs text-gray-400">No themes match &ldquo;{query}&rdquo;</p>
          </div>
        )}
      </div>

      {selectedThemes.length === 0 && (
        <p className="text-xs text-gray-400">Start typing to see matching themes from 250+ options</p>
      )}
    </div>
  );
}

// ── Option 5: Anchored Popover ────────────────────────────────────────────────
function Option5({
  selectedThemes,
  onToggle,
}: {
  selectedThemes: Theme[];
  onToggle: (t: Theme, idx?: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return THEMES;
    const q = search.toLowerCase();
    return THEMES.filter((t) => t.label.toLowerCase().includes(q));
  }, [search]);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl shadow-sm transition border ${
          open
            ? "bg-amber-500 text-white border-amber-500"
            : "bg-white text-amber-700 border-amber-300 hover:bg-amber-50"
        }`}
      >
        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        Browse Themes
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full transition ${
          open ? "bg-white text-amber-700" : "bg-amber-100 text-amber-700"
        }`}>
          {selectedThemes.length > 0 ? `${selectedThemes.length}/${MAX_THEMES}` : "250+"}
        </span>
        <svg
          width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 top-full mt-2 left-0 w-[360px] bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden">
          {/* Popover header */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100 bg-amber-50/60">
            <p className="text-[11px] font-bold text-amber-800">
              250+ themes available
              {selectedThemes.length > 0 && (
                <span className={selectedThemes.length >= MAX_THEMES ? " · text-red-500" : " · text-amber-600"}>
                  {` · ${selectedThemes.length}/${MAX_THEMES} selected`}
                </span>
              )}
            </p>
          </div>
          {/* Search */}
          <div className="px-2 py-2 border-b border-gray-100">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 text-xs border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 bg-white"
              />
            </div>
          </div>
          {/* Grid */}
          <div className="max-h-[240px] overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">No themes match</p>
            ) : (
              <div className="grid grid-cols-4 gap-1.5">
                {filtered.map((theme) => {
                  const idx = THEMES.indexOf(theme);
                  const isSelected = selectedThemes.some((t) => t.id === theme.id);
                  const isDisabled = !isSelected && selectedThemes.length >= MAX_THEMES;
                  return (
                    <ThemeCard
                      key={theme.id}
                      theme={theme}
                      idx={idx}
                      isSelected={isSelected}
                      isDisabled={isDisabled}
                      onClick={() => onToggle(theme, idx)}
                    />
                  );
                })}
              </div>
            )}
          </div>
          {/* Footer */}
          <div className="px-3 py-2 border-t border-gray-100 bg-gray-50/60">
            <button
              onClick={() => { setOpen(false); setSearch(""); }}
              className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ThemeDisplayOptionsContent() {
  const [activeOption, setActiveOption] = useState<number>(1);
  const [selectedThemes, setSelectedThemes] = useState<Theme[]>([]);

  const toggle = (theme: Theme) => {
    setSelectedThemes((prev) => {
      if (prev.some((t) => t.id === theme.id)) {
        return prev.filter((t) => t.id !== theme.id);
      }
      if (prev.length >= MAX_THEMES) return prev;
      return [...prev, theme];
    });
  };

  const handleToggle = (theme: Theme, _idx?: number) => toggle(theme);

  const clearAll = () => setSelectedThemes([]);

  return (
    <main className="flex-1 p-6 min-w-0 space-y-8 max-w-4xl">

      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Theme Display Options</h1>
        <p className="text-sm text-gray-500 mt-1">
          Five different UI patterns for browsing and selecting themes. Pick one below to try it out — all options share the same selection state.
        </p>
      </div>

      {/* ── Option selector cards ── */}
      <div className="grid grid-cols-5 gap-3">
        {OPTION_META.map((opt) => {
          const isActive = activeOption === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setActiveOption(opt.id)}
              className={`relative flex flex-col items-start gap-2 p-3 rounded-2xl border-2 text-left transition-all ${
                isActive
                  ? "border-amber-400 bg-amber-50 shadow-md shadow-amber-100"
                  : "border-gray-100 bg-white hover:border-amber-200 hover:shadow-sm"
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isActive ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {opt.icon}
              </div>
              <div>
                <p className={`text-[11px] font-bold leading-tight ${isActive ? "text-amber-800" : "text-gray-800"}`}>
                  <span className={`text-[9px] font-bold mr-1 px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-amber-200 text-amber-800" : "bg-gray-100 text-gray-500"
                  }`}>{opt.id}</span>
                  {opt.label}
                </p>
                <p className={`text-[9px] mt-1 leading-snug ${isActive ? "text-amber-700/70" : "text-gray-400"}`}>
                  {opt.desc}
                </p>
              </div>
              {isActive && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                  <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Demo area ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-visible">
        {/* Demo header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
              {OPTION_META[activeOption - 1].icon}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                Option {activeOption}: {OPTION_META[activeOption - 1].label}
              </p>
              <p className="text-[11px] text-gray-400">{OPTION_META[activeOption - 1].desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            {selectedThemes.length > 0 && (
              <button
                onClick={clearAll}
                className="text-red-400 hover:text-red-600 font-semibold transition"
              >
                Clear all
              </button>
            )}
            <span className="text-gray-400">Try selecting themes below</span>
          </div>
        </div>

        {/* Demo body */}
        <div className="p-5 overflow-visible">
          {activeOption === 1 && <Option1 selectedThemes={selectedThemes} onToggle={handleToggle} />}
          {activeOption === 2 && <Option2 selectedThemes={selectedThemes} onToggle={handleToggle} />}
          {activeOption === 3 && <Option3 selectedThemes={selectedThemes} onToggle={handleToggle} />}
          {activeOption === 4 && <Option4 selectedThemes={selectedThemes} onToggle={handleToggle} />}
          {activeOption === 5 && <Option5 selectedThemes={selectedThemes} onToggle={handleToggle} />}
        </div>
      </div>

      {/* ── Selected themes summary ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-gray-900">
            Selected Themes
            <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              selectedThemes.length >= MAX_THEMES
                ? "bg-red-100 text-red-600"
                : selectedThemes.length > 0
                ? "bg-amber-100 text-amber-700"
                : "bg-gray-100 text-gray-400"
            }`}>
              {selectedThemes.length}/{MAX_THEMES}
            </span>
          </p>
          {selectedThemes.length >= MAX_THEMES && (
            <span className="text-[10px] font-semibold text-red-500">Max reached</span>
          )}
        </div>

        {selectedThemes.length === 0 ? (
          <p className="text-xs text-gray-400 py-2">
            No themes selected yet. Use any option above to pick themes.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedThemes.map((t) => (
              <ThemeChip
                key={t.id}
                label={t.label}
                onRemove={() => setSelectedThemes((prev) => prev.filter((x) => x.id !== t.id))}
              />
            ))}
          </div>
        )}

        {selectedThemes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Switch between options — your selection is preserved.
            </p>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition shadow-sm">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Use in Theme Remix
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
