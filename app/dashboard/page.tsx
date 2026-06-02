"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload, FileText, Users, Clock, Loader2, Search } from "lucide-react";
import DocumentCard from "@/components/DocumentCard";
import FileUploadModal from "@/components/FileUploadModal";
import type { Document } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [owned, setOwned] = useState<Document[]>([]);
  const [shared, setShared] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<"owned" | "shared">("owned");
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState("");

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/documents");
      const json = await res.json();
      if (json.data) {
        setOwned(json.data.owned ?? []);
        setShared(json.data.shared ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  const createDocument = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/documents", { method: "POST", body: JSON.stringify({}), headers: { "Content-Type": "application/json" } });
      const json = await res.json();
      if (json.data?.id) router.push(`/documents/${json.data.id}`);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    fetchDocuments();
  };

  const filterDocs = (docs: Document[]) =>
    docs.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()));

  const displayedDocs = filterDocs(activeTab === "owned" ? owned : shared);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Documents</h1>
          <p className="text-sm text-slate-500 mt-0.5">Create, edit, and share your documents</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition shadow-sm"
          >
            <Upload className="w-4 h-4" />
            Import File
          </button>
          <button
            id="create-document-btn"
            onClick={createDocument}
            disabled={creating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition shadow-sm disabled:opacity-60"
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            New Document
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "My Documents", value: owned.length, icon: FileText, color: "bg-blue-50 text-blue-600" },
          { label: "Shared with me", value: shared.length, icon: Users, color: "bg-purple-50 text-purple-600" },
          { label: "Recently edited", value: [...owned, ...shared].filter(d => {
              const diff = Date.now() - new Date(d.updated_at).getTime();
              return diff < 7 * 24 * 60 * 60 * 1000;
            }).length, icon: Clock, color: "bg-amber-50 text-amber-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {(["owned", "shared"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab === "owned" ? "My Documents" : "Shared with Me"}
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500"
              }`}>
                {tab === "owned" ? owned.length : shared.length}
              </span>
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents…"
            className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
          />
        </div>
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      ) : displayedDocs.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7 text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium">
            {search ? "No documents match your search" : activeTab === "owned" ? "No documents yet" : "No shared documents"}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {!search && activeTab === "owned" && "Create your first document to get started"}
          </p>
          {!search && activeTab === "owned" && (
            <button
              onClick={createDocument}
              disabled={creating}
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition mx-auto disabled:opacity-60"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              New Document
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {displayedDocs.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onDelete={handleDelete}
              onClick={() => router.push(`/documents/${doc.id}`)}
            />
          ))}
        </div>
      )}

      {/* File Upload Modal */}
      {showUpload && (
        <FileUploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={(docId) => { setShowUpload(false); router.push(`/documents/${docId}`); }}
        />
      )}
    </div>
  );
}
