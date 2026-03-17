"use client";

import { useMemo, useState, useEffect } from "react";
import { games as allGames, POPULAR_COMBOS, Game, thumbSquare } from "@/lib/mockData";
import GameGrid from "./GameGrid";
import GameSelectModal from "./GameSelectModal";
import RandomRemixGenerator from "./RandomRemixGenerator";

interface MainContentProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  userGames: Game[];
  onNavigateToAddGame: () => void;
}


export default function MainContent({ activeCategory, onCategoryChange, userGames, onNavigateToAddGame }: MainContentProps) {
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const [targetModalOpen, setTargetModalOpen] = useState(false);
  const [sourceGame, setSourceGame] = useState<Game | null>(null);
  const [targetGames, setTargetGames] = useState<Game[]>([]);
  const [toast, setToast] = useState(false);

  const handleGenerate = () => {
    setToast(true);
    setTimeout(() => {
      setToast(false);
      setSourceGame(null);
      setTargetGames([]);
    }, 2000);
  };

  const filtered = useMemo(() => {
    if (activeCategory === "All") return allGames;
    return allGames.filter((g) => g.category === activeCategory);
  }, [activeCategory]);

  const publishedCount = allGames.filter((g) => g.status === "published").length;

  const getGame = (id: string) => allGames.find((g) => g.id === id) ?? null;

  const removeTarget = (id: string) => setTargetGames((prev) => prev.filter((g) => g.id !== id));

  return (
    <>
      <main className="flex-1 p-6 min-w-0 space-y-14">

        {/* ── SECTION 1: Popular Game Combos ── */}
        <section className="bg-white rounded-2xl p-5 border border-gray-100 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center shadow-sm shadow-amber-200">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Popular Game Combos</h2>
                <p className="text-[11px] text-amber-700/70">Click any combo to auto-select both games</p>
              </div>
            </div>
            <button className="text-xs text-amber-600 font-semibold hover:text-amber-700 transition bg-white/70 px-3 py-1.5 rounded-lg border border-amber-200 hover:bg-white">View all →</button>
          </div>
          <div className="flex items-stretch gap-0 overflow-x-auto pb-1 scrollbar-hide" style={{flexWrap: "nowrap"}}>
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
                  {/* Group separator */}
                  {isNewGroup && (
                    <div className="flex items-center px-3">
                      <div className="w-px h-[80%] bg-gray-200 rounded-full" />
                    </div>
                  )}
                  <button
                    onClick={() => { setSourceGame(g1); setTargetGames([g2]); }}
                    className="bg-white border border-gray-100 rounded-xl p-3 mx-1 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100 transition-all group w-fit flex flex-col items-center"
                  >
                    {/* Group tag */}
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

        {/* ── SECTION 2: Select Game or App ── */}
        <section className="bg-gradient-to-br from-amber-50 via-amber-100 to-orange-100 rounded-2xl p-6 shadow-lg shadow-amber-100/60 border border-amber-200/60">
          {/* Header */}
          <div className="mb-4 text-center">
            <h1 className="text-xl font-bold text-gray-900">Select Game or App</h1>
            <p className="text-gray-500 text-xs mt-0.5">Pick a source game, then add one or more target games to compare</p>
          </div>

          <div className="flex gap-3 h-[120px] justify-center items-center">
            {/* ── Source Game (single) ── */}
            <button
              onClick={() => setSourceModalOpen(true)}
              className="w-[120px] flex-shrink-0 h-full rounded-2xl border-2 border-dashed border-amber-200 bg-white hover:border-amber-400 transition-all group overflow-hidden shadow-sm"
            >
              {sourceGame ? (
                <div className="flex flex-col items-center justify-center h-full gap-1.5 px-2">
                  <img
                    src={thumbSquare(sourceGame.title, sourceGame.category, allGames.indexOf(sourceGame))}
                    alt={sourceGame.title}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="text-center min-w-0 w-full">
                    <p className="text-[9px] font-semibold text-amber-600 mb-0.5">Source</p>
                    <p className="text-[11px] font-bold text-gray-900 truncate">{sourceGame.title}</p>
                    <span className="text-[9px] text-gray-400 group-hover:text-amber-600 transition">Tap to change →</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 group-hover:bg-amber-200 flex items-center justify-center transition-colors">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h4M8 10v4M14 11h.01M17 13h.01M5 8h14a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-gray-800">Source Game</p>
                    <p className="text-[10px] text-gray-500">Choose base game</p>
                  </div>
                </div>
              )}
            </button>

            {/* ── Arrow divider ── */}
            <div className="flex items-center flex-shrink-0 px-1">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="rgba(0,0,0,0.3)" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>

            {/* ── Target Games (multiple) ── */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {targetGames.map((game) => (
                <div key={game.id} className="relative flex-shrink-0 w-[120px] h-[120px] rounded-2xl overflow-hidden border border-amber-200 shadow-sm group/card">
                  <img
                    src={thumbSquare(game.title, game.category, allGames.indexOf(game))}
                    alt={game.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <p className="absolute bottom-1.5 left-0 right-0 text-white text-[9px] font-semibold text-center px-1 leading-tight truncate">
                    {game.title}
                  </p>
                  <button
                    onClick={() => removeTarget(game.id)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Add target button */}
              <button
                onClick={() => setTargetModalOpen(true)}
                className="flex-shrink-0 w-[120px] h-[120px] rounded-2xl border-2 border-dashed border-amber-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 flex flex-col items-center justify-center gap-1.5 transition-all group shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 group-hover:bg-amber-200 flex items-center justify-center transition-colors">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-[10px] font-semibold text-gray-700 group-hover:text-amber-700 transition-colors text-center leading-tight">
                  {targetGames.length === 0 ? "Add Target" : "Add More"}
                </p>
              </button>
            </div>
          </div>

          {/* Generate Now button */}
          <div className="mt-5 flex justify-center">
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition shadow-md"
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
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2.5} className="animate-spin">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generating the Idea...
          </div>
        )}

        {/* ── Random Remix Generator ── */}
        <RandomRemixGenerator />

        {/* ── SECTION 3: My Discovered Games ── */}
        <section>
          {/* Section header */}
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

          {/* Game grid */}
          <GameGrid games={filtered} />
        </section>
      </main>

      {/* Source modal — single select */}
      {sourceModalOpen && (
        <GameSelectModal
          slot={1}
          selectedId={sourceGame?.id ?? null}
          userGames={userGames}
          onNavigateToAddGame={() => { setSourceModalOpen(false); onNavigateToAddGame(); }}
          onSelect={(game) => { setSourceGame(game); setSourceModalOpen(false); }}
          onClose={() => setSourceModalOpen(false)}
        />
      )}

      {/* Target modal — multi select */}
      {targetModalOpen && (
        <GameSelectModal
          slot={2}
          selectedIds={targetGames.map((g) => g.id)}
          multiSelect
          userGames={userGames}
          onNavigateToAddGame={() => { setTargetModalOpen(false); onNavigateToAddGame(); }}
          onMultiSelect={(games) => { setTargetGames(games); setTargetModalOpen(false); }}
          onClose={() => setTargetModalOpen(false)}
        />
      )}
    </>
  );
}
