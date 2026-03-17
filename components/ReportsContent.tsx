"use client";

import { useState } from "react";
import { thumbSquare } from "@/lib/mockData";

const UNLOCKED_COUNT = 3;

type ReportType = "Promising" | "Failure" | "Idle Game" | "Puzzle Game";

interface Report {
  id: string;
  title: string;
  game: string;
  category: string;
  type: ReportType;
  summary: string;
  date: string;
  metric: string;
  metricLabel: string;
}

const REPORTS: Report[] = [
  {
    id: "r1",
    title: "Candy Rush — Viral Loop Analysis",
    game: "Candy Rush",
    category: "Match3",
    type: "Promising",
    summary: "Strong D1 retention at 48% driven by satisfying audio-visual feedback loops. Level pacing keeps players engaged through the first 50 levels before drop-off.",
    date: "Mar 10, 2026",
    metric: "48%",
    metricLabel: "D1 Retention",
  },
  {
    id: "r2",
    title: "Merge Empire — Monetisation Deep Dive",
    game: "Merge Empire",
    category: "Merge",
    type: "Promising",
    summary: "ARPU of $3.20 with ad-to-IAP conversion at 12%. Energy mechanic drives 3× more sessions per day vs. category average.",
    date: "Mar 8, 2026",
    metric: "$3.20",
    metricLabel: "ARPU",
  },
  {
    id: "r3",
    title: "Puzzle Blocks 3D — Engagement Report",
    game: "Puzzle Blocks 3D",
    category: "Puzzle",
    type: "Puzzle Game",
    summary: "D7 retention holds at 22% — 6 points above genre benchmark. Haptic feedback and distinct sound design are primary differentiators identified in player surveys.",
    date: "Mar 5, 2026",
    metric: "22%",
    metricLabel: "D7 Retention",
  },
  {
    id: "r4",
    title: "Stack Tower Fall — Post-Mortem",
    game: "Stack Tower Fall",
    category: "Hypercasual",
    type: "Failure",
    summary: "CPI exceeded $1.40 in week two after initial burst. Core loop repeated too quickly — median session under 50 seconds. No sufficient hook for return visits.",
    date: "Mar 3, 2026",
    metric: "$1.40",
    metricLabel: "CPI (wk 2)",
  },
  {
    id: "r5",
    title: "Idle Gold Mine — 90-Day Review",
    game: "Idle Gold Mine",
    category: "Idle",
    type: "Idle Game",
    summary: "LTV of $8.40 at day 90. Offline earnings mechanic generates 4× re-open rate. Premium currency bundle conversion spiked 40% after UI refresh in v2.3.",
    date: "Feb 28, 2026",
    metric: "$8.40",
    metricLabel: "LTV D90",
  },
  {
    id: "r6",
    title: "Neon Dash Runner — CPI Analysis",
    game: "Neon Dash Runner",
    category: "Runner",
    type: "Promising",
    summary: "Creatives with neon glow trails achieved $0.42 CPI vs. $1.10 category average. Gameplay-first ads outperformed animated logo variants by 2.6×.",
    date: "Feb 25, 2026",
    metric: "$0.42",
    metricLabel: "Avg CPI",
  },
  {
    id: "r7",
    title: "Galaxy Merge — Session Analysis",
    game: "Galaxy Merge",
    category: "Merge",
    type: "Idle Game",
    summary: "Average session length of 7.2 minutes is 2× above merge genre median. Star-collecting side quest drives 35% of all sessions beyond the 10-minute mark.",
    date: "Feb 22, 2026",
    metric: "7.2 min",
    metricLabel: "Avg Session",
  },
  {
    id: "r8",
    title: "Word Wizard — Drop-Off Report",
    game: "Word Wizard",
    category: "Puzzle",
    type: "Failure",
    summary: "Level 12 sees a 68% churn spike due to difficulty cliff. No soft-currency cushion available at that point. Recommended: insert 3 easier bridging levels.",
    date: "Feb 20, 2026",
    metric: "68%",
    metricLabel: "Churn at Lvl 12",
  },
  {
    id: "r9",
    title: "Farm Idle Tycoon — Revenue Report",
    game: "Farm Idle Tycoon",
    category: "Idle",
    type: "Idle Game",
    summary: "Rewarded video CTR of 38% driven by well-timed post-harvest prompts. Season pass generated $0.85 incremental ARPU in first 30 days.",
    date: "Feb 17, 2026",
    metric: "38%",
    metricLabel: "RV CTR",
  },
  {
    id: "r10",
    title: "Brick Breaker Deluxe — Market Fit",
    game: "Brick Breaker Deluxe",
    category: "Arcade",
    type: "Puzzle Game",
    summary: "Strong nostalgia-driven install surge offset by weak tutorial — only 31% of players reach level 5. Power-up discovery rate critically low at 18%.",
    date: "Feb 14, 2026",
    metric: "31%",
    metricLabel: "Level 5 Reach",
  },
  {
    id: "r11",
    title: "Sky Merge Islands — Virality Analysis",
    game: "Sky Merge Islands",
    category: "Merge",
    type: "Promising",
    summary: "Social gifting feature drove 22% organic installs in month one. Friend-inviting players show 3× higher LTV than paid-acquisition cohort.",
    date: "Feb 11, 2026",
    metric: "22%",
    metricLabel: "Organic Share",
  },
  {
    id: "r12",
    title: "Slime Physics Run — Launch Post-Mortem",
    game: "Slime Physics Run",
    category: "Hypercasual",
    type: "Failure",
    summary: "Physics simulation caused 15% crash rate on mid-tier devices. Performance-related 1-star reviews tanked store ranking within 72 hours of launch.",
    date: "Feb 8, 2026",
    metric: "15%",
    metricLabel: "Crash Rate",
  },
  {
    id: "r13",
    title: "Number Blocks Puzzle — Retention Study",
    game: "Number Blocks Puzzle",
    category: "Puzzle",
    type: "Puzzle Game",
    summary: "D30 retention of 14% outperforms puzzle genre by 4 points. Daily challenge feature is directly correlated with the retention uplift per cohort analysis.",
    date: "Feb 5, 2026",
    metric: "14%",
    metricLabel: "D30 Retention",
  },
  {
    id: "r14",
    title: "Asteroid Idle Miner — LTV Forecast",
    game: "Asteroid Idle Miner",
    category: "Idle",
    type: "Idle Game",
    summary: "Projected LTV of $11.20 at D180 based on current spend curves. Prestige system resets drive a secondary monetisation window with 19% repeat purchasers.",
    date: "Feb 2, 2026",
    metric: "$11.20",
    metricLabel: "Proj. LTV D180",
  },
  {
    id: "r15",
    title: "Tap Heroes Battle — Competitive Audit",
    game: "Tap Heroes Battle",
    category: "Arcade",
    type: "Promising",
    summary: "No direct competitor occupies the idle-battle-royale niche at sub-$0.60 CPI. First-mover window estimated at 4–6 months before major publishers respond.",
    date: "Jan 29, 2026",
    metric: "$0.58",
    metricLabel: "Est. CPI",
  },
  {
    id: "r16",
    title: "Color Sort Mania — Store Optimisation",
    game: "Color Sort Mania",
    category: "Puzzle",
    type: "Puzzle Game",
    summary: "A/B testing icon variants showed pastel palette lifted CVR by 18%. Feature graphic with gameplay screenshot outperformed illustrated art by 2.1×.",
    date: "Jan 26, 2026",
    metric: "+18%",
    metricLabel: "CVR Lift",
  },
  {
    id: "r17",
    title: "Jungle Idle Kingdom — Ad Strategy",
    game: "Jungle Idle Kingdom",
    category: "Idle",
    type: "Idle Game",
    summary: "Interstitial frequency above 1-per-3-levels caused 23% session-end spike. Recommended cap: 1 per 5 levels. Rewarded video opt-in at 44% after rebalance.",
    date: "Jan 22, 2026",
    metric: "44%",
    metricLabel: "RV Opt-In",
  },
  {
    id: "r18",
    title: "Tower Stack Blitz — Creative Report",
    game: "Tower Stack Blitz",
    category: "Hypercasual",
    type: "Failure",
    summary: "Top creative fatigue observed at day 14 with CTR dropping from 4.2% to 1.1%. Insufficient creative volume at launch; recommend minimum 20 variants pre-launch.",
    date: "Jan 18, 2026",
    metric: "1.1%",
    metricLabel: "CTR (day 14)",
  },
];

