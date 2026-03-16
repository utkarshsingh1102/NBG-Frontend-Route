"use client";

export default function ReportsContent() {
  return (
    <main className="flex-1 p-6 min-w-0 flex items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="flex flex-col items-center text-center max-w-sm">

        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-amber-50 border-2 border-amber-100 flex items-center justify-center mb-6 shadow-sm">
          <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={1.6}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        {/* Badge */}
        <span className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
          Coming Soon
        </span>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          In-depth analytics, performance insights, and generation reports are on the way. Check back soon.
        </p>

        {/* Decorative progress dots */}
        <div className="flex items-center gap-2 mt-8">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-amber-300 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-amber-200 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </main>
  );
}
