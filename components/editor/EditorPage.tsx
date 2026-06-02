"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import ShareModal from "@/components/ShareModal";
import {
  ArrowLeft,
  CheckCircle,
  Plus,
  ShareNetwork,
  DotsThreeVertical,
} from "@phosphor-icons/react";

const TiptapEditor = dynamic(() => import("./TiptapEditor"), { ssr: false });

interface ShareRecord {
  shared_with_id: string;
  shared_with_email?: string;
}

interface Props {
  docId: string;
  initialTitle: string;
  initialContent: Record<string, unknown>;
  isOwner: boolean;
  userEmail: string;
  userId: string;
}

type SaveStatus = "idle" | "saving" | "saved" | "error" | "unsaved";

export default function EditorPage({
  docId,
  initialTitle,
  initialContent,
  isOwner,
  userEmail,
}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState<Record<string, unknown>>(initialContent);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [showShare, setShowShare] = useState(false);
  const [shares, setShares] = useState<ShareRecord[]>([]);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingContent = useRef<Record<string, unknown>>(initialContent);

  useEffect(() => {
    if (!isOwner) return;
    fetch(`/api/documents/${docId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.data?.shares) setShares(json.data.shares);
      });
  }, [docId, isOwner]);

  const saveDocument = useCallback(
    async (titleToSave: string, contentToSave: Record<string, unknown>) => {
      setSaveStatus("saving");
      try {
        const res = await fetch(`/api/documents/${docId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: titleToSave, content: contentToSave }),
        });
        if (!res.ok) throw new Error("Save failed");
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("error");
      }
    },
    [docId]
  );

  const handleContentChange = useCallback(
    (newContent: Record<string, unknown>) => {
      setContent(newContent);
      pendingContent.current = newContent;
      setSaveStatus("unsaved");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveDocument(title, pendingContent.current);
      }, 1500);
    },
    [title, saveDocument]
  );

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setSaveStatus("unsaved");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveDocument(newTitle, pendingContent.current);
    }, 1500);
  };

  // Immediately persist title on blur or Enter key (satisfies explicit save requirement)
  const handleTitleCommit = (newTitle: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveDocument(newTitle, pendingContent.current);
  };

  const getInitials = (email: string) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-page">
      {/* Header */}
      <header className="flex min-h-16 shrink-0 items-center justify-between gap-4 border-b border-base bg-white px-4 md:px-8 sticky top-0 z-20">
        <div className="flex min-w-0 items-center gap-4">
          <button 
            onClick={() => router.push("/")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#4F6EF7] transition-all hover:bg-gray-100"
          >
            <ArrowLeft weight="bold" />
          </button>
          <div className="flex min-w-0 flex-col">
            <input 
              type="text" 
              value={title || "Untitled"}
              onChange={(e) => isOwner && handleTitleChange(e.target.value)}
              onBlur={(e) => isOwner && handleTitleCommit(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); isOwner && handleTitleCommit((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).blur(); } }}
              readOnly={!isOwner}
              className={`-ml-1 w-[min(52vw,420px)] max-w-full truncate border-b border-transparent bg-transparent px-1 text-lg font-bold text-primary focus:border-[#4F6EF7] focus:outline-none hover:border-gray-200 ${!isOwner ? 'cursor-default' : ''}`}
            />
            <div className="flex items-center gap-1.5 text-[10px] text-[#22C55E] font-medium px-1">
              <CheckCircle weight="bold" className="hidden sm:block" /> 
              <span className="hidden sm:inline">
                {saveStatus === "saving" ? "Saving..." : saveStatus === "unsaved" ? "Unsaved changes" : saveStatus === "error" ? "Error saving" : "Saved"}
              </span>
              <span className={`sm:hidden w-2 h-2 rounded-full ${saveStatus === "saving" ? "bg-yellow-500" : saveStatus === "unsaved" ? "bg-orange-500" : saveStatus === "error" ? "bg-red-500" : "bg-green-500"}`} />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <div className="mr-2 hidden -space-x-2 sm:flex">
            <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[#4F6EF7] text-xs font-bold">
              {getInitials(userEmail)}
            </div>
            {shares.slice(0, 2).map((s, i) => (
               <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold">
                 {getInitials(s.shared_with_email || "U")}
               </div>
            ))}
            <button className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-secondary hover:bg-gray-200 transition-all">
              <Plus className="text-xs" />
            </button>
          </div>
          {isOwner && (
            <button 
              onClick={() => setShowShare(true)} 
              className="radius-button flex items-center justify-center gap-2 bg-[#4F6EF7] px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-opacity-90 sm:px-4"
            >
              <ShareNetwork weight="bold" /> <span className="hidden sm:inline">Share</span>
            </button>
          )}
          <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg text-secondary transition-all">
            <DotsThreeVertical weight="bold" />
          </button>
        </div>
      </header>

      {/* Editor Main Canvas */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-16 scroll-smooth sm:px-6 lg:px-8">
        <TiptapEditor
          content={content}
          onChange={handleContentChange}
          editable={isOwner}
        />
        
        {/* Footer */}
        <div className="mx-auto mt-6 flex max-w-[860px] flex-wrap items-center justify-between gap-3 px-1 text-[11px] text-secondary sm:px-2">
          <p>Last edited by {getInitials(userEmail)} recently</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-primary transition-all">Report an issue</a>
            <a href="#" className="hover:text-primary transition-all">Support</a>
          </div>
        </div>
      </div>

      {showShare && (
        <ShareModal
          documentId={docId}
          documentTitle={title}
          existingShares={shares}
          onClose={() => setShowShare(false)}
          onShareAdded={(share) => setShares((prev) => [...prev, share])}
          onShareRemoved={(id) => setShares((prev) => prev.filter((s) => s.shared_with_id !== id))}
        />
      )}
    </div>
  );
}
