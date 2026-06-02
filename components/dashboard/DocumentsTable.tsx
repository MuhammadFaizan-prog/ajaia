import React from "react";
import { Link as LinkIcon, MoreVertical, Search, File, User, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate, truncate } from "@/lib/utils";
import type { Document } from "@/types";

type Props = {
  documents: Document[];
  loading?: boolean;
  emptyLabel?: string;
  onOpen: (doc: Document) => void;
};

export function DocumentsTable({
  documents,
  loading = false,
  emptyLabel = "No documents found",
  onOpen,
}: Props) {
  return (
    <div className="mb-[40px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-semibold text-text-primary">All Documents</h2>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search"
            className="pl-9 pr-4 py-2 border border-border rounded-[8px] text-[13px] bg-bg-surface w-[200px] focus:outline-none focus:ring-1 focus:ring-accent-blue"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-[8px] text-[13px] bg-bg-surface hover:bg-slate-50 text-text-secondary">
          <File className="w-4 h-4" /> All Documents <span>v</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-[8px] text-[13px] bg-bg-surface hover:bg-slate-50 text-text-secondary">
          <User className="w-4 h-4" /> Person <span>v</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-[8px] text-[13px] bg-bg-surface hover:bg-slate-50 text-text-secondary">
          <Calendar className="w-4 h-4" /> Dates <span>v</span>
        </button>
      </div>

      <div className="w-full bg-bg-surface rounded-t-[12px] border border-border">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-[12px] font-semibold text-text-secondary h-[48px] bg-bg-surface rounded-t-[12px]">
              <th className="w-[40px] pl-4"><div className="w-4 h-4 rounded border border-border bg-slate-50" /></th>
              <th className="w-[35%] font-semibold">Name</th>
              <th className="w-[20%] font-semibold">Created By</th>
              <th className="w-[15%] font-semibold">Size</th>
              <th className="w-[15%] font-semibold">Created</th>
              <th className="w-[15%] font-semibold">Last Modified</th>
              <th className="w-[40px]"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="h-[96px] text-center text-[13px] text-text-secondary">
                  Loading documents...
                </td>
              </tr>
            )}

            {!loading && documents.length === 0 && (
              <tr>
                <td colSpan={7} className="h-[96px] text-center text-[13px] text-text-secondary">
                  {emptyLabel}
                </td>
              </tr>
            )}

            {!loading && documents.map((doc) => {
              const isShared = Boolean(doc.is_shared);
              const initials = isShared ? "SH" : "ME";

              return (
                <tr
                  key={doc.id}
                  onClick={() => onOpen(doc)}
                  className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] h-[52px] group transition-colors cursor-pointer"
                >
                  <td className="pl-4">
                    {!isShared ? (
                      <div className="w-4 h-4 rounded bg-accent-green flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded border border-border bg-white" />
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      {isShared ? (
                        <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center shrink-0">
                          <LinkIcon className="w-4 h-4 text-accent-blue" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded bg-green-50 flex items-center justify-center shrink-0">
                          <div className="w-4 h-4 bg-accent-green rounded-[2px]" />
                        </div>
                      )}
                      <span className="text-[14px] font-medium text-text-primary">{truncate(doc.title, 48)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar initials={initials} size="sm" className={isShared ? "bg-blue-100 text-accent-blue" : "bg-green-100 text-accent-green"} />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-text-primary leading-tight">
                          {isShared ? "Shared user" : "You"}
                        </span>
                        <span className="text-[11px] text-text-secondary leading-tight mt-0.5">
                          {isShared ? "Editor" : "Owner"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="text-[13px] text-text-muted">-</td>
                  <td className="text-[13px] text-text-muted">{formatDate(doc.created_at)}</td>
                  <td className="text-[13px] text-text-muted">{formatDate(doc.updated_at)}</td>
                  <td className="pr-4 text-right">
                    {isShared && <Badge variant="blue" className="mr-3">Shared</Badge>}
                    <button className="text-text-muted hover:text-text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
