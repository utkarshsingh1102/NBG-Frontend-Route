"use client";

import { useMemo, useState } from "react";
import { games as allGames, POPULAR_COMBOS, Game, thumbSquare } from "@/lib/mockData";
import GameGrid from "./GameGrid";
import RandomRemixGenerator from "./RandomRemixGenerator";

interface Props {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  userGames: Game[];
  onNavigateToAddGame: () => void;
}

const CATEGORIES = ["All", "Puzzle", "Casual", "Arcade", "Runner", "Match3", "Strategy", "Merge", "Idle", "Hypercasual", "Simulation"];
const COMBO_CATEGORIES = CATEGORIES;

// ── Option A Modal: category tabs below search, sections preserved but filtered ──
function SelectModal({
  slot,
  selectedId,
  selectedIds = [],
  multiSelect = false,
  userGames = [],
  onNavigateToAddGame,
  onSelect,
  onMultiSelect,
  onClose,
}: {
  slot: 1 | 2;
  selectedId?: string | null;
  selectedIds?: string[];
  multiSelect?: boolean;
  userGames?: Game[];
  onNavigateToAddGame?: () => void;
  onSelect?: (game: Game) => void;
  onMultiSelect?: (games: Game[]) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState<string[]>(selectedIds);
  const [userSectionOpen, setUserSectionOpen] = useState(true);
  const [systemSectionOpen, setSystemSectionOpen] = useState(true);
  const [modalCategory, setModalCategory] = useState("All");
  const MAX_TARGETS = 5;

  const allAvailable = useMemo(() => [...userGames, ...allGames], [userGames]);

  const searchFiltered = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return allAvailable.filter((g) => g.title.toLowerCase().includes(q));
  }, [search, allAvailable]);

  const systemFiltered = useMemo(() => {
    if (modalCategory === "All") return allGames;
    return allGames.filter((g) => g.category === modalCategory);
  }, [modalCategory]);

  const userFiltered = useMemo(() => {
    if (modalCategory === "All") return userGames;
    return userGames.filter((g) => g.category === modalCategory);
  }, [modalCategory, userGames]);

  const togglePending = (id: string) =>
    setPending((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length >= MAX_TARGETS
        ? prev
        : [...prev, id]
    );

  const isSelected = (g: Game) => (multiSelect ? pending.includes(g.id) : selectedId === g.id);
  const isDisabled = (g: Game) => multiSelect && !pending.includes(g.id) && pending.length >= MAX_TARGETS;

  function Card({ game }: { game: Game }) {
    const idx = userGames.includes(game) ? 100 + userGames.indexOf(game) : allGames.indexOf(game);
    const selected = isSelected(game);
    const disabled = isDisabled(game);
    return (
      <button
        onClick={() => { if (disabled) return; if (multiSelect) togglePending(game.id); else onSelect?.(game); }}
        className={`relative rounded-xl overflow-hidden transition-all duration-150 ${
          selected ? "ring-[3px] ring-amber-400 ring-offset-1 scale-[0.98]"
            : disabled ? "opacity-40 cursor-not-allowed"
            : "hover:scale-[1.03] hover:shadow-md"
        }`}
      >
        <div className="aspect-square bg-gray-100">
          <img src={thumbSquare(game.title, game.category, idx)} alt={game.title} loading="lazy" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-1.5 pt-6 pb-1.5">
          <p className="text-white text-[10px] font-semibold leading-tight truncate">{game.title}</p>
        </div>
        {userGames.includes(game) && (
          <span className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-none">YOURS</span>
        )}
        <div className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selected ? "bg-amber-400 border-amber-400" : "bg-white/70 border-white/80"}`}>
          {selected && <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{multiSelect ? "Select Target Games" : `Select ${slot === 1 ? "Source" : "Target"} Game`}</h2>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">Option A · Category tabs filter within sections</p>
          </div>
          <div className="flex items-center gap-2">
            {multiSelect && (
              <button onClick={() => onMultiSelect?.(allAvailable.filter((g) => pending.includes(g.id)))} className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition">
                Done ({pending.length} selected)
              </button>
            )}
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search games..." autoFocus value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border-2 rounded-xl focus:outline-none transition" style={{ borderColor: "#f59e0b" }} />
          </div>

          {/* ── Category Tabs (Option A key feature) ── */}
          {!search.trim() && (
            <div className="flex items-center gap-1.5 flex-wrap mt-3">
              {CATEGORIES.map((cat) => {
                const count = cat === "All" ? allGames.length : allGames.filter((g) => g.category === cat).length;
                return (
                  <button key={cat} onClick={() => setModalCategory(cat)}
                    className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border font-semibold transition-all ${
                      modalCategory === cat ? "bg-amber-500 text-white border-amber-500 shadow-sm" : "bg-white text-gray-500 border-gray-200 hover:border-amber-300 hover:text-amber-600"
                    }`}>
                    {cat}
                    <span className={`text-[9px] font-bold px-1 py-0.5 rounded-full leading-none ${modalCategory === cat ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          )}

          <p className="text-xs mt-2 text-gray-400">
            {search.trim()
              ? `${searchFiltered.length} result${searchFiltered.length !== 1 ? "s" : ""} found`
              : modalCategory === "All"
              ? `${allGames.length} system games · ${userGames.length} your game${userGames.length !== 1 ? "s" : ""}`
              : `${systemFiltered.length} ${modalCategory} games`}
            {multiSelect && pending.length > 0 && (
              <span className={pending.length >= MAX_TARGETS ? " · text-red-500 font-semibold" : " · text-gray-500"}>
                {` ${pending.length}/${MAX_TARGETS} selected`}{pending.length >= MAX_TARGETS && " · Max reached"}
              </span>
            )}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-6">
          {search.trim() ? (
            searchFiltered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <p className="text-sm">No games found for &quot;{search}&quot;</p>
                {onNavigateToAddGame && (
                  <button onClick={() => { onClose(); onNavigateToAddGame(); }} className="flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-sm font-semibold text-amber-700 transition">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Add &quot;{search}&quot; as a new game
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 px-6">{searchFiltered.map((g) => <Card key={g.id} game={g} />)}</div>
            )
          ) : (
            <>
              {/* Your Games — filtered by category */}
              <div>
                <button onClick={() => setUserSectionOpen((o) => !o)} className="flex items-center justify-between w-full px-6 py-3 bg-gray-50 hover:bg-gray-100 transition text-left border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Your Games</span>
                    <span className="text-[10px] bg-amber-100 text-amber-700 font-semibold px-1.5 py-0.5 rounded-full">{userFiltered.length}</span>
                    {modalCategory !== "All" && <span className="text-[9px] text-amber-500 font-medium">· {modalCategory} only</span>}
                  </div>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className={`text-gray-400 transition-transform ${userSectionOpen ? "rotate-180" : ""}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {userSectionOpen && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 px-6 pt-4 pb-2">
                    {userFiltered.map((g) => <Card key={g.id} game={g} />)}
                    {onNavigateToAddGame && (
                      <button onClick={() => { onClose(); onNavigateToAddGame(); }} className="relative rounded-xl overflow-hidden border-2 border-dashed border-amber-200 hover:border-amber-400 bg-amber-50 hover:bg-amber-100 flex flex-col items-center justify-center gap-1.5 aspect-square transition-all group">
                        <div className="w-8 h-8 rounded-lg bg-amber-200 group-hover:bg-amber-300 flex items-center justify-center"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#d97706" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg></div>
                        <p className="text-[9px] font-bold text-amber-700 text-center leading-tight px-1">Add a Game</p>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* System Games — filtered by category */}
              <div>
                <button onClick={() => setSystemSectionOpen((o) => !o)} className="flex items-center justify-between w-full px-6 py-3 bg-gray-50 hover:bg-gray-100 transition text-left border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">System Games</span>
                    <span className="text-[10px] bg-gray-200 text-gray-600 font-semibold px-1.5 py-0.5 rounded-full">{systemFiltered.length}</span>
                    {modalCategory !== "All" && <span className="text-[9px] text-amber-500 font-medium">· {modalCategory} only</span>}
                  </div>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className={`text-gray-400 transition-transform ${systemSectionOpen ? "rotate-180" : ""}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {systemSectionOpen && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 px-6 pt-4">
                    {systemFiltered.map((g) => <Card key={g.id} game={g} />)}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function GameFusionA({ activeCategory, onCategoryChange, userGames, onNavigateToAddGame }: Props) {
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const [targetModalOpen, setTargetModalOpen] = useState(false);
  const [sourceGame, setSourceGame] = useState<Game | null>(null);
  const [targetGames, setTargetGames] = useState<Game[]>([]);
  const [toast, setToast] = useState(false);
  const [comboCategory, setComboCategory] = useState("All");

  const filtered = useMemo(() => activeCategory === "All" ? allGames : allGames.filter((g) => g.category === activeCategory), [activeCategory]);
  const publishedCount = allGames.filter((g) => g.status === "published").length;
  const getGame = (id: string) => allGames.find((g) => g.id === id) ?? null;
  const removeTarget = (id: string) => setTargetGames((prev) => prev.filter((g) => g.id !== id));
  const handleGenerate = () => {
    setToast(true);
    setTimeout(() => { setToast(false); setSourceGame(null); setTargetGames([]); }, 2000);
  };

  return (
    <>
      <main className="flex-1 p-6 min-w-0 space-y-14">

        {/* Popular Combos */}
        <section className="bg-white rounded-2xl p-5 border border-gray-100 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center shadow-sm shadow-amber-200">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Popular Game Combos</h2>
                <p className="text-[11px] text-amber-700/70">Click any combo to auto-select both games</p>
              </div>
            </div>
            <button className="text-xs text-amber-600 font-semibold hover:text-amber-700 transition bg-white/70 px-3 py-1.5 rounded-lg border border-amber-200 hover:bg-white">View all →</button>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            {COMBO_CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setComboCategory(cat)}
                className={`text-[11px] px-3 py-1 rounded-full border font-semibold transition-all ${comboCategory === cat ? "bg-amber-500 text-white border-amber-500 shadow-sm" : "bg-white text-gray-500 border-gray-200 hover:border-amber-300 hover:text-amber-600"}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-stretch gap-0 overflow-x-auto pb-1 scrollbar-hide" style={{ flexWrap: "nowrap" }}>
            {POPULAR_COMBOS.filter((c) => comboCategory === "All" || c.group === comboCategory).map((combo, idx, arr) => {
              const g1 = getGame(combo.game1Id); const g2 = getGame(combo.game2Id);
              if (!g1 || !g2) return null;
              const i1 = allGames.indexOf(g1); const i2 = allGames.indexOf(g2);
              const prevGroup = idx > 0 ? arr[idx - 1].group : null;
              const isNewGroup = prevGroup !== null && prevGroup !== combo.group;
              return (
                <div key={`${combo.game1Id}-${combo.game2Id}`} className="flex items-stretch gap-0 flex-shrink-0">
                  {isNewGroup && <div className="flex items-center px-3"><div className="w-px h-[80%] bg-gray-200 rounded-full" /></div>}
                  <button onClick={() => { setSourceGame(g1); setTargetGames([g2]); }}
                    className="bg-white border border-gray-100 rounded-xl p-3 mx-1 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100 transition-all group w-fit flex flex-col items-center">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{combo.group}</span>
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100"><img src={thumbSquare(g1.title, g1.category, i1)} alt={g1.title} className="w-full h-full object-cover" loading="lazy" /></div>
                      <span className="text-[7px] font-bold text-amber-500 bg-amber-50 px-1 py-0.5 rounded">VS</span>
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100"><img src={thumbSquare(g2.title, g2.category, i2)} alt={g2.title} className="w-full h-full object-cover" loading="lazy" /></div>
                    </div>
                    <p className="text-[10px] font-bold text-gray-800 text-center group-hover:text-amber-700 leading-snug max-w-[10rem]">{combo.label}</p>
                    <p className="text-[9px] text-gray-400 text-center mt-0.5 leading-snug max-w-[10rem]">{g1.title} · {g2.title}</p>
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Select Game */}
        <section className="bg-gradient-to-br from-amber-50 via-amber-100 to-orange-100 rounded-2xl p-6 shadow-lg shadow-amber-100/60 border border-amber-200/60">
          <div className="mb-4 text-center">
            <h1 className="text-xl font-bold text-gray-900">Select Game or App</h1>
            <p className="text-gray-500 text-xs mt-0.5">Pick a source game, then add one or more target games to compare</p>
          </div>
          <div className="flex gap-3 h-[120px] justify-center items-center">
            <button onClick={() => setSourceModalOpen(true)} className="w-[120px] flex-shrink-0 h-full rounded-2xl border-2 border-dashed border-amber-200 bg-white hover:border-amber-400 transition-all group overflow-hidden shadow-sm">
              {sourceGame ? (
                <div className="flex flex-col items-center justify-center h-full gap-1.5 px-2">
                  <img src={thumbSquare(sourceGame.title, sourceGame.category, allGames.indexOf(sourceGame))} alt={sourceGame.title} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="text-center w-full"><p className="text-[9px] font-semibold text-amber-600 mb-0.5">Source</p><p className="text-[11px] font-bold text-gray-900 truncate">{sourceGame.title}</p><span className="text-[9px] text-gray-400 group-hover:text-amber-600 transition">Tap to change →</span></div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 group-hover:bg-amber-200 flex items-center justify-center transition-colors"><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12h4M8 10v4M14 11h.01M17 13h.01M5 8h14a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2z" /></svg></div>
                  <div className="text-center"><p className="text-xs font-semibold text-gray-800">Source Game</p><p className="text-[10px] text-gray-500">Choose base game</p></div>
                </div>
              )}
            </button>
            <div className="flex items-center flex-shrink-0 px-1"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="rgba(0,0,0,0.3)" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></div>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {targetGames.map((game) => (
                <div key={game.id} className="relative flex-shrink-0 w-[120px] h-[120px] rounded-2xl overflow-hidden border border-amber-200 shadow-sm group/card">
                  <img src={thumbSquare(game.title, game.category, allGames.indexOf(game))} alt={game.title} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <p className="absolute bottom-1.5 left-0 right-0 text-white text-[9px] font-semibold text-center px-1 truncate">{game.title}</p>
                  <button onClick={() => removeTarget(game.id)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-red-500">
                    <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              <button onClick={() => setTargetModalOpen(true)} className="flex-shrink-0 w-[120px] h-[120px] rounded-2xl border-2 border-dashed border-amber-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 flex flex-col items-center justify-center gap-1.5 transition-all group shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-amber-100 group-hover:bg-amber-200 flex items-center justify-center"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg></div>
                <p className="text-[10px] font-semibold text-gray-700 group-hover:text-amber-700 text-center leading-tight">{targetGames.length === 0 ? "Add Target" : "Add More"}</p>
              </button>
            </div>
          </div>
          <div className="mt-5 flex justify-center">
            <button onClick={handleGenerate} className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition shadow-md">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Generate Now
            </button>
          </div>
        </section>

        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-xl animate-fade-in">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2.5} className="animate-spin"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Generating the Idea...
          </div>
        )}

        <RandomRemixGenerator />

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">My Discovered Games</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                <span className="text-amber-600 font-semibold">{publishedCount}</span> published · <span className="text-gray-500 font-medium">{allGames.length - publishedCount}</span> drafts · <span className="font-medium text-gray-600">{filtered.length} showing</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>Import</button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition shadow-sm"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>New Game</button>
            </div>
          </div>
          <GameGrid games={filtered} />
        </section>
      </main>

      {sourceModalOpen && <SelectModal slot={1} selectedId={sourceGame?.id} userGames={userGames} onNavigateToAddGame={() => { setSourceModalOpen(false); onNavigateToAddGame(); }} onSelect={(g) => { setSourceGame(g); setSourceModalOpen(false); }} onClose={() => setSourceModalOpen(false)} />}
      {targetModalOpen && <SelectModal slot={2} selectedIds={targetGames.map((g) => g.id)} multiSelect userGames={userGames} onNavigateToAddGame={() => { setTargetModalOpen(false); onNavigateToAddGame(); }} onMultiSelect={(gs) => { setTargetGames(gs); setTargetModalOpen(false); }} onClose={() => setTargetModalOpen(false)} />}
    </>
  );
}
