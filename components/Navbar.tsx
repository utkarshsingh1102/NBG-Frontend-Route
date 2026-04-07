"use client";

import { useState, useRef, useEffect } from "react";

interface NavbarProps {
  currentPlan: string | null;
  onOpenPricing: () => void;
  onOpenBilling: () => void;
}

export default function Navbar({ currentPlan, onOpenPricing, onOpenBilling }: NavbarProps) {
  const [search, setSearch] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    }
    if (settingsOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [settingsOpen]);

  return (
    <header className="h-14 sticky top-0 z-50 bg-white border-b border-gray-200 flex items-center px-5 gap-4">
      {/* Logo */}
      <div className="flex items-center gap-2.5 min-w-[200px]">
        <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0 shadow-sm">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="text-white">
            <path
              d="M6 12h4M8 10v4M14 11h.01M17 13h.01M5 8h14a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2z"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="font-bold text-gray-900 text-[15px] leading-none tracking-tight whitespace-nowrap">
          Game Fusion Studio
        </span>
      </div>

      {/* Nav tabs */}
      <nav className="hidden md:flex items-center gap-1 ml-2">
        {["Discover", "My Games", "Analytics", "Reports"].map((tab, i) => (
          <button
            key={tab}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              i === 0
                ? "bg-amber-50 text-amber-700"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden sm:block">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-4 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition"
        />
      </div>

      {/* Premium button */}
      <button
        onClick={onOpenPricing}
        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
          currentPlan
            ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
            : "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-200"
        }`}
      >
        {currentPlan ? (
          <>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Upgrade
          </>
        ) : (
          <>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Get Premium
          </>
        )}
      </button>

      {/* Right icons */}
      <div className="flex items-center gap-1.5">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition relative">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        <div ref={settingsRef} className="relative">
          <button
            onClick={() => setSettingsOpen((v) => !v)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition text-gray-500 ${settingsOpen ? "bg-gray-100 text-gray-800" : "hover:bg-gray-100"}`}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {settingsOpen && (
            <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-200/70 py-1 z-50">
              <p className="px-3 pt-2 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Settings</p>

              <button
                onClick={() => { setSettingsOpen(false); onOpenBilling(); }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition rounded-lg mx-0"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Billing
                {currentPlan && (
                  <span className="ml-auto text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">{currentPlan}</span>
                )}
              </button>

              <button
                className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition rounded-lg"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </button>

              <div className="border-t border-gray-100 my-1" />

              <button
                className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-red-500 hover:bg-red-50 transition rounded-lg"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-[11px] font-bold cursor-pointer select-none ml-1 shadow-sm">
          GF
        </div>
      </div>
    </header>
  );
}
