export interface Game {
  id: string;
  title: string;
  thumbnail: string;
  category: "Puzzle" | "Casual" | "Arcade" | "Runner" | "Match3" | "Strategy" | "Merge" | "Idle" | "Hypercasual" | "Simulation";
  rating: number;
  plays: number;
  status: "published" | "draft";
  platform: "Mobile" | "Desktop" | "Web";
  studio?: string;
}

// Vibrant color pairs [bg, text] to simulate colorful mobile game screenshots
const PALETTES: Record<string, string[][]> = {
  Puzzle:       [["ff6b35","fff"],["f7c59f","333"],["ffe66d","333"],["4ecdc4","fff"],["ff6b9d","fff"]],
  Casual:       [["a8e6cf","333"],["ffd3a5","333"],["fd9853","fff"],["c5a3ff","fff"],["ffb347","333"]],
  Arcade:       [["f72585","fff"],["7209b7","fff"],["3a0ca3","fff"],["4361ee","fff"],["4cc9f0","333"]],
  Runner:       [["06d6a0","fff"],["118ab2","fff"],["073b4c","fff"],["ffd166","333"],["ef476f","fff"]],
  Match3:       [["ff4d6d","fff"],["ff758c","fff"],["ff9a3c","fff"],["ffc300","333"],["d62839","fff"]],
  Strategy:     [["264653","fff"],["2a9d8f","fff"],["e9c46a","333"],["f4a261","fff"],["e76f51","fff"]],
  Merge:        [["7b2d8b","fff"],["9b4dca","fff"],["c77dff","333"],["e0aaff","333"],["d4a5f5","333"]],
  Idle:         [["003049","fff"],["d62828","fff"],["f77f00","fff"],["fcbf49","333"],["eae2b7","333"]],
  Hypercasual:  [["00b4d8","fff"],["0077b6","fff"],["90e0ef","333"],["caf0f8","333"],["48cae4","333"]],
  Simulation:   [["606c38","fff"],["283618","fff"],["fefae0","333"],["dda15e","fff"],["bc6c25","fff"]],
};

