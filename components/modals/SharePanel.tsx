"use client";

import { useState } from "react";
import { X, Share2, Loader2, AlertCircle, CheckCircle2, Trash2, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";

interface ShareRecord {
  shared_with_id: string;
  shared_with_email?: string;
}

interface Props {
  documentId: string;
  documentTitle: string;
  existingShares: ShareRecord[];
  onClose: () => void;
  onShareAdded: (share: ShareRecord) => void;
  onShareRemoved: (sharedWithId: string) => void;
}

export default function SharePanel({
  documentId,
  documentTitle,
  existingShares,
  onClose,
  onShareAdded,
  onShareRemoved,
}: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (existingShares.some((s) => s.shared_with_email?.toLowerCase() === trimmed)) {
      setError("Already shared with that user.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/documents/${documentId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to share");

      onShareAdded({ shared_with_id: json.data.shared_with_id, shared_with_email: trimmed });
      setEmail("");
      setSuccess(`Shared with ${trimmed}`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to share document");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (sharedWithId: string) => {
    try {
      await fetch(`/api/documents/${documentId}/share`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sharedWithId }),
      });
      onShareRemoved(sharedWithId);
    } catch {
      setError("Failed to remove access");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity animate-fade-in" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-[360px] bg-bg-surface border-l border-border shadow-2xl flex flex-col z-50 animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-[16px] font-semibold text-text-primary">Share Document</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <form onSubmit={handleShare} className="mb-6">
            <label className="block text-[13px] font-medium text-text-primary mb-2">Invite people</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="Email address"
                  className="w-full h-[40px] pl-9 pr-3 rounded-[8px] border border-border text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>
              <Button type="submit" disabled={loading || !email.trim()} className="h-[40px]">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Invite"}
              </Button>
            </div>
          </form>

          {error && <div className="mb-4 text-[13px] text-accent-red flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}
          {success && <div className="mb-4 text-[13px] text-accent-green flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />{success}</div>}

          <div>
            <h3 className="text-[13px] font-semibold text-text-secondary mb-4 uppercase tracking-wider">People with access</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar initials="You" className="bg-blue-100 text-accent-blue" />
                  <div>
                    <p className="text-[14px] font-medium text-text-primary leading-tight">You</p>
                    <p className="text-[12px] text-text-secondary leading-tight mt-0.5">Owner</p>
                  </div>
                </div>
              </div>

              {existingShares.map((share) => (
                <div key={share.shared_with_id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <Avatar initials={(share.shared_with_email ?? "?").slice(0, 2).toUpperCase()} className="bg-slate-100 text-slate-600" />
                    <div>
                      <p className="text-[14px] font-medium text-text-primary leading-tight truncate w-[160px]">
                        {share.shared_with_email}
                      </p>
                      <p className="text-[12px] text-text-secondary leading-tight mt-0.5">Editor</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(share.shared_with_id)}
                    className="text-text-muted hover:text-accent-red opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
