"use client";

import { useState, useEffect } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

type ReportType = "Promising" | "Failure" | "Idle Game" | "Puzzle Game";

interface Report {
  id: string;
  file: string;
  title: string;
  type: ReportType;
  month: number; // 1–12
  year: number;
}

// ── Data ───────────────────────────────────────────────────────────────────────

const REPORTS: Report[] = [
  {
    id: "r1",
    file: "ARROW AND DIRECTION-BASED PUZZLE GAMES.pdf",
    title: "Arrow & Direction-Based Puzzle Games",
    type: "Puzzle Game",
    month: 11,
    year: 2025,
  },
  {
    id: "r2",
    file: "Copy of Puzzle Games Revenue Trends Report.pdf",
    title: "Puzzle Games Revenue Trends Report",
    type: "Puzzle Game",
    month: 10,
    year: 2025,
  },
  {
    id: "r3",
    file: "December puzzle promising report.pdf",
    title: "December Puzzle Promising Report",
    type: "Promising",
    month: 12,
    year: 2025,
  },
  {
    id: "r4",
    file: "february promising puzzle.pdf",
    title: "February Promising Puzzle",
    type: "Promising",
    month: 2,
    year: 2026,
  },
  {
    id: "r5",
    file: "Game Overview Core Gameplay Mechanics Spinning Machine Islands Building Social PvP Framework Card Collection System Event Systems Portfolio.pdf",
    title: "Spinning Machine Islands — Full Portfolio Overview",
    type: "Promising",
    month: 1,
    year: 2026,
  },
  {
    id: "r6",
    file: "Hex Forge.pdf",
    title: "Hex Forge — Game Analysis",
    type: "Promising",
    month: 2,
    year: 2026,
  },
  {
    id: "r7",
    file: "Horse Racing Idle Tap Tap.pdf",
    title: "Horse Racing Idle Tap Tap",
    type: "Idle Game",
    month: 9,
    year: 2025,
  },
  {
    id: "r8",
    file: "Idle Promising Games Report.pdf",
    title: "Idle Promising Games Report",
    type: "Promising",
    month: 1,
    year: 2026,
  },
  {
    id: "r9",
    file: "Idle Promising.pdf",
    title: "Idle Games — Promising Opportunities",
    type: "Promising",
    month: 12,
    year: 2025,
  },
  {
    id: "r10",
    file: "January 2026 Idle Probable Failures.pdf",
    title: "January 2026 — Idle Probable Failures",
    type: "Failure",
    month: 1,
    year: 2026,
  },
  {
    id: "r11",
    file: "July 2025 idle, runner, and action gaming .pdf",
    title: "July 2025: Idle, Runner & Action Gaming",
    type: "Idle Game",
    month: 7,
    year: 2025,
  },
  {
    id: "r12",
    file: "match factory premium report.pdf",
    title: "Match Factory Premium Report",
    type: "Promising",
    month: 2,
    year: 2026,
  },
  {
    id: "r13",
    file: "Merge 2 market overview.pdf",
    title: "Merge 2 — Market Overview",
    type: "Promising",
    month: 1,
    year: 2026,
  },
  {
    id: "r14",
    file: "Mobile Game Trends Report - January.pdf",
    title: "Mobile Game Trends Report — January",
    type: "Promising",
    month: 1,
    year: 2026,
  },
  {
    id: "r15",
    file: "Puzzle June Failures.pdf",
    title: "Puzzle Games — June Failure Analysis",
    type: "Failure",
    month: 6,
    year: 2025,
  },
  {
    id: "r16",
    file: "sept IDLE GAME TRENDS.pdf",
    title: "September — Idle Game Trends",
    type: "Idle Game",
    month: 9,
    year: 2025,
  },
  {
    id: "r17",
    file: "The color-by-number mobile game category has shown remarkable resilience and growth over the past eight years, generating over $290 million in in-app purchases (IAP) and accumulating more than 2.1.pdf",
    title: "Color-by-Number Mobile: $290M Growth Report",
    type: "Puzzle Game",
    month: 11,
    year: 2025,
  },
  {
    id: "r18",
    file: "The nut and bolt sorting genre.pdf",
    title: "Nut & Bolt Sorting Genre Analysis",
    type: "Puzzle Game",
    month: 1,
    year: 2026,
  },
  {
    id: "r19",
    file: "Top 40 Most Active Investors to Look Out for in Mobile Gaming Space.pdf",
    title: "Top 40 Most Active Mobile Gaming Investors",
    type: "Promising",
    month: 3,
    year: 2026,
  },
];

const UNLOCKED_COUNT = 3;
const UNLOCKED_IDS = new Set(REPORTS.slice(0, UNLOCKED_COUNT).map((r) => r.id));

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEARS = [2025, 2026];

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

// ── PDF module singleton ────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _pdfjs: any = null;
async function getPdfJs() {
  if (_pdfjs) return _pdfjs;
  _pdfjs = await import("pdfjs-dist");
  _pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
  return _pdfjs;
}

// ── PdfThumbnail ──────────────────────────────────────────────────────────────

