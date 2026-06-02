import React from "react";
import { FileText, MoreVertical } from "lucide-react";

const recentFiles = [
  { filename: "Project Brief.doc", iconColor: "text-accent-blue" },
  { filename: "README.md", iconColor: "text-accent-green" },
  { filename: "Notes.txt", iconColor: "text-sidebar-text" },
];

export function RecentActivity() {
  return (
    <div className="mb-[28px]">
      <h2 className="text-[16px] font-semibold text-text-primary mb-4">Recent Activity</h2>
      <div className="flex gap-[16px] overflow-x-auto pb-2">
        {recentFiles.map((file, idx) => (
          <div key={idx} className="w-[180px] h-[160px] bg-bg-surface border border-border rounded-[12px] flex flex-col shrink-0 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="flex-1 flex items-center justify-center border-b border-border bg-slate-50/50">
              <FileText className={`w-10 h-10 ${file.iconColor}`} />
            </div>
            <div className="h-[52px] px-3 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-text-muted shrink-0" />
                <span className="text-[13px] text-text-primary truncate">{file.filename}</span>
              </div>
              <MoreVertical className="w-4 h-4 text-text-muted shrink-0 ml-1 cursor-pointer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
