"use client";

import { useState } from "react";
import { thumbSquare } from "@/lib/mockData";

const UNLOCKED_COUNT = 3;

interface GameIdea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  basedOn: string[];
  potential: "High" | "Very High" | "Explosive";
}

const CURATED_IDEAS: GameIdea[] = [
  {
    id: "idea-1",
    title: "Gravity Flip Puzzle",
    description: "A mind-bending puzzle where players flip gravity to guide a marble through elaborate mazes. Each level introduces new portals, switches, and anti-gravity zones that defy expectations.",
    tags: ["Puzzle", "Physics", "Casual"],
    basedOn: ["Monument Valley", "Ball Road"],
    potential: "Very High",
  },
  {
    id: "idea-2",
    title: "Neon Rush Merge",
    description: "Cyberpunk-themed merge game set in a neon-lit city. Combine data chips and programs to build the ultimate hacker rig while fending off rival corporations.",
    tags: ["Merge", "Idle", "Hypercasual"],
    basedOn: ["2048", "Merge Mansion"],
    potential: "Explosive",
  },
  {
    id: "idea-3",
    title: "Ocean Idle Explorer",
    description: "Deploy submarines and deep-sea drones to discover ancient shipwrecks and hidden civilizations. Upgrade your fleet and unlock new ocean zones as your empire grows.",
    tags: ["Idle", "Simulation", "Casual"],
    basedOn: ["Deep Sea Idle", "Merge Ships"],
    potential: "High",
  },
  {
    id: "idea-4",
    title: "Crystal Burst Match",
    description: "A match-3 game where crystals have elemental powers. Chain reactions trigger chain explosions across the board and unlock legendary gem combos with screen-shattering effects.",
    tags: ["Match3", "Puzzle", "Casual"],
    basedOn: ["Candy Crush", "Bejeweled"],
    potential: "Very High",
  },
  {
    id: "idea-5",
    title: "Shadow Ninja Endless",
    description: "A parkour endless runner where your ninja can split into two shadow clones to bypass obstacles simultaneously on parallel tracks. React in real-time or lose both clones at once.",
    tags: ["Runner", "Arcade", "Hypercasual"],
    basedOn: ["Subway Surfers", "Jetpack Joyride"],
    potential: "Explosive",
  },
  {
    id: "idea-6",
    title: "Dino Kingdom Builder",
    description: "Hatch dinosaur eggs, evolve them through prehistoric eras, and build the ultimate Jurassic empire. Merge dinos to unlock legendary species never seen before.",
    tags: ["Merge", "Strategy", "Idle"],
    basedOn: ["Dragon City", "Merge Dragons"],
    potential: "Very High",
  },
  {
    id: "idea-7",
    title: "Rope Escape Physics",
    description: "A satisfying physics puzzler where you cut ropes, place hooks, and redirect pendulums to guide a little character to safety — with increasingly devious level designs.",
    tags: ["Puzzle", "Physics", "Casual"],
    basedOn: ["Cut the Rope", "Where's My Water"],
    potential: "High",
  },
  {
    id: "idea-8",
    title: "Candy Storm Merge",
    description: "Merging rain of sweets falls from the sky. Stack and combine them before the board fills up. Unlock rainbow candy storms for massive score multipliers.",
    tags: ["Merge", "Casual", "Hypercasual"],
    basedOn: ["Suika Game", "Candy Crush"],
    potential: "Explosive",
  },
  {
    id: "idea-9",
    title: "Space Farm Idle",
    description: "Plant alien crops on asteroids, harvest stardust, and build an intergalactic farming empire. Trade produce with alien civilizations for rare blueprints.",
    tags: ["Idle", "Simulation", "Casual"],
    basedOn: ["Stardew Valley", "Hay Day"],
    potential: "Very High",
  },
  {
    id: "idea-10",
    title: "Word Maze Rush",
    description: "Spell words by drawing paths through a letter maze before the clock runs out. Power-ups freeze time, shuffle letters, and trigger word bombs that clear entire rows.",
    tags: ["Puzzle", "Casual", "Arcade"],
    basedOn: ["Wordle", "Word Connect"],
    potential: "High",
  },
  {
    id: "idea-11",
    title: "Bubble Kingdom RPG",
    description: "A bubble shooter with RPG progression — your bubbles are spells, each with unique effects. Defeat dungeon bosses by building the right elemental combo chain.",
    tags: ["Arcade", "Puzzle", "Strategy"],
    basedOn: ["Bubble Witch", "Puzzle & Dragons"],
    potential: "Very High",
  },
  {
    id: "idea-12",
    title: "Magnetic Block World",
    description: "Push and pull magnetic blocks to solve increasingly tricky spatial puzzles. Some blocks repel, some attract — mastering polarity is key to escape each chamber.",
    tags: ["Puzzle", "Strategy", "Casual"],
    basedOn: ["Monument Valley", "Mekorama"],
    potential: "High",
  },
  {
    id: "idea-13",
    title: "Fire & Ice Merge",
    description: "Merge fire and ice elements on a board that constantly shifts temperature zones. Create steam explosions and frozen chains to clear massive combos.",
    tags: ["Merge", "Puzzle", "Casual"],
    basedOn: ["Merge Dragons", "2048"],
    potential: "Explosive",
  },
  {
    id: "idea-14",
    title: "Slime Tower Rush",
    description: "Build towers out of slime that stretch, bounce, and morph. Defend your slime castle against wave after wave of cute pixel invaders using gooey physics.",
    tags: ["Strategy", "Arcade", "Casual"],
    basedOn: ["Bloons TD", "Castle Clash"],
    potential: "Very High",
  },
];

