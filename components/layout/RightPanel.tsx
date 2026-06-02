import React from "react";
import { Clock, Folder, Star, MoreVertical } from "lucide-react";

export function RightPanel() {
  return (
    <aside className="fixed right-0 top-[64px] h-[calc(100vh-64px)] w-[280px] bg-bg-surface border-l border-border flex flex-col z-10 overflow-y-auto">
      {/* Announcements / Activity Feed */}
      <div className="p-6">
        <h3 className="text-[16px] font-semibold text-text-primary mb-4">Recent Activity</h3>
        <div className="flex flex-col">
          {[
            { title: "You created Project Brief", time: "2 min ago" },
            { title: "Shared Roadmap.doc with Bryce", time: "1 hr ago" },
            { title: "File imported successfully", time: "Today" },
            { title: "Document renamed", time: "Yesterday" },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-start gap-3 py-3 border-b border-border last:border-0 cursor-pointer hover:bg-slate-50 rounded-lg -mx-2 px-2 transition-colors">
              <Clock className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-text-primary truncate">{activity.title}</p>
                <p className="text-[12px] text-text-secondary mt-0.5">{activity.time}</p>
              </div>
              <span className="text-text-muted text-lg leading-none">›</span>
            </div>
          ))}
        </div>
      </div>

      {/* Folders */}
      <div className="p-6 pt-0 mt-4">
        <h3 className="text-[16px] font-semibold text-text-primary mb-4">Folders</h3>
        <div className="flex flex-col gap-1">
          {[
            { name: "Q2 Projects", subtitle: "Project Plan • 15 docs", color: "text-accent-green fill-accent-green", star: true },
            { name: "Client Docs", subtitle: "Team Plan • 35 docs", color: "text-accent-blue fill-accent-blue", star: false },
            { name: "Drafts", subtitle: "My Zip • 20 docs", color: "text-accent-yellow fill-accent-yellow", star: false },
          ].map((folder, idx) => (
            <div key={idx} className="flex items-center gap-3 py-3 border-b border-border last:border-0 hover:bg-slate-50 rounded-lg -mx-2 px-2 cursor-pointer transition-colors">
              <Folder className={`w-5 h-5 ${folder.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-text-primary truncate">{folder.name}</p>
                <p className={`text-[12px] mt-0.5 ${folder.color.split(" ")[0]}`}>{folder.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <Star className={`w-4 h-4 ${folder.star ? "text-star-active fill-star-active" : "text-star-inactive"}`} />
                <MoreVertical className="w-4 h-4 text-text-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
