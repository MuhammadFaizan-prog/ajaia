"use client";
import React from "react";
import { LogOut, Search, Mail, Bell } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface TopBarProps {
  type?: "dashboard" | "editor";
  title?: string;
  onShareClick?: () => void;
  saveStatus?: "saving" | "saved" | "unsaved";
  lastSavedText?: string;
  onTitleChange?: (newTitle: string) => void;
  userEmail?: string;
  onSignOut?: () => void;
}

export function TopBar({
  type = "dashboard",
  title,
  onShareClick,
  saveStatus,
  lastSavedText,
  onTitleChange,
  userEmail,
  onSignOut,
}: TopBarProps) {
  const pathname = usePathname();
  const initials = (userEmail || "User").slice(0, 2).toUpperCase();
  
  if (type === "editor") {
    return (
      <header className="h-[64px] bg-bg-surface border-b border-border flex items-center justify-between px-6 z-30 sticky top-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-text-secondary hover:text-text-primary flex items-center gap-2 text-[14px] font-medium">
             <span>←</span> Back
          </Link>
          <div className="h-4 w-px bg-border" />
          <input 
            type="text" 
            value={title || ""}
            onChange={(e) => onTitleChange?.(e.target.value)}
            placeholder="Untitled Document"
            className="text-[18px] font-semibold text-text-primary bg-transparent focus:outline-none focus:ring-1 focus:ring-accent-blue rounded px-2 py-1 -ml-2 w-[300px]"
          />
        </div>
        <div className="flex items-center gap-4">
          {saveStatus === "saved" && <span className="text-[12px] text-accent-green">{lastSavedText || "Saved"}</span>}
          {saveStatus === "saving" && <span className="text-[12px] text-text-muted">Saving...</span>}
          {saveStatus === "unsaved" && <span className="text-[12px] text-accent-yellow">Unsaved changes</span>}
          <button 
            onClick={onShareClick}
            className="bg-accent-blue hover:bg-blue-600 text-white font-semibold text-[14px] h-[36px] px-4 rounded-[8px] transition-colors"
          >
            Share
          </button>
          <button className="text-text-secondary hover:bg-slate-100 p-2 rounded-full transition-colors">
            <span className="leading-none text-xl tracking-widest -mt-2 block">...</span>
          </button>
        </div>
      </header>
    );
  }

  // Dashboard TopBar
  return (
    <header className="fixed top-0 left-[220px] right-0 h-[64px] bg-bg-surface border-b border-border flex items-center justify-between px-8 z-30">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[14px]">
        <span className="text-text-secondary">Ajaia Docs</span>
        <span className="text-border">/</span>
        <span className="text-text-primary font-medium">My Documents</span>
      </div>

      {/* Search */}
      <div className="relative w-[420px]">
        <Search className="w-[18px] h-[18px] text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input 
          type="text"
          placeholder="Search documents..."
          className="w-full h-[40px] bg-bg-page border border-border rounded-[8px] pl-10 pr-4 text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-shadow"
        />
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-6">
        <button className="text-text-secondary hover:text-text-primary transition-colors">
          <Mail className="w-[20px] h-[20px]" />
        </button>
        <button className="text-text-secondary hover:text-text-primary transition-colors">
          <Bell className="w-[20px] h-[20px]" />
        </button>
        <div className="flex items-center gap-3 pl-2 border-l border-border cursor-pointer">
          <Avatar initials={initials} className="bg-blue-100 text-accent-blue" />
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold text-text-primary leading-tight">Signed in</span>
            <span className="text-[12px] text-text-secondary leading-tight mt-0.5">{userEmail || "Loading..."}</span>
          </div>
          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              title="Sign out"
              className="text-text-secondary hover:text-accent-red transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