const UNLOCKED_IDS = new Set(REPORTS.slice(0, UNLOCKED_COUNT).map((r) => r.id));

const FILTER_TABS: { label: string; value: ReportType | "All" }[] = [
  { label: "All Reports", value: "All" },
  { label: "Promising", value: "Promising" },
  { label: "Failure", value: "Failure" },
  { label: "Idle Game", value: "Idle Game" },
  { label: "Puzzle Game", value: "Puzzle Game" },
];

const TYPE_COLORS: Record<ReportType, string> = {
  Promising: "bg-green-100 text-green-700",
  Failure: "bg-red-100 text-red-600",
  "Idle Game": "bg-blue-100 text-blue-700",
  "Puzzle Game": "bg-purple-100 text-purple-700",
};

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
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="relative">
            <p className="text-[11px] font-bold text-amber-900/70 uppercase tracking-widest mb-1">NextBigGames</p>
            <h2 className="text-xl font-extrabold text-white leading-tight">Unlock Premium Reports</h2>
            <p className="text-sm text-white/80 mt-1">Access all {REPORTS.length} in-depth analytics reports</p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-3">
          {[
            { icon: "📊", text: "Full access to all game performance reports" },
            { icon: "🎯", text: "Detailed retention, LTV & monetisation breakdowns" },
            { icon: "🔄", text: "New reports added weekly by our analyst team" },
            { icon: "💡", text: "Actionable recommendations per report" },
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

export default function ReportsContent() {
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ReportType | "All">("All");

  const filtered = activeFilter === "All" ? REPORTS : REPORTS.filter((r) => r.type === activeFilter);

  // Determine locked status based on position in the *filtered* list
  return (
    <>
      <main className="flex-1 p-6 min-w-0">
        {/* ── Page Header ── */}
        <div className="flex items-start justify-between mb-5 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-200 flex-shrink-0">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-gray-900">Reports</h1>
              <p className="text-xs text-amber-700/80 font-medium mt-0.5">
                In-depth analytics & performance insights by the NBG team
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
              {UNLOCKED_COUNT} free · {REPORTS.length - UNLOCKED_COUNT} premium
            </span>
            <button
              onClick={() => setPremiumOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold rounded-full shadow-sm shadow-amber-200 transition"
            >
              Unlock All
            </button>
          </div>
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.value;
            const count = tab.value === "All" ? REPORTS.length : REPORTS.filter((r) => r.type === tab.value).length;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all border ${
                  isActive
                    ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-700"
                }`}
              >
                {tab.label}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                  isActive ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Reports Grid ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">No reports for this filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((report) => {
              const isLocked = !UNLOCKED_IDS.has(report.id);
              const thumbIdx = REPORTS.indexOf(report) * 5;

              return (
                <div
                  key={report.id}
                  className={`relative rounded-2xl overflow-hidden border bg-white shadow-sm transition-all ${
                    isLocked
                      ? "border-amber-200/60 cursor-pointer group/locked"
                      : "border-gray-100 hover:shadow-md hover:border-amber-200"
                  }`}
                  onClick={isLocked ? () => setPremiumOpen(true) : undefined}
                >
                  {/* Thumbnail */}
                  <div className={`relative h-32 bg-gray-100 ${isLocked ? "blur-sm" : ""}`}>
                    <img
                      src={thumbSquare(report.game, report.category as never, thumbIdx)}
                      alt={report.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {/* Type badge */}
                    <span className={`absolute top-2.5 right-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[report.type]}`}>
                      {report.type}
                    </span>
                    {/* Key metric */}
                    <div className="absolute bottom-2.5 left-3">
                      <p className="text-white text-lg font-extrabold leading-none">{report.metric}</p>
                      <p className="text-white/70 text-[9px] font-medium mt-0.5">{report.metricLabel}</p>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className={`p-4 ${isLocked ? "blur-sm select-none" : ""}`}>
                    <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{report.date}</p>
                    <h3 className="text-sm font-bold text-gray-900 mb-1.5 leading-snug">{report.title}</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-3">
                      {report.summary}
                    </p>
                    <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-gray-50">
                      <div className="w-4 h-4 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                        <img
                          src={thumbSquare(report.game, report.category as never, thumbIdx)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium truncate">{report.game}</p>
                      <span className="text-gray-200 mx-0.5">·</span>
                      <p className="text-[10px] text-gray-400 truncate">{report.category}</p>
                    </div>
                  </div>

                  {/* Lock overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 group-hover/locked:bg-black/50 transition-colors">
                      <div
                        className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center mb-2.5 group-hover/locked:scale-110 transition-transform"
                        style={{ boxShadow: "0 0 28px 8px rgba(245,158,11,0.45)" }}
                      >
                        <div className="w-10 h-10 rounded-full bg-amber-500/30 flex items-center justify-center">
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#fbbf24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-white text-[11px] font-bold tracking-wide">Premium Only</p>
                      <p className="text-white/60 text-[9px] mt-0.5">Tap to unlock access</p>
                    </div>
                  )}

                  {/* NBG badge on unlocked cards */}
                  {!isLocked && (
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      <svg width="8" height="8" fill="#fbbf24" viewBox="0 0 24 24">
                        <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-[8px] font-bold text-white">NBG Report</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Bottom CTA ── */}
        <div className="mt-8 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border border-amber-200/60 rounded-2xl p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                Unlock {REPORTS.length - UNLOCKED_COUNT} more analytics reports
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                New reports weekly · Retention, LTV & CPI insights · Monetisation tips
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
      </main>

      {premiumOpen && <PremiumModal onClose={() => setPremiumOpen(false)} />}
    </>
  );
}
