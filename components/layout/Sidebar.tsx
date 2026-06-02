import React from "react";
import Link from "next/link";
import { 
  FileText, 
  HouseLine, 
  Files, 
  ClockCounterClockwise, 
  UsersThree, 
  Star, 
  Trash, 
  HardDrive, 
  RocketLaunch 
} from "@phosphor-icons/react";

interface SidebarProps {
  isOpen?: boolean;
}

export function Sidebar({ isOpen = false }: SidebarProps) {
  return (
    <aside className={`
      fixed left-0 top-0 h-full z-40 bg-white border-r border-gray-100
      transition-transform duration-300 ease-in-out
      w-[220px] xl:w-[220px] lg:w-[200px] flex flex-col shrink-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="p-6 overflow-y-auto flex-1 scrollbar-hide">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4F6EF7]">
            <FileText weight="bold" className="text-xl text-white" />
          </div>
          <span className="truncate text-xl font-bold tracking-tight text-primary">Ajaia Docs</span>
        </div>

        <div className="mb-8 space-y-2">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-widest text-secondary">Main</p>
          <Link href="#" className="sidebar-item-active radius-button flex min-h-11 items-center gap-3 text-sm font-medium transition-all" style={{ padding: '12px 16px' }}>
            <HouseLine weight="bold" className="shrink-0 text-lg" /> <span className="truncate">My Documents</span>
          </Link>
          <Link href="#" className="radius-button flex min-h-11 items-center gap-3 text-sm font-medium text-secondary transition-all hover:bg-gray-50" style={{ padding: '12px 16px' }}>
            <Files weight="bold" className="shrink-0 text-lg" /> <span className="truncate">All Files</span>
          </Link>
          <Link href="#" className="radius-button flex min-h-11 items-center gap-3 text-sm font-medium text-secondary transition-all hover:bg-gray-50" style={{ padding: '12px 16px' }}>
            <ClockCounterClockwise weight="bold" className="shrink-0 text-lg" /> <span className="truncate">Recent</span>
          </Link>
          <Link href="#" className="radius-button flex min-h-11 items-center justify-between gap-3 text-sm font-medium text-secondary transition-all hover:bg-gray-50" style={{ padding: '12px 16px' }}>
            <div className="flex min-w-0 items-center gap-3">
              <UsersThree weight="bold" className="shrink-0 text-lg" /> <span className="truncate">Shared</span>
            </div>
            <span className="shrink-0 rounded-full bg-[#EF4444] px-2 py-0.5 text-[10px] text-white">5</span>
          </Link>
          <Link href="#" className="radius-button flex min-h-11 items-center gap-3 text-sm font-medium text-secondary transition-all hover:bg-gray-50" style={{ padding: '12px 16px' }}>
            <Star weight="bold" className="shrink-0 text-lg" /> <span className="truncate">Starred</span>
          </Link>
        </div>

        <div className="space-y-2">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-widest text-secondary">System</p>
          <Link href="#" className="radius-button flex min-h-11 items-center gap-3 text-sm font-medium text-secondary transition-all hover:bg-gray-50" style={{ padding: '12px 16px' }}>
            <Trash weight="bold" className="shrink-0 text-lg" /> <span className="truncate">Trash</span>
          </Link>
          <div className="mt-4 rounded-xl border border-base bg-[#F8FAFC] p-4">
            <div className="mb-3 flex items-center justify-between text-xs text-secondary">
              <div className="flex items-center gap-2">
                <HardDrive weight="bold" className="text-base" /> Storage
              </div>
              <span>52%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div className="h-full w-[52%] rounded-full bg-[#4F6EF7]"></div>
            </div>
            <p className="mt-3 text-xs text-secondary">16.7 GB of 32 GB used</p>
          </div>
        </div>
      </div>

      <div className="mt-auto p-6 pt-0 shrink-0">
        <div className="radius-card relative overflow-hidden bg-[#EEF2FF] p-5">
          <div className="relative z-10">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/70">
              <RocketLaunch weight="fill" className="text-3xl text-[#4F6EF7]" />
            </div>
            <p className="mb-4 text-sm font-bold leading-snug text-primary">Upgrade Premium to Get More Space</p>
            <button className="radius-button w-full bg-[#4F6EF7] py-2.5 text-xs font-bold text-white transition-all hover:bg-opacity-90">Upgrade Plan</button>
          </div>
        </div>
      </div>
    </aside>
  );
}