function PdfThumbnail({ file }: { file: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pdfjs = await getPdfJs();
        const url = `/reports/${encodeURIComponent(file)}`;
        const loadingTask = pdfjs.getDocument(url);
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        const page = await pdf.getPage(1);
        if (cancelled) return;
        const unscaled = page.getViewport({ scale: 1 });
        const scale = Math.min(1920 / unscaled.width, 1080 / unscaled.height);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = 1920;
        canvas.height = 1080;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#f8f9fa";
        ctx.fillRect(0, 0, 1920, 1080);
        const offsetX = Math.round((1920 - viewport.width) / 2);
        const offsetY = Math.round((1080 - viewport.height) / 2);
        if (cancelled) return;
        await page.render({ canvasContext: ctx, viewport, transform: [1, 0, 0, 1, offsetX, offsetY] }).promise;
        if (!cancelled) {
          setDataUrl(canvas.toDataURL("image/jpeg", 0.82));
          setStatus("done");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [file]);

  if (status === "error") {
    return (
      <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center gap-1.5">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#d1d5db" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-[9px] text-gray-400">Preview unavailable</p>
      </div>
    );
  }

  return (
    <>
      {status === "loading" && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {dataUrl && (
        <img
          src={dataUrl}
          alt=""
          className="w-full h-full object-fill"
        />
      )}
    </>
  );
}

// ── PremiumModal ──────────────────────────────────────────────────────────────

function PremiumModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 px-6 pt-8 pb-6 flex flex-col items-center gap-3 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: "radial-gradient(circle at 50% 40%, white 0%, transparent 70%)" }}
          />
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
            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
              7-day free trial
            </span>
          </div>

          <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm rounded-xl transition shadow-md shadow-amber-200">
            Start Free Trial →
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 transition"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ReportsContent() {
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ReportType | "All">("All");
  const [fromMonth, setFromMonth] = useState<number | null>(null);
  const [fromYear, setFromYear] = useState<number | null>(null);
  const [toMonth, setToMonth] = useState<number | null>(null);
  const [toYear, setToYear] = useState<number | null>(null);

  const hasDateFilter = fromYear !== null || toYear !== null;

  function clearDateFilter() {
    setFromMonth(null);
    setFromYear(null);
    setToMonth(null);
    setToYear(null);
  }

  const filtered = REPORTS.filter((r) => {
    if (activeFilter !== "All" && r.type !== activeFilter) return false;
    const rDate = r.year * 100 + r.month;
    if (fromYear !== null && rDate < fromYear * 100 + (fromMonth ?? 1)) return false;
    if (toYear !== null && rDate > toYear * 100 + (toMonth ?? 12)) return false;
    return true;
  });

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
                In-depth analytics &amp; performance insights by the NBG team
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

        {/* ── Type Filter Tabs ── */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.value;
            const count =
              tab.value === "All"
                ? REPORTS.length
                : REPORTS.filter((r) => r.type === tab.value).length;
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
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                    isActive ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Date Range Filter ── */}
        <div className="flex items-center gap-3 flex-wrap mb-6 bg-white border border-gray-100 rounded-xl px-4 py-3">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide flex-shrink-0">
            Date Range
          </span>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 flex-shrink-0">From</span>
            <select
              value={fromMonth ?? ""}
              onChange={(e) => setFromMonth(e.target.value ? +e.target.value : null)}
              className="text-[12px] border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-amber-400 transition"
            >
              <option value="">Month</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              value={fromYear ?? ""}
              onChange={(e) => setFromYear(e.target.value ? +e.target.value : null)}
              className="text-[12px] border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-amber-400 transition"
            >
              <option value="">Year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <span className="text-gray-300 flex-shrink-0">→</span>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 flex-shrink-0">To</span>
            <select
              value={toMonth ?? ""}
              onChange={(e) => setToMonth(e.target.value ? +e.target.value : null)}
              className="text-[12px] border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-amber-400 transition"
            >
              <option value="">Month</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              value={toYear ?? ""}
              onChange={(e) => setToYear(e.target.value ? +e.target.value : null)}
              className="text-[12px] border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-amber-400 transition"
            >
              <option value="">Year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {hasDateFilter && (
            <button
              onClick={clearDateFilter}
              className="text-[11px] text-red-400 hover:text-red-600 font-semibold transition ml-auto flex-shrink-0"
            >
              Clear ×
            </button>
          )}
        </div>

        {/* ── Reports Grid ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">No reports match this filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((report) => {
              const isLocked = !UNLOCKED_IDS.has(report.id);
              const dateLabel = `${MONTHS[report.month - 1]} ${report.year}`;

              return (
                <div
                  key={report.id}
                  className={`rounded-2xl overflow-hidden border bg-white shadow-sm transition-all ${
                    isLocked
                      ? "border-amber-200/60 cursor-pointer group/locked"
                      : "border-gray-100 hover:shadow-md hover:border-amber-200"
                  }`}
                  onClick={isLocked ? () => setPremiumOpen(true) : undefined}
                >
                  {/* ── Thumbnail ── */}
                  <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
                    <div className={`w-full h-full${isLocked ? " blur-sm" : ""}`}>
                      <PdfThumbnail file={report.file} />
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                    {/* NBG badge — unlocked only */}
                    {!isLocked && (
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        <svg width="8" height="8" fill="#fbbf24" viewBox="0 0 24 24">
                          <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-[8px] font-bold text-white">NBG Report</span>
                      </div>
                    )}

                    {/* Type + date — unlocked only */}
                    {!isLocked && (
                      <>
                        <span className={`absolute top-2.5 right-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[report.type]}`}>
                          {report.type}
                        </span>
                        <div className="absolute bottom-2.5 left-3">
                          <p className="text-white/80 text-[10px] font-semibold">{dateLabel}</p>
                        </div>
                      </>
                    )}

                    {/* Lock overlay — thumbnail area only */}
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
                  </div>

                  {/* ── Card body — always visible ── */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[report.type]}`}>
                        {report.type}
                      </span>
                      {isLocked && (
                        <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Premium
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                      {report.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-gray-50">
                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-[10px] text-gray-400 font-medium">NBG Report</p>
                      <span className="text-gray-200 mx-0.5">·</span>
                      <p className="text-[10px] text-gray-400">{dateLabel}</p>
                    </div>
                  </div>
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
                New reports weekly · Retention, LTV &amp; CPI insights · Monetisation tips
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
