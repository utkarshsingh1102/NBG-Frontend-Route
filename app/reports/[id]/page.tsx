"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { REPORTS, UNLOCKED_IDS, TYPE_COLORS, MONTHS } from "@/lib/reports";

// ── pdfjs singleton ────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _pdfjs: any = null;
async function getPdfJs() {
  if (_pdfjs) return _pdfjs;
  _pdfjs = await import("pdfjs-dist");
  _pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
  return _pdfjs;
}

// ── Tiled watermark — overlaid on every page ───────────────────────────────────
function TiledWatermark({ userId }: { userId: string }) {
  const label = `CONFIDENTIAL · NBG REPORT · ${userId}`;
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 10 }}
    >
      {Array.from({ length: 15 }).map((_, i) => (
        <span
          key={i}
          className="absolute text-gray-500 font-bold"
          style={{
            left: `${(i % 3) * 33 + 5}%`,
            top: `${Math.floor(i / 3) * 20 + 5}%`,
            transform: "rotate(-28deg)",
            fontSize: "13px",
            opacity: 0.13,
            whiteSpace: "nowrap",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

// ── Blur overlay when tab loses focus ─────────────────────────────────────────
function TabBlurOverlay() {
  return (
    <div className="fixed inset-0 z-50 bg-gray-950/97 backdrop-blur-2xl flex flex-col items-center justify-center gap-4">
      <div
        className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center"
        style={{ boxShadow: "0 0 50px 15px rgba(245,158,11,0.25)" }}
      >
        <svg width="34" height="34" fill="none" viewBox="0 0 24 24" stroke="#fbbf24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <p className="text-white font-semibold text-lg">Content Protected</p>
      <p className="text-gray-400 text-sm">Return to this tab to continue viewing</p>
    </div>
  );
}

// ── Main viewer page ───────────────────────────────────────────────────────────
export default function ReportViewerPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const report = REPORTS.find((r) => r.id === id);

  const [pages, setPages] = useState<string[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [viewStatus, setViewStatus] = useState<"auth" | "loading" | "ready" | "error">("auth");
  const [isTabBlurred, setIsTabBlurred] = useState(false);
  const [userId, setUserId] = useState("NBG User");

  // ── Auth check ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const session = sessionStorage.getItem("nbg_session");
    if (!session) { router.replace("/"); return; }
    if (!report || !UNLOCKED_IDS.has(id)) { router.replace("/"); return; }
    setUserId(sessionStorage.getItem("nbg_user") || "NBG User");
    setViewStatus("loading");
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Load PDF via protected API route ─────────────────────────────────────────
  useEffect(() => {
    if (viewStatus !== "loading") return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/reports/${id}`);
        if (!res.ok) { setViewStatus("error"); return; }

        const buffer = await res.arrayBuffer();
        if (cancelled) return;

        const pdfjs = await getPdfJs();
        const pdf = await pdfjs.getDocument({ data: buffer }).promise;
        if (cancelled) return;

        const n: number = pdf.numPages;
        setTotalPages(n);
        const urls: string[] = new Array(n).fill("");

        for (let i = 1; i <= n; i++) {
          if (cancelled) return;
          const page = await pdf.getPage(i);
          const unscaled = page.getViewport({ scale: 1 });
          const scale = Math.min(1920 / unscaled.width, 1080 / unscaled.height);
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          canvas.width = 1920;
          canvas.height = 1080;
          const ctx = canvas.getContext("2d")!;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, 1920, 1080);
          const offsetX = Math.round((1920 - viewport.width) / 2);
          const offsetY = Math.round((1080 - viewport.height) / 2);
          await page.render({
            canvasContext: ctx,
            viewport,
            transform: [1, 0, 0, 1, offsetX, offsetY],
          }).promise;

          if (cancelled) return;
          urls[i - 1] = canvas.toDataURL("image/jpeg", 0.92);
          setLoadedCount(i);
          // Show pages progressively as they render
          setPages([...urls]);
        }

        if (!cancelled) setViewStatus("ready");
      } catch {
        if (!cancelled) setViewStatus("error");
      }
    })();

    return () => { cancelled = true; };
  }, [viewStatus, id]);

  // ── Security event listeners ──────────────────────────────────────────────────
  useEffect(() => {
    // Disable right-click context menu
    const noContext = (e: MouseEvent) => e.preventDefault();

    // Block copy/save/print/view-source/inspect keyboard shortcuts
    const noKeys = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (["c", "s", "p", "u", "a", "j", "i"].includes(e.key.toLowerCase())) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
      if (e.key === "PrintScreen" || e.key === "F12") {
        e.preventDefault();
      }
    };

    // Blur overlay on tab switch / minimize
    const onVisibility = () => setIsTabBlurred(document.hidden);

    document.addEventListener("contextmenu", noContext);
    document.addEventListener("keydown", noKeys, true);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("contextmenu", noContext);
      document.removeEventListener("keydown", noKeys, true);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const dateLabel = report ? `${MONTHS[report.month - 1]} ${report.year}` : "";

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-[#0e0f11] select-none"
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* ── Tab-blur protection overlay ── */}
      {isTabBlurred && <TabBlurOverlay />}

      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-40 h-14 bg-[#13141a]/95 backdrop-blur-md border-b border-white/[0.06] flex items-center px-5 gap-4">
        {/* Back button */}
        <button
          onClick={() => router.push("/?page=Reports")}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm font-medium transition-colors flex-shrink-0"
        >
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        {/* Title area */}
        <div className="flex-1 min-w-0 flex items-center justify-center gap-2.5">
          {report && (
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${TYPE_COLORS[report.type]}`}>
              {report.type}
            </span>
          )}
          <h1 className="text-white/90 text-sm font-semibold truncate">{report?.title}</h1>
          <span className="text-gray-500 text-xs flex-shrink-0 hidden sm:block">{dateLabel}</span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {viewStatus === "loading" && (
            <span className="text-amber-400/80 text-[11px] font-medium">
              {loadedCount}/{totalPages || "…"} pages
            </span>
          )}
          {viewStatus === "ready" && (
            <span className="text-gray-500 text-[11px]">{totalPages} pages</span>
          )}
          {/* Protected badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-white/[0.05] border border-white/[0.08] rounded-full px-2.5 py-1">
            <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="#fbbf24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-gray-400 text-[9px] font-bold tracking-wide">PROTECTED</span>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="max-w-5xl mx-auto py-8 px-4">

        {/* Loading — no pages yet */}
        {viewStatus === "loading" && pages.filter(Boolean).length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-5">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#fbbf24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <p className="text-white/70 text-sm font-medium">Preparing secure viewer</p>
              <p className="text-gray-500 text-xs mt-1">Validating access & rendering pages…</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {viewStatus === "error" && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#f87171" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-400 text-sm">Failed to load report. You may not have access.</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setViewStatus("loading"); setPages([]); setLoadedCount(0); }}
                className="text-xs text-gray-300 border border-gray-700 hover:border-gray-500 rounded-lg px-4 py-2 transition"
              >
                Retry
              </button>
              <button
                onClick={() => router.push("/?page=Reports")}
                className="text-xs text-amber-400 border border-amber-500/40 hover:border-amber-500 rounded-lg px-4 py-2 transition"
              >
                Back to Reports
              </button>
            </div>
          </div>
        )}

        {/* ── PDF Pages ── */}
        <div className="space-y-3">
          {pages.map((url, i) =>
            url ? (
              <div
                key={i}
                className="relative w-full aspect-video rounded-xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.6)] ring-1 ring-white/[0.06]"
              >
                <img
                  src={url}
                  alt={`Page ${i + 1}`}
                  className="w-full h-full object-fill block"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
                {/* Per-page tiled watermark */}
                <TiledWatermark userId={userId} />
                {/* Page number badge */}
                <div className="absolute bottom-2.5 right-3 bg-black/50 backdrop-blur-sm text-white/40 text-[10px] font-medium rounded px-2 py-0.5 select-none">
                  {i + 1} / {totalPages}
                </div>
              </div>
            ) : null
          )}
        </div>

        {/* Loading more pages indicator */}
        {viewStatus === "loading" && pages.filter(Boolean).length > 0 && (
          <div className="flex items-center justify-center py-8 gap-2.5 text-gray-500 text-sm">
            <div className="w-4 h-4 rounded-full border-[1.5px] border-amber-500/40 border-t-amber-500 animate-spin flex-shrink-0" />
            <span>Rendering page {loadedCount + 1} of {totalPages}…</span>
          </div>
        )}

        {/* Footer when fully loaded */}
        {viewStatus === "ready" && (
          <div className="flex flex-col items-center py-12 gap-3 border-t border-white/[0.06] mt-6">
            <div className="flex items-center gap-2 text-gray-600 text-[11px] text-center">
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              This report is protected by NBG Security. Unauthorized reproduction is prohibited.
            </div>
            <button
              onClick={() => router.push("/?page=Reports")}
              className="text-xs text-amber-500 hover:text-amber-400 font-medium transition mt-1"
            >
              ← Back to Reports Archive
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
