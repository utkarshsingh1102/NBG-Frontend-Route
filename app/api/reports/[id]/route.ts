import { NextRequest, NextResponse } from "next/server";
import { REPORTS, UNLOCKED_IDS } from "@/lib/reports";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // ── Auth check ──────────────────────────────────────────────────────────────
  const session = req.cookies.get("nbg_session")?.value;
  if (!session || session !== "active") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Report lookup (server-side allowlist — no path traversal possible) ──────
  const report = REPORTS.find((r) => r.id === params.id);
  if (!report) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // ── Premium gate ─────────────────────────────────────────────────────────────
  if (!UNLOCKED_IDS.has(params.id)) {
    return NextResponse.json({ error: "Premium required" }, { status: 403 });
  }

  // ── Fetch from static public URL (avoids bundling PDFs into the Lambda) ─────
  // PDFs live in /public/reports/ and are served as static assets by Vercel CDN.
  // We fetch them server-side so the raw file URL is never exposed to the client.
  const origin = req.nextUrl.origin;
  const staticUrl = `${origin}/reports/${encodeURIComponent(report.file)}`;

  const pdfRes = await fetch(staticUrl);
  if (!pdfRes.ok) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const buffer = await pdfRes.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="report.pdf"`,
      "X-Frame-Options": "DENY",
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'self'",
    },
  });
}
