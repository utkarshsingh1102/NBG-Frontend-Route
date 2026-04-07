"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import PricingContent from "./PricingContent";
import BillingContent from "./BillingContent";

export default function AppLayout() {
  const searchParams = useSearchParams();
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePage, setActivePage] = useState(() => searchParams.get("page") || "Game Fusion");
  const [userGames, setUserGames] = useState<Game[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [planStatus, setPlanStatus] = useState<"active" | "cancelled" | null>(null);
  const [planExpiry, setPlanExpiry] = useState<string | null>(null);

  function computeExpiry(): string {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  const [addGameDirectToForm, setAddGameDirectToForm] = useState(false);

  // Establish session for the secure report viewer
  useEffect(() => {
    document.cookie = "nbg_session=active; path=/; SameSite=Strict";
    sessionStorage.setItem("nbg_session", "active");
    sessionStorage.setItem("nbg_user", "NBG User");
  }, []);

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
      case "Pricing":
        return <PricingContent currentPlan={currentPlan} onSelectPlan={(plan) => {
          setCurrentPlan(plan);
          setPlanStatus("active");
          setPlanExpiry(computeExpiry());
          setActivePage("Game Fusion");
        }} />;
      case "Billing":
        return (
          <BillingContent
            currentPlan={currentPlan}
            planStatus={planStatus}
            planExpiry={planExpiry}
            onCancelPlan={() => setPlanStatus("cancelled")}
            onAdjustPlan={() => setActivePage("Pricing")}
          />
        );
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
      <Navbar currentPlan={currentPlan} onOpenPricing={() => handleNavChange("Pricing")} onOpenBilling={() => handleNavChange("Billing")} />
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
