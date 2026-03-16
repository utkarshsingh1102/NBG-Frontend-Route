import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Game Fusion Studio",
  description: "Game Fusion Studio Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f8f9fb] antialiased">{children}</body>
    </html>
  );
}
