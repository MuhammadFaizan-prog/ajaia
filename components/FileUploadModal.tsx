"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileText, Loader2, AlertCircle } from "lucide-react";

interface Props {
  onClose: () => void;
  onSuccess: (docId: string) => void;
}

export default function FileUploadModal({ onClose, onSuccess }: Props) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (f: File) => {
    setError("");
    const name = f.name.toLowerCase();
    if (!name.endsWith(".txt") && !name.endsWith(".md")) {
      setError("Only .txt and .md files are supported.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File must be under 5 MB.");
      return;
    }
    setFile(f);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      onSuccess(json.data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white shadow-xl border border-slate-200 w-full max-w-full md:max-w-[480px] rounded-t-2xl md:rounded-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">Import File</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-500">
            Supported: <span className="font-medium text-slate-700">.txt</span> and{" "}
            <span className="font-medium text-slate-700">.md</span> files (max 5 MB). Your file will become a new editable document.
          </p>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragging ? "border-blue-400 bg-blue-50" : file ? "border-green-300 bg-green-50" : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50"
            }`}
          >
            <input
              type="file"
              accept=".txt,.md"
              onChange={onInputChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              id="file-input"
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm font-medium text-slate-900">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setFile(null); }}
                  className="text-xs text-slate-400 hover:text-red-500 transition"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Upload className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm text-slate-600">Drag & drop or <span className="text-blue-600 font-medium">browse</span></p>
                <p className="text-xs text-slate-400">.txt or .md · max 5 MB</p>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              id="upload-btn"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition disabled:opacity-50"
            >
              {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
              {uploading ? "Importing…" : "Import Document"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
