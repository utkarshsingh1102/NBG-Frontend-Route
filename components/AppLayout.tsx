"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import ThemeRemixContent from "./ThemeRemixContent";
import YourGenerationContent from "./YourGenerationContent";
import FavouritesContent from "./FavouritesContent";
import ReportsContent from "./ReportsContent";
import ThemeDisplayOptionsContent from "./ThemeDisplayOptionsContent";

export default function AppLayout() {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePage, setActivePage] = useState("Game Fusion");

  function renderPage() {
    switch (activePage) {
      case "Theme Remix":
        return <ThemeRemixContent activeCategory={activeCategory} onCategoryChange={setActiveCategory} />;
      case "Your Generation":
        return <YourGenerationContent activeCategory={activeCategory} onCategoryChange={setActiveCategory} />;
      case "Favorites":
        return <FavouritesContent />;
      case "Reports":
        return <ReportsContent />;
      case "Theme Display Options":
        return <ThemeDisplayOptionsContent />;
      default:
        return <MainContent activeCategory={activeCategory} onCategoryChange={setActiveCategory} />;
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
          onNavChange={setActivePage}
        />
        <div className="flex-1 overflow-y-auto bg-[#f5f6fa]">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
