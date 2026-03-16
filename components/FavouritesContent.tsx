"use client";

import { games as allGames } from "@/lib/mockData";
import GameGrid from "./GameGrid";

// 10 hand-picked top-rated / high-play games
const FAVOURITE_IDS = ["6", "44", "61", "54", "12", "48", "38", "37", "33", "50"];

export default function FavouritesContent() {
  const favourites = FAVOURITE_IDS.map((id) => allGames.find((g) => g.id === id)).filter(Boolean) as typeof allGames;

  return (
    <main className="flex-1 p-6 min-w-0">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center shadow-sm shadow-amber-200">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Favourites</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Your top-rated saved games</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
          {favourites.length} games
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Avg. Rating</p>
          <p className="text-2xl font-bold text-gray-900">
            {(favourites.reduce((s, g) => s + g.rating, 0) / favourites.length).toFixed(1)}
            <span className="text-amber-400 text-lg ml-1">★</span>
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total Plays</p>
          <p className="text-2xl font-bold text-gray-900">
            {(favourites.reduce((s, g) => s + g.plays, 0) / 1_000_000).toFixed(1)}
            <span className="text-xs font-semibold text-gray-400 ml-1">M</span>
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Categories</p>
          <p className="text-2xl font-bold text-gray-900">
            {new Set(favourites.map((g) => g.category)).size}
            <span className="text-xs font-semibold text-gray-400 ml-1">genres</span>
          </p>
        </div>
      </div>

      {/* Game grid */}
      <GameGrid games={favourites} />
    </main>
  );
}
