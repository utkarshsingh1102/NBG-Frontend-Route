"use client";

import { useState } from "react";
import { QUEUE_ITEMS } from "@/lib/mockData";

interface SidebarProps {
  activeGameId: string | null;
  onSelectGame: (id: string) => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  activePage: string;
  onNavChange: (page: string) => void;
}

const NAV_ITEMS = [
  {
    label: "Game Fusion",
    badge: null,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M6 12h4M8 10v4M14 11h.01M17 13h.01M5 8h14a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2z" />
      </svg>
    ),
  },
  {
    label: "Theme Remix",
    badge: null,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    label: "Your Generation",
    badge: "147",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    label: "Favorites",
    badge: null,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    label: "Reports",
    badge: null,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export default function Sidebar({ activeCategory, onSelectCategory, activePage, onNavChange }: SidebarProps) {
  const activeNav = activePage;

  return (
    <aside className="w-[230px] flex-shrink-0 h-[calc(100vh-56px)] sticky top-14 bg-white border-r border-gray-200 flex flex-col overflow-hidden">

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto sidebar-scroll">

        {/* ── NAVIGATION ── */}
        <div className="px-3 pt-4 pb-1">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-1.5">
            Navigation
          </p>
          <nav className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => onNavChange(item.label)}
                  className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-left transition-all ${
                    isActive
                      ? "bg-amber-50 text-amber-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className={isActive ? "text-amber-600" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-[13px] font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── GENERATION QUEUE ── */}
        <div className="px-3 pt-4 pb-4">
          <div className="flex items-center gap-1.5 px-2 mb-2">
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Generation Queue
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            {QUEUE_ITEMS.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-2.5 bg-green-50 border border-green-100 border-l-[3px] border-l-green-400 rounded-r-xl rounded-l-none px-2.5 py-2 cursor-pointer hover:bg-green-100/60 transition-colors group"
              >
                {/* Thumbnail */}
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 relative">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Yellow highlight dot */}
                  {item.highlight && (
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-yellow-400 rounded-full border border-white" />
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-gray-800 leading-tight truncate group-hover:text-gray-900">
                    {item.title}
                  </p>
                  <p className="text-[9px] text-gray-400 truncate mt-0.5 leading-tight">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
}
