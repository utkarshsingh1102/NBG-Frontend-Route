"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { games as allGames, POPULAR_COMBOS, Game, Theme, thumbSquare } from "@/lib/mockData";
import GameGrid from "./GameGrid";
import ThemeSelectModal from "./ThemeSelectModal";
import RandomRemixGenerator from "./RandomRemixGenerator";

interface ThemeRemixContentProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

const MAX_THEMES = 5;

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

// ── Theme Chip ────────────────────────────────────────────────────────────────
function ThemeChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-white/80 text-amber-900 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-amber-200">
      {label}
      <button onClick={onRemove} className="ml-0.5 hover:text-red-600 transition-colors flex-shrink-0">
        <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}

// ── Searchable Game Dropdown ──────────────────────────────────────────────────
function GameDropdown({
  value,
  onChange,
}: {
  value: Game | null;
  onChange: (game: Game) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return allGames;
    const q = search.toLowerCase();
    return allGames.filter((g) => g.title.toLowerCase().includes(q));
  }, [search]);

  // Close on outside click
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
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 bg-white rounded-2xl border-2 border-dashed border-amber-200 hover:border-amber-400 px-3 py-2.5 transition-all group shadow-sm text-left"
      >
        {value ? (
          <>
            <img
              src={thumbSquare(value.title, value.category, allGames.indexOf(value))}
              alt={value.title}
              className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-semibold text-amber-600 mb-0.5">Source Game</p>
              <p className="text-[12px] font-bold text-gray-900 truncate">{value.title}</p>
              <p className="text-[9px] text-gray-400 group-hover:text-amber-600 transition">Tap to change →</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-amber-100 group-hover:bg-amber-200 flex items-center justify-center transition-colors flex-shrink-0">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h4M8 10v4M14 11h.01M17 13h.01M5 8h14a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-800">Source Game</p>
              <p className="text-[10px] text-gray-500">Search &amp; select a game</p>
            </div>
          </>
        )}
        <svg
          width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={2.5}
          className={`flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-30 top-full mt-1.5 w-full bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-100 bg-white sticky top-0">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search games..."
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 text-[12px] border border-amber-300 rounded-lg focus:outline-none focus:border-amber-500 bg-amber-50"
              />
            </div>
          </div>
          {/* List */}
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">No games found</p>
            ) : (
              filtered.map((game) => {
                const isSelected = value?.id === game.id;
                return (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => { onChange(game); setOpen(false); setSearch(""); }}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 text-left transition-colors ${
                      isSelected ? "bg-amber-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <img
                      src={thumbSquare(game.title, game.category, allGames.indexOf(game))}
                      alt={game.title}
                      className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-gray-800 truncate">{game.title}</p>
                      <p className="text-[10px] text-gray-400">{game.category}</p>
                    </div>
                    {isSelected && (
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ThemeRemixContent({ activeCategory, onCategoryChange }: ThemeRemixContentProps) {
  const [sourceGame, setSourceGame] = useState<Game | null>(null);
  const [selectedThemes, setSelectedThemes] = useState<Theme[]>([]);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [customError, setCustomError] = useState("");
  const [validating, setValidating] = useState(false);
  const [toast, setToast] = useState(false);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return allGames;
    return allGames.filter((g) => g.category === activeCategory);
  }, [activeCategory]);

  const publishedCount = allGames.filter((g) => g.status === "published").length;

  const getGame = (id: string) => allGames.find((g) => g.id === id) ?? null;

  const removeTheme = (id: string) =>
    setSelectedThemes((prev) => prev.filter((t) => t.id !== id));

  const handleAddCustom = async () => {
    if (selectedThemes.length >= MAX_THEMES) {
      setCustomError(`Maximum ${MAX_THEMES} themes already selected.`);
      return;
    }
    setCustomError("");
    setValidating(true);
    const result = await validateCustomTheme(customInput);
    setValidating(false);
    if (!result.valid) {
      setCustomError(result.error ?? "Invalid theme.");
      return;
    }
    const label = customInput.trim();
    if (selectedThemes.some((t) => t.label.toLowerCase() === label.toLowerCase())) {
      setCustomError("This theme is already added.");
      return;
    }
    setSelectedThemes((prev) => [...prev, { id: `custom-${Date.now()}`, label }]);
    setCustomInput("");
  };

  const handleGenerate = () => {
    setToast(true);
    setTimeout(() => {
      setToast(false);
      setSourceGame(null);
      setSelectedThemes([]);
      setCustomInput("");
      setCustomError("");
    }, 2000);
  };

  const canGenerate = !!sourceGame && selectedThemes.length > 0;

  return (
    <>
      <main className="flex-1 p-6 min-w-0 space-y-14">

        {/* ── SECTION 1: Popular Theme Combos ── */}
        <section className="bg-white rounded-2xl p-5 border border-gray-100 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center shadow-sm shadow-amber-200">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Popular Theme Combos</h2>
                <p className="text-[11px] text-amber-700/70">Click any combo to auto-select the source game</p>
              </div>
            </div>
            <button className="text-xs text-amber-600 font-semibold hover:text-amber-700 transition bg-white/70 px-3 py-1.5 rounded-lg border border-amber-200 hover:bg-white">View all →</button>
          </div>
          <div className="flex items-stretch gap-0 overflow-x-auto pb-1 scrollbar-hide" style={{ flexWrap: "nowrap" }}>
            {POPULAR_COMBOS.map((combo, idx) => {
              const g1 = getGame(combo.game1Id);
              const g2 = getGame(combo.game2Id);
              if (!g1 || !g2) return null;
              const i1 = allGames.indexOf(g1);
              const i2 = allGames.indexOf(g2);
              const prevGroup = idx > 0 ? POPULAR_COMBOS[idx - 1].group : null;
              const isNewGroup = prevGroup !== null && prevGroup !== combo.group;
              return (
                <div key={`${combo.game1Id}-${combo.game2Id}`} className="flex items-stretch gap-0 flex-shrink-0">
                  {isNewGroup && (
                    <div className="flex items-center px-3">
                      <div className="w-px h-[80%] bg-gray-200 rounded-full" />
                    </div>
                  )}
                  <button
                    onClick={() => setSourceGame(g1)}
                    className="bg-white border border-gray-100 rounded-xl p-3 mx-1 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100 transition-all group w-fit flex flex-col items-center"
                  >
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{combo.group}</span>
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 ring-1 ring-gray-100 flex-shrink-0">
                        <img src={thumbSquare(g1.title, g1.category, i1)} alt={g1.title} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="flex items-center justify-center flex-shrink-0">
                        <span className="text-[7px] font-bold text-amber-500 bg-amber-50 px-1 py-0.5 rounded">VS</span>
                      </div>
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 ring-1 ring-gray-100 flex-shrink-0">
                        <img src={thumbSquare(g2.title, g2.category, i2)} alt={g2.title} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    </div>
                    <p className="text-[10px] font-bold text-gray-800 text-center break-words group-hover:text-amber-700 transition-colors leading-snug max-w-[10rem]">
                      {combo.label}
                    </p>
                    <p className="text-[9px] text-gray-400 text-center break-words mt-0.5 leading-snug max-w-[10rem]">{g1.title} · {g2.title}</p>
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SECTION 2: Select Game and Theme ── */}
        <section className="bg-gradient-to-br from-amber-50 via-amber-100 to-orange-100 rounded-2xl p-6 shadow-lg shadow-amber-100/60 border border-amber-200/60">
          {/* Header */}
          <div className="mb-5 text-center">
            <h1 className="text-xl font-bold text-gray-900">Select Game and Theme</h1>
            <p className="text-gray-500 text-xs mt-0.5">Choose a source game, add themes, then generate</p>
          </div>

          <div className="flex gap-4 justify-center items-start flex-wrap">
            {/* ── Source Game Dropdown ── */}
            <div className="w-[200px] flex-shrink-0">
              <GameDropdown value={sourceGame} onChange={setSourceGame} />
            </div>

            {/* ── Arrow ── */}
            <div className="flex items-center h-[60px]">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="rgba(0,0,0,0.3)" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>

            {/* ── Theme Selection ── */}
            <div className="flex-1 min-w-[260px] max-w-[420px] bg-white/80 rounded-2xl border border-amber-100 p-4 shadow-sm">
              {/* Header row */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  Themes
                </p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedThemes.length >= MAX_THEMES
                    ? "bg-red-100 text-red-600"
                    : "bg-amber-100 text-amber-700"
                }`}>
                  {selectedThemes.length}/{MAX_THEMES}
                </span>
              </div>

              {/* Selected chips */}
              {selectedThemes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {selectedThemes.map((t) => (
                    <ThemeChip key={t.id} label={t.label} onRemove={() => removeTheme(t.id)} />
                  ))}
                </div>
              )}

              {/* Browse button */}
              <button
                onClick={() => setThemeModalOpen(true)}
                disabled={selectedThemes.length >= MAX_THEMES}
                className="flex items-center justify-between w-full px-4 py-3 text-sm font-bold text-white bg-amber-500 border border-amber-400 rounded-xl hover:bg-amber-600 hover:border-amber-500 disabled:opacity-40 disabled:cursor-not-allowed transition mb-3 group shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <span>Browse Themes</span>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-white px-2.5 py-1 rounded-full">
                  250+ available
                </span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-px bg-amber-100" />
                <span className="text-[10px] text-gray-400 font-medium">or custom</span>
                <div className="flex-1 h-px bg-amber-100" />
              </div>

              {/* Custom input */}
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. Volcano, Circus..."
                  value={customInput}
                  onChange={(e) => { setCustomInput(e.target.value); setCustomError(""); }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddCustom(); }}
                  disabled={selectedThemes.length >= MAX_THEMES}
                  className={`flex-1 px-2.5 py-1.5 text-[11px] border rounded-lg focus:outline-none transition min-w-0 ${
                    customError ? "border-red-400 bg-red-50" : "border-amber-200 focus:border-amber-400 bg-white"
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                />
                <button
                  onClick={handleAddCustom}
                  disabled={!customInput.trim() || selectedThemes.length >= MAX_THEMES || validating}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 text-white text-[11px] font-semibold rounded-lg transition flex items-center gap-1 flex-shrink-0"
                >
                  {validating ? (
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="animate-spin">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : "Add"}
                </button>
              </div>
              {customError && (
                <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                  <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {customError}
                </p>
              )}
            </div>
          </div>

          {/* Generate Now button */}
          <div className="mt-5 flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl transition shadow-md ${
                canGenerate
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-300/50 cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Now
            </button>
          </div>
        </section>

        {/* ── Toast ── */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-xl animate-fade-in">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Game remix generation started successfully.
          </div>
        )}

        {/* ── Random Remix Generator ── */}
        <RandomRemixGenerator totalThemes={60} />

        {/* ── SECTION 3: My Discovered Games ── */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">My Discovered Games</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                <span className="text-amber-600 font-semibold">{publishedCount}</span> published ·{" "}
                <span className="text-gray-500 font-medium">{allGames.length - publishedCount}</span> drafts ·{" "}
                <span className="font-medium text-gray-600">{filtered.length} showing</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Import
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition shadow-sm">
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New Game
              </button>
            </div>
          </div>
          <GameGrid games={filtered} />
        </section>
      </main>

      {/* Theme select modal */}
      {themeModalOpen && (
        <ThemeSelectModal
          selectedIds={selectedThemes.map((t) => t.id)}
          onConfirm={(themes) => { setSelectedThemes(themes); setThemeModalOpen(false); }}
          onClose={() => setThemeModalOpen(false)}
        />
      )}
    </>
  );
}
