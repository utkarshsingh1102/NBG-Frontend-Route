import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { REPORTS, UNLOCKED_IDS } from "@/lib/reports";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // ── Auth check ──────────────────────────────────────────────────────────────
  // Validates the session cookie set by AppLayout on app load.
  // In production: replace with a real session/JWT check.
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

  // ── File read ────────────────────────────────────────────────────────────────
  const filePath = path.join(process.cwd(), "public", "reports", report.file);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      // inline = display in viewer, never prompt "Save As"
      "Content-Disposition": `inline; filename="report.pdf"`,
      // Block embedding in any iframe
      "X-Frame-Options": "DENY",
      // Never cache — fresh auth check every time
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      "X-Content-Type-Options": "nosniff",
      // CSP: only this origin can load the response
      "Content-Security-Policy": "default-src 'self'",
    },
  });
}
