"use client";

import { useState, useMemo } from "react";

const UNLOCKED_COUNT = 3;
const PAGE_SIZE = 20;
const TOTAL_COUNT = 197;

interface GameIdea {
  id: string;
  title: string;
  sourcedFrom: string;
  isNew?: boolean;
  color: string;   // fallback gradient hex when no image
  image?: string;  // path under /public, served as static asset
}

const ALL_GAME_IDEAS: GameIdea[] = [
  // ── Page 1 (matches screenshot) — images 1–20 ────────────────────────────────
  { id: "g1",  title: "Skewer Sizzle Jam",            sourcedFrom: "Foodie Sizzle + Farm Jam: Animal Parking Game",       isNew: true,  color: "F4845F", image: "/game-ideas/1.png"  },
  { id: "g2",  title: "Semantic Slide",                sourcedFrom: "Ring Crash + Associations: Colorwood Game",                         color: "E63946", image: "/game-ideas/2.png"  },
  { id: "g3",  title: "Conveyor Block Crush",          sourcedFrom: "Block Crush + Yarn Flow",                                           color: "2A9D8F", image: "/game-ideas/3.png"  },
  { id: "g4",  title: "Maze Jam: Paint & Park",        sourcedFrom: "Bubble Buz: Parking Jam Puzzle + AMAZE!",            isNew: true,  color: "6A4C93", image: "/game-ideas/4.png"  },
  { id: "g5",  title: "Knit Blast",                    sourcedFrom: "Sand Blast + Knit Out",                                             color: "3A86FF", image: "/game-ideas/5.png"  },
  { id: "g6",  title: "Traffic Transit Jam",           sourcedFrom: "Traffic Escape + Bubble Bus: Parking Jam Puzzle",                  color: "FF006E", image: "/game-ideas/6.png"  },
  { id: "g7",  title: "Traffic Match: Cargo Jam",      sourcedFrom: "Hotpot Go: Food Sort + Car Out",                                    color: "FB5607", image: "/game-ideas/7.png"  },
  { id: "g8",  title: "Blast Match 3D",                sourcedFrom: "Triple Match City + Toon Blast",                                    color: "FFBE0B", image: "/game-ideas/8.png"  },
  { id: "g9",  title: "Super Dispatch: Hero Jam",      sourcedFrom: "Beads Out + Superhero",                                             color: "06D6A0", image: "/game-ideas/9.png"  },
  { id: "g10", title: "Target Match City",             sourcedFrom: "Triple Match City + Found It!",                                     color: "118AB2", image: "/game-ideas/10.png" },
  { id: "g11", title: "City Gate Match",               sourcedFrom: "Triple Match City + Coffee Run Puzzle",                             color: "EF476F"                              }, // 11.png missing
  { id: "g12", title: "City Delivery Jam",             sourcedFrom: "Triple Match City + Skewer Jam",                                    color: "1B4332", image: "/game-ideas/12.png" },
  { id: "g13", title: "Lion Dance Jam",                sourcedFrom: "Crowd Express + Lion",                                              color: "7209B7", image: "/game-ideas/13.png" },
  { id: "g14", title: "Project SGDF: Alien Beam-Up",   sourcedFrom: "Knit Out + sgdfgbsf",                               isNew: true,  color: "480CA8", image: "/game-ideas/14.png" },
  { id: "g15", title: "Pride Path: Cub Rescue",        sourcedFrom: "Hole People + Lion",                                               color: "3A0CA3", image: "/game-ideas/15.png" },
  { id: "g16", title: "Syrup Sinkhole: Waffle Order",  sourcedFrom: "All In Hole: Black Hole Games + Waffle",            isNew: true,  color: "F72585", image: "/game-ideas/16.png" },
  { id: "g17", title: "Colorwood Puller 3D",           sourcedFrom: "Colorwood Sort Puzzle Game + Marble Puller",                       color: "4CC9F0", image: "/game-ideas/17.png" },
  { id: "g18", title: "Pixel Loop: Color Flow",        sourcedFrom: "Brilliant Sort + Hotpot Flow: Food Game",                          color: "4361EE", image: "/game-ideas/18.png" },
  { id: "g19", title: "Cargo Dock Jam",                sourcedFrom: "Color Block Jam + Load the Dishes",                                color: "3F37C9", image: "/game-ideas/19.png" },
  { id: "g20", title: "Block Conveyor Jam",            sourcedFrom: "Block Crush + Yarn Flow",                           isNew: true,  color: "560BAD", image: "/game-ideas/20.png" },
  // ── Pages 2+ — images 21–31, then color fallback ─────────────────────────────
  { id: "g21", title: "Terminal Loop Jam",             sourcedFrom: "Mnt Jam + Yarn Flow",                                              color: "D62828", image: "/game-ideas/21.png" },
  { id: "g22", title: "Block Jam + Yarn Flow",         sourcedFrom: "Block Jam + Yarn Flow",                                            color: "F77F00", image: "/game-ideas/22.png" },
  { id: "g23", title: "Gelato Scoop Jam",              sourcedFrom: "Hole People + Ice Cream",                                          color: "FCBF49", image: "/game-ideas/23.png" },
  { id: "g24", title: "Letter Block Jam",              sourcedFrom: "Wordle + Color Block Jam",                                         color: "264653", image: "/game-ideas/24.png" },
  { id: "g25", title: "Sand Arrow Escape",             sourcedFrom: "Sand Blast + Arrows + Puzzle Escape",                              color: "2C7873", image: "/game-ideas/25.png" },
  { id: "g26", title: "Ballista Out: Dragon Siege",    sourcedFrom: "Royalty: Rescue Puzzle + Arrow Out",              isNew: true,  color: "6FB98F", image: "/game-ideas/26.png" },
  { id: "g27", title: "Jelly Park Merge",              sourcedFrom: "Park Merge + Drop Jelly",                                          color: "004445", image: "/game-ideas/27.png" },
  { id: "g28", title: "Cipher Screws",                 sourcedFrom: "Screwdown + That's My Seal: Logo Puzzle",                          color: "2B580C", image: "/game-ideas/28.png" },
  { id: "g29", title: "Screw Stack 10",                sourcedFrom: "Screwdown + Stack Em Up",                                          color: "884A39", image: "/game-ideas/29.png" },
  { id: "g30", title: "Trait Snakes: Maze Match",      sourcedFrom: "Go-Go Out + Connect Master: Match Puzzle",                        color: "C38154", image: "/game-ideas/30.png" },
  { id: "g31", title: "Hexa Brew",                     sourcedFrom: "Colorwood Sort + Coffee Pace",                                     color: "FFC26F", image: "/game-ideas/31.png" },
  { id: "g32", title: "Goods Puzzle: Sort Challenge",  sourcedFrom: "Goods Puzzle + Wool Sort",                                         color: "96CEB4"                              },
  { id: "g33", title: "Sizzle Sort Master",            sourcedFrom: "Skewer Sizzle + Penguin Go: Food Sort",                            color: "88D8B0"                              },
  { id: "g34", title: "Transit Pull 3D",               sourcedFrom: "Seat Jam 3D + Knit Out",                                           color: "FFCC99"                              },
  { id: "g35", title: "Jelly Number Drop",             sourcedFrom: "Fruit Merge Match-Game + Numbers",                                 color: "FF9999"                              },
  { id: "g36", title: "Toy Car Pile-Up",               sourcedFrom: "Stomp Jam + Car",                                  isNew: true,  color: "9B2335"                              },
  { id: "g37", title: "Astro Bot Sort: Space Silos",   sourcedFrom: "Viby Sort: Tamara Task + Space + Numbers",                        color: "0B4619"                              },
  { id: "g38", title: "Tower Module Drop",             sourcedFrom: "Block Crush + Drop Puzzle",                                        color: "E8B4A0"                              },
  { id: "g39", title: "Sand Sprint Escape",            sourcedFrom: "Sand Blast + Sprint Escape",                                       color: "A0C4FF"                              },
  { id: "g40", title: "Color Cascade Merge",           sourcedFrom: "Color Block Jam + Merge Rush",                                     color: "B5EAD7"                              },
];

function PremiumModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 px-6 pt-8 pb-6 flex flex-col items-center gap-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 50% 40%, white 0%, transparent 70%)" }} />
          <div className="relative w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg shadow-amber-600/30">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l2.5-8 4.5 4L12 5l2 8 4.5-4 2.5 8H3z" />
            </svg>
          </div>
          <div className="relative">
            <p className="text-[11px] font-bold text-amber-900/70 uppercase tracking-widest mb-1">NextBigGames</p>
            <h2 className="text-xl font-extrabold text-white leading-tight">Unlock Premium Access</h2>
            <p className="text-sm text-white/80 mt-1">Get all {ALL_GAME_IDEAS.length}+ expert-curated ideas</p>
          </div>
        </div>
        <div className="px-6 py-5 space-y-3">
          {[
            { icon: "💡", text: "Full access to all curated game ideas" },
            { icon: "📊", text: "Detailed market potential analysis per idea" },
            { icon: "🔄", text: "New ideas added every week by our experts" },
            { icon: "🎯", text: "Competitor mapping & monetisation tips" },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-3">
              <span className="text-base flex-shrink-0">{b.icon}</span>
              <p className="text-sm text-gray-700">{b.text}</p>
            </div>
          ))}
          <div className="pt-2 border-t border-gray-100 flex items-end justify-between">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">$9.99</p>
              <p className="text-xs text-gray-400">per month · cancel anytime</p>
            </div>
            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">7-day free trial</span>
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm rounded-xl transition shadow-md shadow-amber-200">
            Start Free Trial →
          </button>
          <button onClick={onClose} className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 transition">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

