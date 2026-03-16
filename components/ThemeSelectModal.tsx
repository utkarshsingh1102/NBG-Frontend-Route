"use client";

import { useState, useMemo } from "react";
import { THEMES, Theme } from "@/lib/mockData";

interface ThemeSelectModalProps {
  selectedIds: string[];
  onConfirm: (themes: Theme[]) => void;
  onClose: () => void;
}

const MAX_THEMES = 10;

const GENRES = [
  "Transport",
  "Nature",
  "Food & Drink",
  "Fantasy & Sci-Fi",
  "Action",
  "Lifestyle",
  "Objects",
];

const PRONOUNS = new Set([
  "i","me","my","mine","myself","you","your","yours","yourself","he","him","his","himself",
  "she","her","hers","herself","it","its","itself","we","us","our","ours","ourselves",
  "they","them","their","theirs","themselves","this","that","these","those",
  "who","whom","whose","which","what",
]);

async function validateCustomTheme(input: string): Promise<{ valid: boolean; error?: string }> {
  const word = input.trim().toLowerCase();
  if (!word) return { valid: false, error: "Please enter a theme." };
  if (word.length < 2) return { valid: false, error: "Too short — enter a real word or concept." };
  if (!/^[a-z\s/'-]+$/i.test(word)) return { valid: false, error: "Letters only, please." };
  if (PRONOUNS.has(word)) return { valid: false, error: `"${input}" is a pronoun — enter a noun or concept.` };
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.split(" ")[0])}`
    );
    if (!res.ok) return { valid: false, error: `"${input}" doesn't appear to be a real word.` };
    return { valid: true };
  } catch {
    return { valid: true };
  }
}

function ThemeCard({
  theme, isSelected, isDisabled, onToggle,
}: {
  theme: Theme; isSelected: boolean; isDisabled: boolean; onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={isDisabled}
      className={`relative rounded-xl overflow-hidden group transition-all duration-150 flex flex-col items-center p-2 border-2 ${
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
      <p className={`text-[11px] font-semibold text-center leading-tight ${
        isSelected ? "text-amber-700" : "text-gray-700"
      }`}>
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

export default function ThemeSelectModal({ selectedIds, onConfirm, onClose }: ThemeSelectModalProps) {
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState<string[]>(selectedIds);
  const [activeGenres, setActiveGenres] = useState<Set<string>>(new Set());
  const [customThemes, setCustomThemes] = useState<Theme[]>([]);
  const [validating, setValidating] = useState(false);
  const [addError, setAddError] = useState("");

  const allThemes = useMemo(() => [...THEMES, ...customThemes], [customThemes]);

  const filtered = useMemo(() => {
    let list = allThemes;
    if (activeGenres.size > 0) {
      list = list.filter((t) => t.genre && activeGenres.has(t.genre));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.label.toLowerCase().includes(q));
    }
    return list;
  }, [allThemes, search, activeGenres]);

  const exactMatch = useMemo(() => {
    const q = search.trim().toLowerCase();
    return !!q && allThemes.some((t) => t.label.toLowerCase() === q);
  }, [allThemes, search]);

  const toggle = (id: string) => {
    setPending((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_THEMES) return prev;
      return [...prev, id];
    });
  };

  const toggleGenre = (genre: string) => {
    setActiveGenres((prev) => {
      const next = new Set(prev);
      if (next.has(genre)) next.delete(genre);
      else next.add(genre);
      return next;
    });
  };

  const handleAddFromSearch = async () => {
    const label = search.trim();
    if (!label || pending.length >= MAX_THEMES) return;
    setAddError("");
    setValidating(true);
    const result = await validateCustomTheme(label);
    setValidating(false);
    if (!result.valid) {
      setAddError(result.error ?? "Invalid theme.");
      return;
    }
    const newTheme: Theme = { id: `custom-${Date.now()}`, label, emoji: "✨" };
    setCustomThemes((prev) => [...prev, newTheme]);
    setPending((prev) => [...prev, newTheme.id]);
    setSearch("");
    setAddError("");
  };

  const handleConfirm = () => {
    onConfirm(allThemes.filter((t) => pending.includes(t.id)));
  };

  const showingGrouped = activeGenres.size === 0 && !search.trim();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Browse Themes</h2>
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
        <div className="px-6 pt-4 pb-2">
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
              onChange={(e) => { setSearch(e.target.value); setAddError(""); }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filtered.length === 0 && search.trim() && !exactMatch) {
                  handleAddFromSearch();
                }
              }}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border-2 rounded-xl focus:outline-none transition"
              style={{ borderColor: "#f59e0b" }}
            />
          </div>
          <p className="text-xs mt-1.5">
            <span className="text-gray-400">
              {allThemes.length} themes available{search.trim() && ` · ${filtered.length} matching`}
            </span>
            {pending.length > 0 && (
              <span className={pending.length >= MAX_THEMES ? " · text-red-500 font-semibold" : " · text-gray-500"}>
                {` ${pending.length}/${MAX_THEMES} selected`}
                {pending.length >= MAX_THEMES && " · Max reached"}
              </span>
            )}
          </p>
        </div>

        {/* Genre filter checkboxes */}
        <div className="px-6 pb-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {GENRES.map((genre) => {
              const active = activeGenres.has(genre);
              return (
                <label key={genre} className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleGenre(genre)}
                    className="w-3.5 h-3.5 accent-amber-500 rounded"
                  />
                  <span className={`text-[11px] font-semibold ${active ? "text-amber-700" : "text-gray-500"}`}>
                    {genre}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Theme grid */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="mb-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm">No themes match your search</p>
              {search.trim() && !exactMatch && pending.length < MAX_THEMES && (
                <button
                  onClick={handleAddFromSearch}
                  disabled={validating}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition shadow-sm"
                >
                  {validating ? (
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="animate-spin">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                  Add &ldquo;{search.trim()}&rdquo;
                </button>
              )}
              {addError && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {addError}
                </p>
              )}
            </div>
          ) : showingGrouped ? (
            /* Grouped by genre when no filters/search active */
            <div className="space-y-5">
              {GENRES.map((genre) => {
                const genreThemes = filtered.filter((t) => t.genre === genre);
                if (genreThemes.length === 0) return null;
                return (
                  <div key={genre}>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{genre}</p>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      {genreThemes.map((theme) => (
                        <ThemeCard
                          key={theme.id}
                          theme={theme}
                          isSelected={pending.includes(theme.id)}
                          isDisabled={!pending.includes(theme.id) && pending.length >= MAX_THEMES}
                          onToggle={() => toggle(theme.id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
              {customThemes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Custom</p>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {customThemes.map((theme) => (
                      <ThemeCard
                        key={theme.id}
                        theme={theme}
                        isSelected={pending.includes(theme.id)}
                        isDisabled={!pending.includes(theme.id) && pending.length >= MAX_THEMES}
                        onToggle={() => toggle(theme.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Flat grid when filtering/searching */
            <div className="grid grid-cols-5 gap-3">
              {filtered.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isSelected={pending.includes(theme.id)}
                  isDisabled={!pending.includes(theme.id) && pending.length >= MAX_THEMES}
                  onToggle={() => toggle(theme.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
