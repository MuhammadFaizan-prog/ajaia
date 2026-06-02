import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Ajaia Docs — Collaborative Document Editor",
  description: "A lightweight collaborative document editor. Create, edit, and share documents in real time.",
  keywords: ["document editor", "collaboration", "rich text", "Ajaia"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script src="https://unpkg.com/@phosphor-icons/web"></script>
      </head>
      <body className="antialiased bg-bg-page text-text-primary min-h-screen">
        {children}
      </body>
    </html>
  );
}