function makeSvg(title: string, bg: string, fg: string, w: number, h: number): string {
  const words = title.split(" ");
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");
  const fs = Math.min(w, h) <= 160 ? 13 : 15;
  const cy = h / 2;
  const textNodes = line2
    ? `<text x="${w / 2}" y="${cy - fs * 0.7}" font-family="Arial,sans-serif" font-size="${fs}" font-weight="700" fill="#${fg}" text-anchor="middle">${line1}</text><text x="${w / 2}" y="${cy + fs * 0.9}" font-family="Arial,sans-serif" font-size="${fs}" font-weight="700" fill="#${fg}" text-anchor="middle">${line2}</text>`
    : `<text x="${w / 2}" y="${cy}" font-family="Arial,sans-serif" font-size="${fs}" font-weight="700" fill="#${fg}" text-anchor="middle" dominant-baseline="middle">${line1}</text>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#${bg}"/>${textNodes}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function thumb(title: string, category: Game["category"], idx: number): string {
  const palette = PALETTES[category] ?? PALETTES.Casual;
  const [bg, fg] = palette[idx % palette.length];
  return makeSvg(title, bg, fg, 320, 180);
}

// Square thumbnails for modal / combo cards
export function thumbSquare(title: string, category: Game["category"], idx: number): string {
  const palette = PALETTES[category] ?? PALETTES.Casual;
  const [bg, fg] = palette[idx % palette.length];
  return makeSvg(title, bg, fg, 160, 160);
}

// ── Themes ──────────────────────────────────────────────────────────────────
export interface Theme {
  id: string;
  label: string;
  emoji: string;
}

// Flat colors for theme icon tiles (cycles through these by index)
const THEME_COLORS: [string, string][] = [
  ["ff6b35","fff"],["f7c59f","333"],["ffe66d","333"],["4ecdc4","fff"],["ff6b9d","fff"],
  ["a8e6cf","333"],["ffd3a5","333"],["fd9853","fff"],["c5a3ff","fff"],["ffb347","333"],
  ["f72585","fff"],["7209b7","fff"],["4361ee","fff"],["4cc9f0","333"],["06d6a0","fff"],
  ["118ab2","fff"],["ffd166","333"],["ef476f","fff"],["ff4d6d","fff"],["ffc300","333"],
  ["264653","fff"],["2a9d8f","fff"],["e9c46a","333"],["f4a261","fff"],["e76f51","fff"],
];

export function themeIcon(idx: number): string {
  const [bg, fg] = THEME_COLORS[idx % THEME_COLORS.length];
  const letter = String.fromCharCode(65 + (idx % 26));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="12" fill="#${bg}"/><text x="40" y="40" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#${fg}" text-anchor="middle" dominant-baseline="middle">${letter}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const THEMES: Theme[] = [
  { id: "t1",  label: "Aeroplane",    emoji: "✈️" },
  { id: "t2",  label: "Airport",      emoji: "🛫" },
  { id: "t3",  label: "Alien",        emoji: "👽" },
  { id: "t4",  label: "Animals",      emoji: "🐾" },
  { id: "t5",  label: "Archery",      emoji: "🏹" },
  { id: "t6",  label: "Arrows",       emoji: "➡️" },
  { id: "t7",  label: "ASMR Cutting", emoji: "✂️" },
  { id: "t8",  label: "Balls",        emoji: "⚽" },
  { id: "t9",  label: "Blocks",       emoji: "🧱" },
  { id: "t10", label: "Boats",        emoji: "⛵" },
  { id: "t11", label: "Bus",          emoji: "🚌" },
  { id: "t12", label: "Candy",        emoji: "🍬" },
  { id: "t13", label: "Cannon",       emoji: "💣" },
  { id: "t14", label: "Car",          emoji: "🚗" },
  { id: "t15", label: "Cards",        emoji: "🃏" },
  { id: "t16", label: "Castle",       emoji: "🏰" },
  { id: "t17", label: "City",         emoji: "🏙️" },
  { id: "t18", label: "Coffee",       emoji: "☕" },
  { id: "t19", label: "Coin",         emoji: "🪙" },
  { id: "t20", label: "Crowd",        emoji: "👥" },
  { id: "t21", label: "Dice",         emoji: "🎲" },
  { id: "t22", label: "Farm",         emoji: "🌾" },
  { id: "t23", label: "Fashion",      emoji: "👗" },
  { id: "t24", label: "Flowers",      emoji: "🌸" },
  { id: "t25", label: "Food",         emoji: "🍔" },
  { id: "t26", label: "Fruits",       emoji: "🍎" },
  { id: "t27", label: "Gems",         emoji: "💎" },
  { id: "t28", label: "Goods",        emoji: "📦" },
  { id: "t29", label: "Gun",          emoji: "🔫" },
  { id: "t30", label: "Hexa Blocks",  emoji: "⬡" },
  { id: "t31", label: "Hole",         emoji: "🕳️" },
  { id: "t32", label: "Jelly",        emoji: "🍮" },
  { id: "t33", label: "Jungle",       emoji: "🌿" },
  { id: "t34", label: "Kingdom",      emoji: "👑" },
  { id: "t35", label: "Knit / Yarn",  emoji: "🧶" },
  { id: "t36", label: "Liquid",       emoji: "💧" },
  { id: "t37", label: "Lumber",       emoji: "🪵" },
  { id: "t38", label: "Makeover",     emoji: "💄" },
  { id: "t39", label: "Marbles",      emoji: "🔮" },
  { id: "t40", label: "Mining",       emoji: "⛏️" },
  { id: "t41", label: "Money",        emoji: "💰" },
  { id: "t42", label: "Monsters",     emoji: "👾" },
  { id: "t43", label: "Numbers",      emoji: "🔢" },
  { id: "t44", label: "Ocean",        emoji: "🌊" },
  { id: "t45", label: "Office",       emoji: "🏢" },
  { id: "t46", label: "Parking",      emoji: "🅿️" },
  { id: "t47", label: "People",       emoji: "🧑" },
  { id: "t48", label: "Planets",      emoji: "🪐" },
  { id: "t49", label: "Rope",         emoji: "🪢" },
  { id: "t50", label: "Russian Doll", emoji: "🪆" },
  { id: "t51", label: "Sand",         emoji: "🏖️" },
  { id: "t52", label: "Screws",       emoji: "🔩" },
  { id: "t53", label: "Ship",         emoji: "🚢" },
  { id: "t54", label: "Slime",        emoji: "🟢" },
  { id: "t55", label: "Slinky",       emoji: "🌀" },
  { id: "t56", label: "Space",        emoji: "🚀" },
  { id: "t57", label: "Sushi",        emoji: "🍣" },
  { id: "t58", label: "Tools",        emoji: "🔧" },
  { id: "t59", label: "Toys",         emoji: "🧸" },
  { id: "t60", label: "Water",        emoji: "💦" },
];

export const games: Game[] = [
  // Puzzle
  { id: "1",  title: "Gecko Out",        thumbnail: thumb("Gecko Out",       "Puzzle", 0), category: "Puzzle",       rating: 4.7, plays: 2140000, status: "published", platform: "Mobile" },
  { id: "2",  title: "Block Jam",        thumbnail: thumb("Block Jam",       "Puzzle", 1), category: "Puzzle",       rating: 4.5, plays: 1890000, status: "published", platform: "Mobile" },
  { id: "3",  title: "Knit Out",         thumbnail: thumb("Knit Out",        "Puzzle", 2), category: "Puzzle",       rating: 4.3, plays: 982000,  status: "published", platform: "Mobile" },
  { id: "4",  title: "Color Block Jam",  thumbnail: thumb("Color Block Jam", "Puzzle", 3), category: "Puzzle",       rating: 4.6, plays: 3210000, status: "published", platform: "Mobile" },
  { id: "5",  title: "Hole People",      thumbnail: thumb("Hole People",     "Puzzle", 4), category: "Puzzle",       rating: 4.2, plays: 765000,  status: "published", platform: "Mobile" },
  { id: "6",  title: "Drop Away",        thumbnail: thumb("Drop Away",       "Puzzle", 0), category: "Puzzle",       rating: 4.8, plays: 4320000, status: "published", platform: "Mobile" },
  { id: "7",  title: "Drop Jelly",       thumbnail: thumb("Drop Jelly",      "Puzzle", 1), category: "Puzzle",       rating: 4.4, plays: 1230000, status: "published", platform: "Mobile" },
  { id: "8",  title: "Jello Blast",      thumbnail: thumb("Jello Blast",     "Puzzle", 2), category: "Puzzle",       rating: 4.5, plays: 2780000, status: "published", platform: "Mobile" },
  { id: "9",  title: "Bolt Sort Puzzle", thumbnail: thumb("Bolt Sort",       "Puzzle", 3), category: "Puzzle",       rating: 4.6, plays: 3540000, status: "published", platform: "Mobile" },
  { id: "10", title: "Color Flow",       thumbnail: thumb("Color Flow",      "Puzzle", 4), category: "Puzzle",       rating: 4.3, plays: 1120000, status: "published", platform: "Mobile" },
  { id: "11", title: "Pipe Connect",     thumbnail: thumb("Pipe Connect",    "Puzzle", 0), category: "Puzzle",       rating: 4.1, plays: 678000,  status: "published", platform: "Web"    },
  { id: "12", title: "Zen Sort 3D",      thumbnail: thumb("Zen Sort 3D",     "Puzzle", 1), category: "Puzzle",       rating: 4.7, plays: 5120000, status: "published", platform: "Mobile" },

  // Casual
  { id: "13", title: "Park Match",       thumbnail: thumb("Park Match",      "Casual", 0), category: "Casual",       rating: 4.5, plays: 2870000, status: "published", platform: "Mobile" },
  { id: "14", title: "Seat Away",        thumbnail: thumb("Seat Away",       "Casual", 1), category: "Casual",       rating: 4.4, plays: 1560000, status: "published", platform: "Mobile" },
  { id: "15", title: "Bus Jam",          thumbnail: thumb("Bus Jam",         "Casual", 2), category: "Casual",       rating: 4.6, plays: 3980000, status: "published", platform: "Mobile" },
  { id: "16", title: "Load the Dishes",  thumbnail: thumb("Load Dishes",     "Casual", 3), category: "Casual",       rating: 4.2, plays: 892000,  status: "published", platform: "Mobile" },
  { id: "17", title: "Transport People", thumbnail: thumb("Transport",       "Casual", 4), category: "Casual",       rating: 4.3, plays: 1240000, status: "published", platform: "Mobile" },
  { id: "18", title: "Marble Puller",    thumbnail: thumb("Marble Puller",   "Casual", 0), category: "Casual",       rating: 4.5, plays: 2310000, status: "published", platform: "Mobile" },
  { id: "19", title: "Crowd Express",    thumbnail: thumb("Crowd Express",   "Casual", 1), category: "Casual",       rating: 4.1, plays: 765000,  status: "published", platform: "Mobile" },
  { id: "20", title: "Fill The Fridge",  thumbnail: thumb("Fill Fridge",     "Casual", 2), category: "Casual",       rating: 4.4, plays: 1890000, status: "draft",     platform: "Mobile" },
  { id: "21", title: "Match Town",       thumbnail: thumb("Match Town",      "Casual", 3), category: "Casual",       rating: 4.6, plays: 3120000, status: "published", platform: "Mobile" },
  { id: "22", title: "Tiny Kitchen",     thumbnail: thumb("Tiny Kitchen",    "Casual", 4), category: "Casual",       rating: 4.0, plays: 543000,  status: "published", platform: "Web"    },

  // Arcade
  { id: "23", title: "Slither Blast",    thumbnail: thumb("Slither Blast",   "Arcade", 0), category: "Arcade",       rating: 4.7, plays: 4120000, status: "published", platform: "Mobile" },
  { id: "24", title: "Aqua Rush",        thumbnail: thumb("Aqua Rush",       "Arcade", 1), category: "Arcade",       rating: 4.5, plays: 2340000, status: "published", platform: "Mobile" },
  { id: "25", title: "Sky Rush",         thumbnail: thumb("Sky Rush",        "Arcade", 2), category: "Arcade",       rating: 4.6, plays: 3560000, status: "published", platform: "Mobile" },
  { id: "26", title: "Neon Blaster",     thumbnail: thumb("Neon Blaster",    "Arcade", 3), category: "Arcade",       rating: 4.4, plays: 1870000, status: "published", platform: "Web"    },
  { id: "27", title: "Pixel Crusher",    thumbnail: thumb("Pixel Crusher",   "Arcade", 4), category: "Arcade",       rating: 4.3, plays: 1230000, status: "published", platform: "Mobile" },
  { id: "28", title: "Bounce Rush",      thumbnail: thumb("Bounce Rush",     "Arcade", 0), category: "Arcade",       rating: 4.2, plays: 987000,  status: "published", platform: "Mobile" },
  { id: "29", title: "Smash Bricks",     thumbnail: thumb("Smash Bricks",    "Arcade", 1), category: "Arcade",       rating: 4.5, plays: 2780000, status: "published", platform: "Mobile" },
  { id: "30", title: "Bubble Pop X",     thumbnail: thumb("Bubble Pop X",    "Arcade", 2), category: "Arcade",       rating: 4.6, plays: 3450000, status: "published", platform: "Mobile" },

  // Runner
  { id: "31", title: "Drive Quest",      thumbnail: thumb("Drive Quest",     "Runner", 0), category: "Runner",       rating: 4.5, plays: 3210000, status: "published", platform: "Mobile" },
  { id: "32", title: "Road Rush 3D",     thumbnail: thumb("Road Rush 3D",    "Runner", 1), category: "Runner",       rating: 4.4, plays: 2890000, status: "published", platform: "Mobile" },
  { id: "33", title: "Temple Dash",      thumbnail: thumb("Temple Dash",     "Runner", 2), category: "Runner",       rating: 4.6, plays: 5670000, status: "published", platform: "Mobile" },
  { id: "34", title: "Subway Flip",      thumbnail: thumb("Subway Flip",     "Runner", 3), category: "Runner",       rating: 4.3, plays: 1980000, status: "published", platform: "Mobile" },
  { id: "35", title: "Parkour Hero",     thumbnail: thumb("Parkour Hero",    "Runner", 4), category: "Runner",       rating: 4.5, plays: 3120000, status: "published", platform: "Web"    },
  { id: "36", title: "Sky Jump Pro",     thumbnail: thumb("Sky Jump Pro",    "Runner", 0), category: "Runner",       rating: 4.2, plays: 1450000, status: "published", platform: "Mobile" },
  { id: "37", title: "Neon Runner X",    thumbnail: thumb("Neon Runner X",   "Runner", 1), category: "Runner",       rating: 4.7, plays: 4320000, status: "published", platform: "Mobile" },

  // Match3
  { id: "38", title: "Candy Storm",      thumbnail: thumb("Candy Storm",     "Match3", 0), category: "Match3",       rating: 4.6, plays: 6780000, status: "published", platform: "Mobile" },
  { id: "39", title: "Gem Cascade",      thumbnail: thumb("Gem Cascade",     "Match3", 1), category: "Match3",       rating: 4.5, plays: 4230000, status: "published", platform: "Mobile" },
  { id: "40", title: "Blast Legends",    thumbnail: thumb("Blast Legends",   "Match3", 2), category: "Match3",       rating: 4.4, plays: 3120000, status: "published", platform: "Mobile" },
  { id: "41", title: "Cookie Crunch",    thumbnail: thumb("Cookie Crunch",   "Match3", 3), category: "Match3",       rating: 4.3, plays: 2340000, status: "published", platform: "Mobile" },
  { id: "42", title: "Jewel Pop",        thumbnail: thumb("Jewel Pop",       "Match3", 4), category: "Match3",       rating: 4.5, plays: 3870000, status: "published", platform: "Mobile" },
  { id: "43", title: "Fruit Blast",      thumbnail: thumb("Fruit Blast",     "Match3", 0), category: "Match3",       rating: 4.2, plays: 1980000, status: "published", platform: "Web"    },
  { id: "44", title: "Royal Match",      thumbnail: thumb("Royal Match",     "Match3", 1), category: "Match3",       rating: 4.8, plays: 8920000, status: "published", platform: "Mobile" },

  // Strategy
  { id: "45", title: "Tower Wars",       thumbnail: thumb("Tower Wars",      "Strategy", 0), category: "Strategy",   rating: 4.5, plays: 2340000, status: "published", platform: "Desktop" },
  { id: "46", title: "Kingdom Build",    thumbnail: thumb("Kingdom Build",   "Strategy", 1), category: "Strategy",   rating: 4.6, plays: 3120000, status: "published", platform: "Desktop" },
  { id: "47", title: "Fortress Siege",   thumbnail: thumb("Fortress Siege",  "Strategy", 2), category: "Strategy",   rating: 4.4, plays: 1870000, status: "published", platform: "Mobile" },
  { id: "48", title: "Empire Builder",   thumbnail: thumb("Empire Builder",  "Strategy", 3), category: "Strategy",   rating: 4.7, plays: 4560000, status: "published", platform: "Desktop" },
  { id: "49", title: "War of Kings",     thumbnail: thumb("War of Kings",    "Strategy", 4), category: "Strategy",   rating: 4.3, plays: 1450000, status: "draft",     platform: "Desktop" },

  // Merge
  { id: "50", title: "Merge Dragon",     thumbnail: thumb("Merge Dragon",    "Merge", 0), category: "Merge",        rating: 4.6, plays: 5670000, status: "published", platform: "Mobile" },
  { id: "51", title: "Merge Town",       thumbnail: thumb("Merge Town",      "Merge", 1), category: "Merge",        rating: 4.4, plays: 3210000, status: "published", platform: "Mobile" },
  { id: "52", title: "Merge Magic",      thumbnail: thumb("Merge Magic",     "Merge", 2), category: "Merge",        rating: 4.5, plays: 4320000, status: "published", platform: "Mobile" },
  { id: "53", title: "Merge Castle",     thumbnail: thumb("Merge Castle",    "Merge", 3), category: "Merge",        rating: 4.3, plays: 2340000, status: "draft",     platform: "Mobile" },
  { id: "54", title: "Merge Mansion",    thumbnail: thumb("Merge Mansion",   "Merge", 4), category: "Merge",        rating: 4.7, plays: 6780000, status: "published", platform: "Mobile" },

  // Idle
  { id: "55", title: "Idle Miner",       thumbnail: thumb("Idle Miner",      "Idle", 0), category: "Idle",          rating: 4.4, plays: 4230000, status: "published", platform: "Mobile" },
  { id: "56", title: "Idle Factory",     thumbnail: thumb("Idle Factory",    "Idle", 1), category: "Idle",          rating: 4.2, plays: 2890000, status: "published", platform: "Mobile" },
  { id: "57", title: "Clicker Heroes",   thumbnail: thumb("Clicker Heroes",  "Idle", 2), category: "Idle",          rating: 4.5, plays: 5120000, status: "published", platform: "Web"    },
  { id: "58", title: "Idle Bakery",      thumbnail: thumb("Idle Bakery",     "Idle", 3), category: "Idle",          rating: 4.3, plays: 1980000, status: "published", platform: "Mobile" },
  { id: "59", title: "Space Miner Idle", thumbnail: thumb("Space Miner",     "Idle", 4), category: "Idle",          rating: 4.6, plays: 3450000, status: "draft",     platform: "Mobile" },

  // Hypercasual
  { id: "60", title: "Stack Ball",       thumbnail: thumb("Stack Ball",      "Hypercasual", 0), category: "Hypercasual", rating: 4.5, plays: 7890000, status: "published", platform: "Mobile" },
  { id: "61", title: "Helix Jump",       thumbnail: thumb("Helix Jump",      "Hypercasual", 1), category: "Hypercasual", rating: 4.6, plays: 9120000, status: "published", platform: "Mobile" },
  { id: "62", title: "Knife Hit",        thumbnail: thumb("Knife Hit",       "Hypercasual", 2), category: "Hypercasual", rating: 4.4, plays: 6780000, status: "published", platform: "Mobile" },
  { id: "63", title: "Bridge Race",      thumbnail: thumb("Bridge Race",     "Hypercasual", 3), category: "Hypercasual", rating: 4.3, plays: 5430000, status: "published", platform: "Mobile" },
  { id: "64", title: "Crowd City",       thumbnail: thumb("Crowd City",      "Hypercasual", 4), category: "Hypercasual", rating: 4.5, plays: 8910000, status: "published", platform: "Mobile" },
  { id: "65", title: "Fill Road",        thumbnail: thumb("Fill Road",       "Hypercasual", 0), category: "Hypercasual", rating: 4.2, plays: 3210000, status: "published", platform: "Mobile" },
  { id: "66", title: "Draw Climber",     thumbnail: thumb("Draw Climber",    "Hypercasual", 1), category: "Hypercasual", rating: 4.4, plays: 4560000, status: "published", platform: "Mobile" },
  { id: "67", title: "Roller Splat",     thumbnail: thumb("Roller Splat",    "Hypercasual", 2), category: "Hypercasual", rating: 4.6, plays: 6780000, status: "published", platform: "Mobile" },
  { id: "68", title: "Paper Fold",       thumbnail: thumb("Paper Fold",      "Hypercasual", 3), category: "Hypercasual", rating: 4.3, plays: 3450000, status: "published", platform: "Mobile" },
  { id: "69", title: "Cube Surfer",      thumbnail: thumb("Cube Surfer",     "Hypercasual", 4), category: "Hypercasual", rating: 4.5, plays: 7890000, status: "published", platform: "Mobile" },
  { id: "70", title: "Water Sort",       thumbnail: thumb("Water Sort",      "Hypercasual", 0), category: "Hypercasual", rating: 4.7, plays: 9870000, status: "published", platform: "Mobile" },

  // Simulation
  { id: "71", title: "My Restaurant",    thumbnail: thumb("My Restaurant",   "Simulation", 0), category: "Simulation", rating: 4.5, plays: 4320000, status: "published", platform: "Mobile" },
  { id: "72", title: "Farm Story",       thumbnail: thumb("Farm Story",      "Simulation", 1), category: "Simulation", rating: 4.4, plays: 3210000, status: "published", platform: "Mobile" },
  { id: "73", title: "City Island",      thumbnail: thumb("City Island",     "Simulation", 2), category: "Simulation", rating: 4.6, plays: 5670000, status: "published", platform: "Desktop" },
  { id: "74", title: "Pet Hotel",        thumbnail: thumb("Pet Hotel",       "Simulation", 3), category: "Simulation", rating: 4.3, plays: 2340000, status: "published", platform: "Mobile" },
  { id: "75", title: "Cooking Diary",    thumbnail: thumb("Cooking Diary",   "Simulation", 4), category: "Simulation", rating: 4.5, plays: 4560000, status: "published", platform: "Mobile" },
  { id: "76", title: "House Design",     thumbnail: thumb("House Design",    "Simulation", 0), category: "Simulation", rating: 4.2, plays: 1980000, status: "draft",     platform: "Mobile" },
  { id: "77", title: "Airport City",     thumbnail: thumb("Airport City",    "Simulation", 1), category: "Simulation", rating: 4.6, plays: 6780000, status: "published", platform: "Desktop" },
  { id: "78", title: "Cafe Mix",         thumbnail: thumb("Cafe Mix",        "Simulation", 2), category: "Simulation", rating: 4.4, plays: 3120000, status: "published", platform: "Mobile" },
  { id: "79", title: "Zoo Tycoon",       thumbnail: thumb("Zoo Tycoon",      "Simulation", 3), category: "Simulation", rating: 4.5, plays: 4230000, status: "published", platform: "Desktop" },
  { id: "80", title: "Build a Boat",     thumbnail: thumb("Build a Boat",    "Simulation", 4), category: "Simulation", rating: 4.3, plays: 2890000, status: "published", platform: "Mobile" },
  { id: "81", title: "Lily's Garden",    thumbnail: thumb("Lily Garden",     "Simulation", 0), category: "Simulation", rating: 4.7, plays: 7890000, status: "published", platform: "Mobile" },
  { id: "82", title: "Gardenscapes",     thumbnail: thumb("Gardenscapes",    "Simulation", 1), category: "Simulation", rating: 4.8, plays: 9120000, status: "published", platform: "Mobile" },
  { id: "83", title: "Homescapes",       thumbnail: thumb("Homescapes",      "Simulation", 2), category: "Simulation", rating: 4.6, plays: 8340000, status: "published", platform: "Mobile" },
  { id: "84", title: "Township",         thumbnail: thumb("Township",        "Simulation", 3), category: "Simulation", rating: 4.5, plays: 6780000, status: "published", platform: "Mobile" },
  { id: "85", title: "Dream Garden",     thumbnail: thumb("Dream Garden",    "Simulation", 4), category: "Simulation", rating: 4.4, plays: 3450000, status: "draft",     platform: "Mobile" },
];

export interface QueueItem {
  id: string;
  title: string;
  subtitle: string;
  thumbnail: string;
  highlight?: boolean; // yellow dot indicator
}

export const QUEUE_ITEMS: QueueItem[] = [
  { id: "q1",  title: "Skewer Sizzle Jam",       subtitle: "Foodle Sizzle + Farm Jam: Animal Park",         thumbnail: "https://placehold.co/80x80/ff6b35/fff?text=SSJ",   highlight: false },
  { id: "q2",  title: "Semantic Slide",            subtitle: "Ring Clash + Associations: Colorwood Match",    thumbnail: "https://placehold.co/80x80/7c3aed/fff?text=SS",    highlight: false },
  { id: "q3",  title: "Traffic Match: Cargo Jam",  subtitle: "Hotpot Go: Food Sort + Car Out",                thumbnail: "https://placehold.co/80x80/0ea5e9/fff?text=TMC",   highlight: false },
  { id: "q4",  title: "Maze Jam: Paint & Park",    subtitle: "Bubble Bus: Parking Jam Puzzle + AMA...",       thumbnail: "https://placehold.co/80x80/f59e0b/fff?text=MJP",   highlight: false },
  { id: "q5",  title: "Knit Blast",                subtitle: "Sand Blast + Knit Out",                         thumbnail: "https://placehold.co/80x80/ec4899/fff?text=KB",    highlight: true  },
  { id: "q6",  title: "Traffic Transit Jam",       subtitle: "Traffic Escape + Bubble Bus: Parking J...",     thumbnail: "https://placehold.co/80x80/10b981/fff?text=TTJ",   highlight: false },
  { id: "q7",  title: "Conveyor Block Crush",      subtitle: "Block Crush! + Yarn Flow",                      thumbnail: "https://placehold.co/80x80/6366f1/fff?text=CBC",   highlight: false },
  { id: "q8",  title: "Super Dispatch: Hero Jam",  subtitle: "Beads Out + Superhero",                         thumbnail: "https://placehold.co/80x80/dc2626/fff?text=SDH",   highlight: false },
  { id: "q9",  title: "Blast Match 3D",            subtitle: "Triple Match City + Toon Blast",                thumbnail: "https://placehold.co/80x80/d97706/fff?text=BM3",   highlight: false },
  { id: "q10", title: "Target Match City",         subtitle: "Triple Match City + Found It!",                 thumbnail: "https://placehold.co/80x80/059669/fff?text=TMC",   highlight: false },
  { id: "q11", title: "City Gate Match",           subtitle: "Gate Smash + City Connect 3D",                  thumbnail: "https://placehold.co/80x80/2563eb/fff?text=CGM",   highlight: false },
  { id: "q12", title: "Color Rope Twist",          subtitle: "Color Rope + Twist Hit",                        thumbnail: "https://placehold.co/80x80/db2777/fff?text=CRT",   highlight: false },
  { id: "q13", title: "Merge Road Builder",        subtitle: "Merge Highway + Road Build 3D",                 thumbnail: "https://placehold.co/80x80/84cc16/333?text=MRB",   highlight: true  },
  { id: "q14", title: "Bubble Sort Rush",          subtitle: "Bubble Sort Puzzle + Color Water Sort",         thumbnail: "https://placehold.co/80x80/06b6d4/fff?text=BSR",   highlight: false },
];

export const POPULAR_COMBOS: Array<{ game1Id: string; game2Id: string; label: string; group: string }> = [
  { game1Id: "1",  game2Id: "6",  label: "Top Puzzle Rivals",  group: "Puzzle" },
  { game1Id: "38", game2Id: "44", label: "Match-3 Showdown",   group: "Puzzle" },
  { game1Id: "60", game2Id: "64", label: "Hypercasual Kings",  group: "Casual" },
  { game1Id: "13", game2Id: "15", label: "Casual Comparison",  group: "Casual" },
  { game1Id: "31", game2Id: "37", label: "Runner Face-off",    group: "Action" },
  { game1Id: "50", game2Id: "54", label: "Best Merge Games",   group: "Strategy" },
];

export const categories = ["All", "Puzzle", "Casual", "Arcade", "Runner", "Match3", "Strategy", "Merge", "Idle", "Hypercasual", "Simulation"];
export const platforms = ["All", "Mobile", "Web", "Desktop"];
export const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "rating",  label: "Top Rated"    },
  { value: "newest",  label: "Newest"        },
  { value: "title",   label: "A–Z"           },
];
