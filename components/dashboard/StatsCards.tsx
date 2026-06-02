import React from "react";
import { FileText, Share2, Upload, Star } from "lucide-react";

type Props = {
  ownedCount: number;
  sharedCount: number;
};

export function StatsCards({ ownedCount, sharedCount }: Props) {
  const statsData = [
    { label: "My Documents", count: `${ownedCount} Items`, icon: FileText, iconBg: "bg-badge-green-bg", iconColor: "text-accent-green", barColor: "bg-accent-green", usage: "Owned workspace", width: `${Math.min(100, ownedCount * 8)}%` },
    { label: "Shared with Me", count: `${sharedCount} Items`, icon: Share2, iconBg: "bg-blue-100", iconColor: "text-accent-blue", barColor: "bg-accent-blue", usage: "Collaborator access", width: `${Math.min(100, sharedCount * 12)}%` },
    { label: "Uploads", count: `${ownedCount} Items`, icon: Upload, iconBg: "bg-[#FEF9C3]", iconColor: "text-accent-yellow", barColor: "bg-accent-yellow", usage: "Imported documents", width: `${Math.min(100, ownedCount * 6)}%` },
    { label: "Starred", count: "0 Items", icon: Star, iconBg: "bg-[#EDE9FE]", iconColor: "text-accent-purple", barColor: "bg-accent-purple", usage: "Not configured", width: "0%" },
  ];

  return (
    <div className="mb-[28px]">
      <div className="grid grid-cols-4 gap-[16px]">
        {statsData.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-bg-surface rounded-[12px] p-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center ${stat.iconBg} ${stat.iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-[16px] font-semibold text-text-primary mb-1">{stat.label}</h3>
              <p className="text-[12px] text-text-secondary mb-4">{stat.count}</p>
              
              <div className="w-full h-[6px] bg-storage-bar-bg rounded-[4px] overflow-hidden mb-2">
                <div className={`h-full ${stat.barColor} rounded-[4px]`} style={{ width: stat.width }} />
              </div>
              <p className="text-[11px] text-text-muted">{stat.usage}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
