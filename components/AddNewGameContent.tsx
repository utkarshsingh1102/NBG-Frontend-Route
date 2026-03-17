"use client";

import { useState, useEffect } from "react";
import { Game, thumbSquare } from "@/lib/mockData";

const ADMIN_EMAIL = "admin@nbg.com";
const STORAGE_KEY = "nbg_game_requests";
const PAGE_SIZE = 5;

const CATEGORIES: Game["category"][] = [
  "Puzzle", "Casual", "Arcade", "Runner", "Match3",
  "Strategy", "Merge", "Idle", "Hypercasual", "Simulation",
];

interface GameRequest {
  id: string;
  gameName: string;
  category: string;
  storeUrl: string;
  submittedAt: string;
  status: "pending" | "approved";
}

interface AddNewGameContentProps {
  onGameAdded: (game: Game) => void;
  directToForm?: boolean;
}

function loadRequests(): GameRequest[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRequests(requests: GameRequest[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export default function AddNewGameContent({ onGameAdded }: AddNewGameContentProps) {
  const [requests, setRequests] = useState<GameRequest[]>([]);
  const [page, setPage] = useState(1);

  // Form state
  const [gameName, setGameName] = useState("");
  const category: Game["category"] = "Puzzle";
  const [storeUrl, setStoreUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    setRequests(loadRequests());
  }, []);

  const validateUrl = (url: string) =>
    url.includes("play.google.com") || url.includes("apps.apple.com");

  const handleSubmit = () => {
    if (!gameName.trim()) return;
    if (!validateUrl(storeUrl.trim())) {
      setUrlError("Please enter a valid Google Play or App Store link.");
      return;
    }

    const newGame: Game = {
      id: `user-${Date.now()}`,
      title: gameName.trim(),
      thumbnail: thumbSquare(gameName.trim(), category, 100),
      category,
      rating: 0,
      plays: 0,
      status: "draft",
      platform: "Mobile",
    };

    const newRequest: GameRequest = {
      id: `req-${Date.now()}`,
      gameName: gameName.trim(),
      category,
      storeUrl: storeUrl.trim(),
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    const updated = [newRequest, ...requests];
    setRequests(updated);
    saveRequests(updated);
    setPage(1);

    const subject = encodeURIComponent(`Game Approval Request: ${gameName.trim()}`);
    const body = encodeURIComponent(
      `New game submission:\n\nGame Name: ${gameName.trim()}\nCategory: ${category}\nStore URL: ${storeUrl.trim()}\n\nPlease review and approve this game.`
    );
    window.location.href = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;

    onGameAdded(newGame);

    // Reset form and show success banner
    setGameName("");
    setStoreUrl("");
    setUrlError("");
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const totalPages = Math.max(1, Math.ceil(requests.length / PAGE_SIZE));
  const paged = requests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main className="flex-1 p-6 min-w-0 space-y-8">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* ── FORM SECTION ── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
          {/* Section header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold text-gray-900">Submit a New Game</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                An approval request will be emailed to admin after submission
              </p>
            </div>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full flex-shrink-0">
              Puzzle games only
            </span>
          </div>

          {/* Success banner */}
          {submitSuccess && (
            <div className="mx-6 mt-4 flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-green-700">
                Request submitted! Your game has been added and admin has been notified.
              </p>
            </div>
          )}

          <div className="px-6 py-5 space-y-4">
            {/* Game Name */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                Game Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Candy Crush Saga"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 transition bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Store URL */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                Store Link <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => { setStoreUrl("https://play.google.com/store/apps/details?id="); setUrlError(""); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600"
                >
                  🟢 Google Play
                </button>
                <button
                  type="button"
                  onClick={() => { setStoreUrl("https://apps.apple.com/app/"); setUrlError(""); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600"
                >
                  🍎 App Store
                </button>
              </div>
              <input
                type="url"
                placeholder="https://play.google.com/... or https://apps.apple.com/..."
                value={storeUrl}
                onChange={(e) => { setStoreUrl(e.target.value); setUrlError(""); }}
                className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none transition bg-gray-50 focus:bg-white ${
                  urlError
                    ? "border-red-400 bg-red-50 focus:border-red-400"
                    : "border-gray-200 focus:border-amber-400"
                }`}
              />
              {urlError && (
                <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                  <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {urlError}
                </p>
              )}
            </div>

            {/* Footer row: info note + submit button */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-start gap-2 flex-1 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2} className="flex-shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[11px] text-amber-700 leading-snug">
                  Your game appears instantly in the selector while admin reviews the request.
                </p>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!gameName.trim() || !storeUrl.trim()}
                className="flex-shrink-0 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm rounded-xl transition shadow-sm"
              >
                Submit for Approval
              </button>
            </div>
          </div>
        </section>

        {/* ── REQUESTS LIST ── */}
        <section>
          {/* Section header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">My Requests</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {requests.length === 0
                  ? "No requests yet"
                  : `${requests.length} total · ${pendingCount} pending · ${requests.length - pendingCount} approved`}
              </p>
            </div>
            {requests.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                  {pendingCount} Pending
                </span>
              </div>
            )}
          </div>

          {requests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-400">No requests submitted yet</p>
              <p className="text-xs text-gray-300">Your submissions will appear here</p>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="grid grid-cols-[1fr_100px_80px_90px] gap-3 px-4 mb-2">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Game</p>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Category</p>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Submitted</p>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">Status</p>
              </div>

              {/* Rows */}
              <div className="flex flex-col gap-2">
                {paged.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 grid grid-cols-[1fr_100px_80px_90px] gap-3 items-center"
                  >
                    {/* Game info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={thumbSquare(req.gameName, req.category as Game["category"], 100)}
                          alt={req.gameName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{req.gameName}</p>
                        <a
                          href={req.storeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-blue-400 hover:underline truncate block"
                          title={req.storeUrl}
                        >
                          {req.storeUrl.includes("play.google.com") ? "Google Play" : "App Store"}
                        </a>
                      </div>
                    </div>

                    {/* Category */}
                    <p className="text-xs text-gray-500 truncate">{req.category}</p>

                    {/* Date */}
                    <p className="text-[11px] text-gray-400">
                      {new Date(req.submittedAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric",
                      })}
                    </p>

                    {/* Status */}
                    <div className="flex justify-end">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          req.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {req.status === "approved" ? "✓ Approved" : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 px-1">
                  <p className="text-xs text-gray-400">
                    Page {page} of {totalPages} · {requests.length} requests
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition ${
                          p === page
                            ? "bg-amber-500 text-white shadow-sm"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
