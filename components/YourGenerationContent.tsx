"use client";

import { useMemo, useState } from "react";
import { games as allGames } from "@/lib/mockData";
import GameGrid from "./GameGrid";
import FiltersBar from "./FiltersBar";

interface YourGenerationContentProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export default function YourGenerationContent({ activeCategory, onCategoryChange }: YourGenerationContentProps) {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("All");
  const [sort, setSort] = useState("plays_desc");

  const filtered = useMemo(() => {
    let list = [...allGames];
    if (activeCategory !== "All") list = list.filter((g) => g.category === activeCategory);
    if (platform !== "All") list = list.filter((g) => g.platform === platform);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((g) => g.title.toLowerCase().includes(q));
    }
    if (sort === "plays_desc") list.sort((a, b) => b.plays - a.plays);
    else if (sort === "plays_asc") list.sort((a, b) => a.plays - b.plays);
    else if (sort === "rating_desc") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "rating_asc") list.sort((a, b) => a.rating - b.rating);
    else if (sort === "title_asc") list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [activeCategory, platform, search, sort]);

  const publishedCount = allGames.filter((g) => g.status === "published").length;

  return (
    <main className="flex-1 p-6 min-w-0">
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

        <FiltersBar
          search={search}
          onSearchChange={setSearch}
          category={activeCategory}
          onCategoryChange={onCategoryChange}
          platform={platform}
          onPlatformChange={setPlatform}
          sort={sort}
          onSortChange={setSort}
          totalCount={allGames.length}
        />

        <GameGrid games={filtered} />
      </section>
    </main>
  );
}
