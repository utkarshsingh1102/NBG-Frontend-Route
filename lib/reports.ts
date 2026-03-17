// Shared report data — used by ReportsContent, API route, and viewer page

export type ReportType = "Promising" | "Failure" | "Idle Game" | "Puzzle Game";

export interface Report {
  id: string;
  file: string;
  title: string;
  type: ReportType;
  month: number; // 1–12
  year: number;
}

export const REPORTS: Report[] = [
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

export const UNLOCKED_IDS = new Set(REPORTS.slice(0, 3).map((r) => r.id));

export const TYPE_COLORS: Record<ReportType, string> = {
  Promising: "bg-green-100 text-green-700",
  Failure: "bg-red-100 text-red-600",
  "Idle Game": "bg-blue-100 text-blue-700",
  "Puzzle Game": "bg-purple-100 text-purple-700",
};

export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
