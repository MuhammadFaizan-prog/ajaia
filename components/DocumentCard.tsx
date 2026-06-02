"use client";

import { formatDate, truncate } from "@/lib/utils";
import { FileText, MoreVertical, Trash2, ExternalLink, Users } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Document } from "@/types";

interface Props {
  doc: Document;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export default function DocumentCard({ doc, onClick, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      {/* Document preview area */}
      <div className="h-32 bg-gradient-to-br from-slate-50 to-blue-50 rounded-t-2xl border-b border-slate-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-50/50" />
        <FileText className="w-10 h-10 text-blue-400 opacity-60 group-hover:opacity-80 transition-opacity" />
        {/* Faux text lines */}
        <div className="absolute bottom-4 left-5 right-5 space-y-1.5">
          <div className="h-1.5 bg-slate-200 rounded-full w-3/4" />
          <div className="h-1.5 bg-slate-200 rounded-full w-1/2" />
          <div className="h-1.5 bg-slate-200 rounded-full w-2/3" />
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 truncate">
              {truncate(doc.title, 40)}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{formatDate(doc.updated_at)}</p>
          </div>

          {/* Kebab menu */}
          <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20 animate-fade-in">
                <button
                  onClick={() => { setMenuOpen(false); onClick(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  Open
                </button>
                {!doc.is_shared && (
                  <button
                    onClick={() => { setMenuOpen(false); onDelete(doc.id); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Badge */}
        <div className="mt-3">
          {doc.is_shared ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 text-xs font-medium border border-purple-100">
              <Users className="w-3 h-3" />
              Shared with you
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium border border-blue-100">
              <FileText className="w-3 h-3" />
              Owner
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
