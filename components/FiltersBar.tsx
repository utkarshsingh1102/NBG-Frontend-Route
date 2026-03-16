"use client";

import { categories, platforms, sortOptions } from "@/lib/mockData";

interface FiltersBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  platform: string;
  onPlatformChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
  totalCount: number;
}

export default function FiltersBar({
  search, onSearchChange,
  category, onCategoryChange,
  platform, onPlatformChange,
  sort, onSortChange,
  totalCount,
}: FiltersBarProps) {
  return (
    <div className="space-y-3 mb-5">
      {/* Row 1: sort + platform + search */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400/30 cursor-pointer"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <div className="flex gap-1.5">
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => onPlatformChange(p)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                platform === p
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={`Search ${totalCount} games...`}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 w-44 transition"
          />
        </div>
      </div>

      {/* Row 2: category pills */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`text-xs px-3 py-1 rounded-full border font-medium transition-all ${
              category === cat
                ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