const POTENTIAL_COLORS: Record<GameIdea["potential"], string> = {
  High: "bg-blue-100 text-blue-700",
  "Very High": "bg-purple-100 text-purple-700",
  Explosive: "bg-red-100 text-red-600",
};

function PremiumModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Top gradient banner */}
        <div className="bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 px-6 pt-8 pb-6 flex flex-col items-center gap-3 text-center relative overflow-hidden">
          {/* Subtle radial glow */}
          <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 50% 40%, white 0%, transparent 70%)" }} />
          <div className="relative w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg shadow-amber-600/30">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l2.5-8 4.5 4L12 5l2 8 4.5-4 2.5 8H3z" />
            </svg>
          </div>
          <div className="relative">
            <p className="text-[11px] font-bold text-amber-900/70 uppercase tracking-widest mb-1">NextBigGames</p>
            <h2 className="text-xl font-extrabold text-white leading-tight">Unlock Premium Access</h2>
            <p className="text-sm text-white/80 mt-1">Get all {CURATED_IDEAS.length} expert-curated ideas</p>
          </div>
        </div>

        {/* Benefits */}
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

export default function NBGIdeasContent() {
  const [premiumOpen, setPremiumOpen] = useState(false);

  return (
    <>
      <main className="flex-1 p-6 min-w-0">
        {/* ── Page Header ── */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-200 flex-shrink-0">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l2.5-8 4.5 4L12 5l2 8 4.5-4 2.5 8H3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-gray-900">NextBigGames Ideas</h1>
              <p className="text-xs text-amber-700/80 font-medium mt-0.5">
                Curated Ideas Generated by NextBigGames Expert Team
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
              {UNLOCKED_COUNT} free · {CURATED_IDEAS.length - UNLOCKED_COUNT} premium
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

        {/* ── Ideas Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CURATED_IDEAS.map((idea, idx) => {
            const isLocked = idx >= UNLOCKED_COUNT;
            const thumbIdx = idx * 7;

            return (
              <div
                key={idea.id}
                className={`relative rounded-2xl overflow-hidden border bg-white shadow-sm transition-all ${
                  isLocked
                    ? "border-amber-200/60 cursor-pointer group/locked"
                    : "border-gray-100 hover:shadow-md hover:border-amber-200"
                }`}
                onClick={isLocked ? () => setPremiumOpen(true) : undefined}
              >
                {/* Thumbnail */}
                <div className={`relative h-36 bg-gray-100 ${isLocked ? "blur-sm" : ""}`}>
                  <img
                    src={thumbSquare(idea.title, idea.tags[0] as never ?? "Casual", thumbIdx)}
                    alt={idea.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  {/* Potential badge */}
                  <span className={`absolute top-2.5 right-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full ${POTENTIAL_COLORS[idea.potential]}`}>
                    {idea.potential} Potential
                  </span>
                </div>

                {/* Card body */}
                <div className={`p-4 ${isLocked ? "blur-sm select-none" : ""}`}>
                  <h3 className="text-sm font-bold text-gray-900 mb-1 leading-snug">{idea.title}</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 mb-3">
                    {idea.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {idea.tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Based on */}
                  <div className="flex items-center gap-1.5 pt-2 border-t border-gray-50">
                    <p className="text-[9px] text-gray-400 font-medium">Inspired by:</p>
                    <p className="text-[9px] text-amber-600 font-semibold truncate">{idea.basedOn.join(" · ")}</p>
                  </div>
                </div>

                {/* ── Lock overlay (locked cards only) ── */}
                {isLocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 group-hover/locked:bg-black/50 transition-colors">
                    {/* Glowing lock */}
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
                      <path d="M3 17l2.5-8 4.5 4L12 5l2 8 4.5-4 2.5 8H3z" />
                    </svg>
                    <span className="text-[8px] font-bold text-white">NBG Pick</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-8 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border border-amber-200/60 rounded-2xl p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l2.5-8 4.5 4L12 5l2 8 4.5-4 2.5 8H3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                Unlock {CURATED_IDEAS.length - UNLOCKED_COUNT} more expert ideas
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
      </main>

      {premiumOpen && <PremiumModal onClose={() => setPremiumOpen(false)} />}
    </>
  );
}
