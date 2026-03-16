"use client";

import { useState, useMemo } from "react";
import { games, Game, thumbSquare } from "@/lib/mockData";

interface GameSelectModalProps {
  slot: 1 | 2;
  selectedId?: string | null;
  selectedIds?: string[];
  multiSelect?: boolean;
  onSelect?: (game: Game) => void;
  onMultiSelect?: (games: Game[]) => void;
  onClose: () => void;
}

export default function GameSelectModal({
  slot,
  selectedId,
  selectedIds = [],
  multiSelect = false,
  onSelect,
  onMultiSelect,
  onClose,
}: GameSelectModalProps) {
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState<string[]>(selectedIds);

  const filtered = useMemo(() => {
    if (!search.trim()) return games;
    const q = search.toLowerCase();
    return games.filter((g) => g.title.toLowerCase().includes(q));
  }, [search]);

  const MAX_TARGETS = 5;

  const togglePending = (id: string) => {
    setPending((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_TARGETS) return prev;
      return [...prev, id];
    });
  };

  const handleConfirm = () => {
    if (onMultiSelect) {
      onMultiSelect(games.filter((g) => pending.includes(g.id)));
    }
  };

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
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
          <p className="text-xs mt-2">
            <span className="text-gray-400">{filtered.length} games available</span>
            {multiSelect && pending.length > 0 && (
              <span className={pending.length >= MAX_TARGETS ? " · text-red-500 font-semibold" : " · text-gray-500"}>
                {` ${pending.length}/${MAX_TARGETS} selected`}
                {pending.length >= MAX_TARGETS && " · Max reached"}
              </span>
            )}
          </p>
        </div>

        {/* Game grid */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="mb-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm">No games match your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {filtered.map((game) => {
                const isSelected = multiSelect
                  ? pending.includes(game.id)
                  : selectedId === game.id;
                return (
                  <button
                    key={game.id}
                    onClick={() => {
                      if (multiSelect) {
                        togglePending(game.id);
                      } else {
                        onSelect?.(game);
                      }
                    }}
                    className={`relative rounded-xl overflow-hidden group transition-all duration-150 ${
                      isSelected
                        ? "ring-[3px] ring-amber-400 ring-offset-1 scale-[0.98]"
                        : multiSelect && pending.length >= MAX_TARGETS
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:scale-[1.03] hover:shadow-md"
                    }`}
                  >
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={thumbSquare(game.title, game.category, parseInt(game.id))}
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
                    <div className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-amber-400 border-amber-400"
                        : "bg-white/70 border-white/80 group-hover:bg-white"
                    }`}>
                      {isSelected && (
                        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
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
