"use client";

import { useState } from "react";
import { Game } from "@/lib/mockData";

function formatPlays(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return Math.round(n / 1000) + "K";
  return n.toString();
}

interface GameCardProps {
  game: Game;
  selected?: boolean;
  onSelect?: () => void;
}

export default function GameCard({ game, selected, onSelect }: GameCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`bg-white rounded-xl overflow-hidden border cursor-pointer transition-all duration-200 ${
        selected
          ? "ring-[3px] ring-amber-400 ring-offset-1 border-amber-300 shadow-md scale-[0.98]"
          : hovered
          ? "shadow-lg -translate-y-0.5 scale-[1.02] border-gray-200"
          : "border-gray-100 shadow-sm hover:shadow-md"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
    >
      {/* Thumbnail */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-150 to-gray-200" />
        )}
        <img
          src={game.thumbnail}
          alt={game.title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wide backdrop-blur-sm ${
            game.status === "published" ? "bg-green-500/90 text-white" : "bg-amber-400/90 text-white"
          }`}>
            {game.status}
          </span>
        </div>
        <span className="absolute top-2 right-2 text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
          {game.platform}
        </span>

        {/* Hover overlay */}
        {hovered && !selected && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
            <span className="text-white text-[10px] font-medium">View Details →</span>
          </div>
        )}

        {/* Selected checkmark */}
        {selected && (
          <div className="absolute inset-0 bg-amber-400/10 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2.5">
        <p className="text-[12px] font-semibold text-gray-900 truncate leading-tight mb-1.5">
          {game.title}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded-md">
            {game.category}
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-[10px] text-gray-600 font-medium">{game.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[10px] text-gray-500">{formatPlays(game.plays)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
