"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileText, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  onClose: () => void;
  onSuccess: (docId: string) => void;
}

export default function UploadModal({ onClose, onSuccess }: Props) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-fade-in">
      <div className="bg-bg-surface rounded-[12px] shadow-2xl w-full max-w-[480px] border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-[18px] font-semibold text-text-primary">Upload File</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`relative border-2 border-dashed rounded-[12px] p-10 text-center transition-colors ${
              dragging ? "border-accent-blue bg-blue-50/50" : file ? "border-accent-green bg-green-50/30" : "border-border bg-slate-50 hover:border-accent-blue"
            }`}
          >
            <input
              type="file"
              accept=".txt,.md"
              onChange={onInputChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-green-100 rounded-[12px] flex items-center justify-center">
                  <FileText className="w-6 h-6 text-accent-green" />
                </div>
                <p className="text-[14px] font-medium text-text-primary mt-2">{file.name}</p>
                <p className="text-[12px] text-text-secondary">{(file.size / 1024).toFixed(1)} KB</p>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setFile(null); }}
                  className="text-[13px] text-accent-red hover:underline mt-1"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-white border border-border shadow-sm rounded-[12px] flex items-center justify-center mb-2">
                  <Upload className="w-5 h-5 text-text-muted" />
                </div>
                <p className="text-[14px] font-medium text-text-primary">
                  Drag & drop your file here
                </p>
                <p className="text-[12px] text-text-secondary">
                  or <span className="text-accent-blue font-medium cursor-pointer hover:underline">browse</span> to choose a file
                </p>
                <p className="text-[11px] text-text-muted mt-2">Supported formats: .txt, .md (Max 5MB)</p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-[13px] text-accent-red">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <div className="flex items-center gap-3 mt-6">
            <Button variant="outline" onClick={onClose} className="flex-1 border-border text-text-secondary">
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!file || uploading} className="flex-1">
              {uploading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {uploading ? "Uploading..." : "Upload File"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