function GameCard({
  idea,
  globalIndex,
  isFavorite,
  onToggleFavorite,
  onLockClick,
}: {
  idea: GameIdea;
  globalIndex: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onLockClick: () => void;
}) {
  const isLocked = globalIndex >= UNLOCKED_COUNT;

  return (
    <div
      className={`group relative bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-200 ${
        isLocked
          ? "cursor-pointer hover:shadow-md hover:border-amber-300"
          : "hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5"
      }`}
      onClick={isLocked ? onLockClick : undefined}
    >
      {/* ── Thumbnail ────────────────────────────────────────────── */}
      <div className="relative aspect-square overflow-hidden">
        {idea.image ? (
          /* Real game screenshot */
          <img
            src={idea.image}
            alt={idea.title}
            className={`w-full h-full object-cover ${isLocked ? "blur-sm" : ""}`}
            loading="lazy"
            draggable={false}
          />
        ) : (
          /* Color gradient fallback */
          <div
            className={`w-full h-full flex items-end ${isLocked ? "blur-sm" : ""}`}
            style={{ background: `linear-gradient(135deg, #${idea.color}dd 0%, #${idea.color}88 100%)` }}
          >
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)`,
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative w-full px-3 pb-3 pt-10">
              <p className="text-white/90 font-black text-base leading-snug drop-shadow-md line-clamp-2">
                {idea.title}
              </p>
            </div>
          </div>
        )}

        {/* NEW badge */}
        {idea.isNew && (
          <span className="absolute top-2 left-2 bg-[#FF6B35] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wide shadow">
            NEW
          </span>
        )}

        {/* Star / favorite button */}
        <button
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow
            ${isFavorite ? "bg-amber-400 text-white" : "bg-white/80 text-gray-400 hover:bg-white hover:text-amber-400"}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(idea.id);
          }}
          aria-label="Toggle favorite"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>

      {/* ── Card body ──────────────────────────────────────────────── */}
      <div className="px-3 pt-2.5 pb-3">
        <p className="text-[13px] font-bold text-gray-900 leading-snug mb-1 line-clamp-1">
          {idea.title}
        </p>
        <p className="text-[11px] text-gray-500 leading-snug line-clamp-1">
          {idea.sourcedFrom}
        </p>
      </div>

      {/* ── Lock overlay ───────────────────────────────────────────── */}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 group-hover:bg-black/45 transition-colors">
          <div
            className="w-12 h-12 rounded-full bg-amber-500/25 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"
            style={{ boxShadow: "0 0 24px 6px rgba(245,158,11,0.45)" }}
          >
            <div className="w-9 h-9 rounded-full bg-amber-500/30 flex items-center justify-center">
              <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="#fbbf24" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <p className="text-white text-[11px] font-bold tracking-wide">Premium Only</p>
          <p className="text-white/60 text-[9px] mt-0.5">Tap to unlock access</p>
        </div>
      )}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const btn = "h-8 min-w-8 px-2 rounded text-xs font-semibold transition";

  return (
    <div className="flex items-center gap-1 justify-center mt-8 select-none">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className={`${btn} flex items-center gap-1 px-3 border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed bg-white`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M15 18l-6-6 6-6" /></svg>
        Previous
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="text-gray-400 text-xs px-1">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p as number)}
            className={`${btn} ${
              page === p
                ? "bg-gray-900 text-white border border-gray-900"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-800"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className={`${btn} flex items-center gap-1 px-3 border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed bg-white`}
      >
        Next
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M9 18l6-6-6-6" /></svg>
      </button>
    </div>
  );
}

export default function NBGIdeasContent() {
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Newest First");
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ALL_GAME_IDEAS.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.sourcedFrom.toLowerCase().includes(q)
    );
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(TOTAL_COUNT / PAGE_SIZE));
  const visibleItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const displayTotal = search ? filtered.length : TOTAL_COUNT;
  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, displayTotal);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <main className="flex-1 p-6 min-w-0">

        {/* ── Page Header ──────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-5 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-200 flex-shrink-0">
              {/* Bar chart icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-gray-900">Master Ideas Database</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Your complete library of generated concepts ({TOTAL_COUNT} total)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
              {UNLOCKED_COUNT} free · {TOTAL_COUNT - UNLOCKED_COUNT} premium
            </span>
            <button
              onClick={() => setPremiumOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold rounded-full shadow-sm shadow-amber-200 transition"
            >
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l2.5-8 4.5 4L12 5l2 8 4.5-4 2.5 8H3z" />
              </svg>
              Unlock All
            </button>
          </div>
        </div>

        {/* ── Premium CTA banner ───────────────────────────────────── */}
        <div className="mb-5 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border border-amber-200/60 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l2.5-8 4.5 4L12 5l2 8 4.5-4 2.5 8H3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                Unlock {TOTAL_COUNT - UNLOCKED_COUNT} more expert ideas
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                New ideas every week · Market analysis · Monetisation tips
              </p>
            </div>
          </div>
          <button
            onClick={() => setPremiumOpen(true)}
            className="flex-shrink-0 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm rounded-xl shadow-md shadow-amber-200 transition"
          >
            Get Premium →
          </button>
        </div>

        {/* ── Controls row ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search games..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent placeholder-gray-400 text-gray-800"
            />
          </div>

          {/* View toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
            <button className="px-3 py-2 bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              Grid
            </button>
            <button className="px-3 py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer"
            >
              <option>Newest First</option>
              <option>Oldest First</option>
              <option>A → Z</option>
              <option>Z → A</option>
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </div>

        {/* ── Showing count ────────────────────────────────────────── */}
        <p className="text-xs text-gray-500 mb-4">
          Showing {start}–{end} of {displayTotal} games
        </p>

        {/* ── Cards grid ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {visibleItems.map((idea) => {
            const globalIndex = ALL_GAME_IDEAS.findIndex((g) => g.id === idea.id);
            return (
              <GameCard
                key={idea.id}
                idea={idea}
                globalIndex={globalIndex}
                isFavorite={favorites.has(idea.id)}
                onToggleFavorite={toggleFavorite}
                onLockClick={() => setPremiumOpen(true)}
              />
            );
          })}
        </div>

        {visibleItems.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <svg className="mx-auto mb-3 opacity-40" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <p className="text-sm font-medium">No games found for &ldquo;{search}&rdquo;</p>
          </div>
        )}

        {/* ── Pagination ───────────────────────────────────────────── */}
        {!search && (
          <Pagination page={page} totalPages={totalPages} onPage={handlePageChange} />
        )}

      </main>

      {premiumOpen && <PremiumModal onClose={() => setPremiumOpen(false)} />}
    </>
  );
}
