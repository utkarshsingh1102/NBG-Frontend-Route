"use client";

import { Game } from "@/lib/mockData";

interface SidebarItemProps {
  game: Game;
  isActive: boolean;
  onClick: () => void;
}

export default function SidebarItem({ game, isActive, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-all text-left group rounded-lg mx-1
        ${isActive
          ? "bg-amber-50 border border-amber-200"
          : "hover:bg-gray-50 border border-transparent"
        }`}
      style={{ width: "calc(100% - 8px)" }}
    >
      {/* Thumbnail */}
      <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-[11px] font-semibold truncate leading-tight ${isActive ? "text-amber-700" : "text-gray-800"}`}>
          {game.title}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${game.status === "published" ? "bg-green-500" : "bg-amber-400"}`} />
          <span className="text-[9px] text-gray-400 truncate">{game.category}</span>
        </div>
      </div>
      {/* Plays */}
      <span className="text-[9px] text-gray-400 flex-shrink-0">
        {game.plays >= 1_000_000 ? (game.plays / 1_000_000).toFixed(1) + "M" : Math.round(game.plays / 1000) + "K"}
      </span>
    </button>
  );
}
