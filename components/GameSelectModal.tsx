"use client";

import { useState, useMemo } from "react";
import { games, Game, thumbSquare } from "@/lib/mockData";

interface GameSelectModalProps {
  slot: 1 | 2;
  selectedId?: string | null;
  selectedIds?: string[];
  multiSelect?: boolean;
  userGames?: Game[];
  onNavigateToAddGame?: () => void;
  onSelect?: (game: Game) => void;
  onMultiSelect?: (games: Game[]) => void;
  onClose: () => void;
}

export default function GameSelectModal({
  slot,
  selectedId,
  selectedIds = [],
  multiSelect = false,
  userGames = [],
  onNavigateToAddGame,
  onSelect,
  onMultiSelect,
  onClose,
}: GameSelectModalProps) {
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState<string[]>(selectedIds);
  const [userSectionOpen, setUserSectionOpen] = useState(true);
  const [systemSectionOpen, setSystemSectionOpen] = useState(true);

  const MAX_TARGETS = 5;

  const allAvailableGames = useMemo(() => [...userGames, ...games], [userGames]);

  const filtered = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return allAvailableGames.filter((g) => g.title.toLowerCase().includes(q));
  }, [search, allAvailableGames]);

  const togglePending = (id: string) => {
    setPending((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_TARGETS) return prev;
      return [...prev, id];
    });
  };

  const handleConfirm = () => {
    if (onMultiSelect) {
      onMultiSelect(allAvailableGames.filter((g) => pending.includes(g.id)));
    }
  };

  const isSelected = (game: Game) =>
    multiSelect ? pending.includes(game.id) : selectedId === game.id;

  const isDisabled = (game: Game) =>
    multiSelect && !pending.includes(game.id) && pending.length >= MAX_TARGETS;

  function GameCard({ game }: { game: Game }) {
    const idx = userGames.includes(game)
      ? 100 + userGames.indexOf(game)
      : games.indexOf(game);
    const selected = isSelected(game);
    const disabled = isDisabled(game);
    const isUserGame = userGames.includes(game);

    return (
      <button
        key={game.id}
        onClick={() => {
          if (disabled) return;
          if (multiSelect) togglePending(game.id);
          else onSelect?.(game);
        }}
        className={`relative rounded-xl overflow-hidden group transition-all duration-150 ${
          selected
            ? "ring-[3px] ring-amber-400 ring-offset-1 scale-[0.98]"
            : disabled
            ? "opacity-40 cursor-not-allowed"
            : "hover:scale-[1.03] hover:shadow-md"
        }`}
      >
        <div className="aspect-square bg-gray-100">
          <img
            src={thumbSquare(game.title, game.category, idx)}
            alt={game.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-1.5 pt-6 pb-1.5">
          <p className="text-white text-[10px] font-semibold leading-tight text-left truncate">
            {game.title}
          </p>
        </div>
        {isUserGame && (
          <span className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-none">
            YOURS
          </span>
        )}
        <div
          className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            selected
              ? "bg-amber-400 border-amber-400"
              : "bg-white/70 border-white/80 group-hover:bg-white"
          }`}
        >
          {selected && (
            <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {multiSelect ? "Select Target Games" : `Select ${slot === 1 ? "Source" : "Target"} Game`}
          </h2>
          <div className="flex items-center gap-2">
            {multiSelect && (
              <button
                onClick={handleConfirm}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition"
              >
                Done ({pending.length} selected)
              </button>
            )}
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
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search games..."
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border-2 rounded-xl focus:outline-none transition"
              style={{ borderColor: "#f59e0b" }}
            />
          </div>
          <p className="text-xs mt-2 text-gray-400">
            {search.trim()
              ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} found`
              : `${games.length} system games · ${userGames.length} your game${userGames.length !== 1 ? "s" : ""}`}
            {multiSelect && pending.length > 0 && (
              <span className={pending.length >= MAX_TARGETS ? " · text-red-500 font-semibold" : " · text-gray-500"}>
                {` ${pending.length}/${MAX_TARGETS} selected`}
                {pending.length >= MAX_TARGETS && " · Max reached"}
              </span>
            )}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-6">
          {search.trim() ? (
            /* ── Search results (flat grid) ── */
            filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-sm">No games found for &quot;{search}&quot;</p>
                {onNavigateToAddGame && (
                  <button
                    onClick={() => { onClose(); onNavigateToAddGame(); }}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-sm font-semibold text-amber-700 transition"
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add &quot;{search}&quot; as a new game
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 px-6">
                {filtered.map((game) => <GameCard key={game.id} game={game} />)}
              </div>
            )
          ) : (
            /* ── Sectioned view (no search) ── */
            <>
              {/* Your Games section */}
              <div>
                <button
                  onClick={() => setUserSectionOpen((o) => !o)}
                  className="flex items-center justify-between w-full px-6 py-3 bg-gray-50 hover:bg-gray-100 transition text-left border-b border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Your Games</span>
                    <span className="text-[10px] bg-amber-100 text-amber-700 font-semibold px-1.5 py-0.5 rounded-full">
                      {userGames.length}
                    </span>
                  </div>
                  <svg
                    width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    className={`text-gray-400 transition-transform ${userSectionOpen ? "rotate-180" : ""}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userSectionOpen && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 px-6 pt-4 pb-2">
                    {userGames.map((game) => <GameCard key={game.id} game={game} />)}
                    {/* Add a Game card */}
                    {onNavigateToAddGame && (
                      <button
                        onClick={() => { onClose(); onNavigateToAddGame(); }}
                        className="relative rounded-xl overflow-hidden border-2 border-dashed border-amber-200 hover:border-amber-400 bg-amber-50 hover:bg-amber-100 flex flex-col items-center justify-center gap-1.5 aspect-square transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-200 group-hover:bg-amber-300 flex items-center justify-center transition-colors">
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#d97706" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <p className="text-[9px] font-bold text-amber-700 text-center leading-tight px-1">
                          Add a Game
                        </p>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* System Games section */}
              <div>
                <button
                  onClick={() => setSystemSectionOpen((o) => !o)}
                  className="flex items-center justify-between w-full px-6 py-3 bg-gray-50 hover:bg-gray-100 transition text-left border-b border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">System Games</span>
                    <span className="text-[10px] bg-gray-200 text-gray-600 font-semibold px-1.5 py-0.5 rounded-full">
                      {games.length}
                    </span>
                  </div>
                  <svg
                    width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    className={`text-gray-400 transition-transform ${systemSectionOpen ? "rotate-180" : ""}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {systemSectionOpen && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 px-6 pt-4">
                    {games.map((game) => <GameCard key={game.id} game={game} />)}
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
