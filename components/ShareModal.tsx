"use client";

import { useState } from "react";
import { X, Share2, Loader2, AlertCircle, CheckCircle2, Trash2 } from "lucide-react";

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

export default function ShareModal({
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

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Duplicate check
    if (existingShares.some((s) => s.shared_with_email?.toLowerCase() === trimmed)) {
      setError("This document is already shared with that user.");
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

  const handleRemove = async (sharedWithId: string, sharedWithEmail?: string) => {
    try {
      await fetch(`/api/documents/${documentId}/share`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sharedWithId }),
      });
      onShareRemoved(sharedWithId);
      setSuccess(`Removed access for ${sharedWithEmail ?? "user"}`);
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to remove access");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-start justify-center md:justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white shadow-xl border border-slate-200 w-full max-w-full md:max-w-md rounded-t-2xl md:rounded-none md:rounded-l-2xl h-auto md:h-full max-h-[90vh] md:max-h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
              <Share2 className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Share document</h2>
              <p className="text-xs text-slate-400 truncate max-w-[200px]">{documentTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Share form */}
          <form onSubmit={handleShare} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="Enter email address…"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              id="share-email-input"
            />
            <button
              type="submit"
              disabled={loading || !email.trim()}
              id="share-submit-btn"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Share"}
            </button>
          </form>

          {/* Feedback messages */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              {success}
            </div>
          )}

          {/* Existing shares */}
          {existingShares.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Shared with ({existingShares.length})
              </h3>
              <div className="space-y-2">
                {existingShares.map((share) => (
                  <div
                    key={share.shared_with_id}
                    className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-purple-600">
                        {(share.shared_with_email ?? "?").slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="flex-1 text-sm text-slate-700 truncate">
                      {share.shared_with_email ?? share.shared_with_id}
                    </span>
                    <button
                      onClick={() => handleRemove(share.shared_with_id, share.shared_with_email)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                      title="Remove access"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {existingShares.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-2">
              Not shared with anyone yet. Enter an email above to share.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
