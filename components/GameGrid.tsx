import { Game } from "@/lib/mockData";
import GameCard from "./GameCard";

interface GameGridProps {
  games: Game[];
  selectedId?: string | null;
  onSelect?: (game: Game) => void;
}

export default function GameGrid({ games, selectedId, onSelect }: GameGridProps) {
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p className="text-gray-500 font-semibold text-sm">No games found</p>
        <p className="text-gray-400 text-xs mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6">
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          selected={selectedId === game.id}
          onSelect={onSelect ? () => onSelect(game) : undefined}
        />
      ))}
    </div>
  );
}
