"use client";

import { useState } from "react";
import { Game } from "@/lib/mockData";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import ThemeRemixContent from "./ThemeRemixContent";
import YourGenerationContent from "./YourGenerationContent";
import FavouritesContent from "./FavouritesContent";
import ReportsContent from "./ReportsContent";
import AddNewGameContent from "./AddNewGameContent";
import NBGIdeasContent from "./NBGIdeasContent";

export default function AppLayout() {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePage, setActivePage] = useState("Game Fusion");
  const [userGames, setUserGames] = useState<Game[]>([]);

  const [addGameDirectToForm, setAddGameDirectToForm] = useState(false);

  const handleAddUserGame = (game: Game) =>
    setUserGames((prev) => [...prev, game]);

  const handleNavigateToAddGame = (direct = false) => {
    setAddGameDirectToForm(direct);
    setActivePage("Add New Game");
  };

  const handleNavChange = (page: string) => {
    setAddGameDirectToForm(false);
    setActivePage(page);
  };

  function renderPage() {
    switch (activePage) {
      case "Theme Remix":
        return (
          <ThemeRemixContent
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            userGames={userGames}
            onNavigateToAddGame={() => handleNavigateToAddGame(true)}
          />
        );
      case "Your Generation":
        return <YourGenerationContent activeCategory={activeCategory} onCategoryChange={setActiveCategory} />;
      case "Favorites":
        return <FavouritesContent />;
      case "Reports":
        return <ReportsContent />;
      case "NBG Ideas":
        return <NBGIdeasContent />;
      case "Add New Game":
        return <AddNewGameContent onGameAdded={handleAddUserGame} directToForm={addGameDirectToForm} />;
      default:
        return (
          <MainContent
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            userGames={userGames}
            onNavigateToAddGame={() => handleNavigateToAddGame(true)}
          />
        );
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f5f6fa]">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeGameId={activeGameId}
          onSelectGame={setActiveGameId}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          activePage={activePage}
          onNavChange={handleNavChange}
        />
        <div className="flex-1 overflow-y-auto bg-[#f5f6fa]">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
