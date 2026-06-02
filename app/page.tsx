"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/layout/Sidebar";
import type { Document } from "@/types";
import {
  CaretRight,
  MagnifyingGlass,
  Bell,
  Plus,
  FileText,
  UsersThree,
  CloudArrowUp,
  Star,
  FileDoc,
  DotsThreeVertical,
  ArrowDown,
  CheckCircle,
  Link as LinkIcon,
  FolderOpen,
  Clock,
  PlusCircle,
} from "@phosphor-icons/react";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [owned, setOwned] = useState<Document[]>([]);
  const [shared, setShared] = useState<Document[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch("/api/documents");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const json = await res.json();
      setOwned(json.data?.owned ?? []);
      setShared(json.data?.shared ?? []);
    } catch (e) {
      console.error(e);
    }
  }, [router]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUserEmail(data.user.email ?? "");
    });
    fetchDocuments();
  }, [fetchDocuments, router]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const createDocument = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const json = await res.json();
      if (json.data?.id) router.push(`/doc/${json.data.id}`);
    } finally {
      setCreating(false);
    }
  };

  const getInitials = (email: string) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-[#F5F6FA] relative" style={{minWidth: 0}}>
      <Sidebar isOpen={sidebarOpen} />
      
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-[#F5F6FA] overflow-hidden ml-0 lg:ml-[200px] xl:ml-[220px]" style={{minWidth: 0, maxWidth: '100%'}}>
        {/* Header */}
        <header className="h-16 px-4 md:px-6 xl:px-8 flex items-center justify-between gap-3 bg-white shrink-0 border-b border-gray-100 sticky top-0 z-20">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mr-1"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Breadcrumb */}
          <div className="hidden min-w-0 items-center gap-2 text-sm lg:flex">
            <span className="text-[#6B7280]">Ajaia</span>
            <span className="text-[#6B7280]">/</span>
            <span className="font-medium text-[#111827]">My Documents</span>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 xl:mx-8">
            <div className="relative w-full">
              <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full bg-[#F5F6FA] rounded-lg border border-[#E5E7EB] py-2 pl-11 pr-4 focus:ring-2 focus:ring-[#4F6EF7]/20 focus:border-[#4F6EF7] outline-none text-sm transition-all"
                style={{ paddingLeft: '44px', paddingRight: '16px' }}
              />
            </div>
          </div>
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 ml-auto">
            <MagnifyingGlass className="text-xl text-gray-600" />
          </button>

          {/* User */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button className="relative p-2 text-[#6B7280] hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
              <Bell className="text-xl" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 sm:border-l sm:border-[#E5E7EB] sm:pl-4">
              <div className="hidden text-right md:block">
                <p className="text-xs font-bold text-[#111827]">Signed in</p>
                <p className="max-w-[150px] truncate text-[10px] text-[#6B7280]">{userEmail || "Loading..."}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                {getInitials(userEmail)}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-4 pt-5 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1240px]">
          {/* Page Title + New Doc button */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-[#111827]">My Documents</h1>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 w-full sm:w-auto">
              <button
                onClick={createDocument}
                disabled={creating}
                className="w-full sm:w-auto bg-[#4F6EF7] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-70"
                style={{ padding: '10px 20px', boxShadow: '0 10px 25px -5px rgba(79,110,247,0.3)' }}
              >
                <Plus weight="bold" />
                {creating ? "Creating..." : "New Document"}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 mb-8">
            {[
              { label: 'DOCUMENTS', title: 'Documents', count: `${owned.length} Items`, color: '#22C55E', bg: 'bg-green-50', iconColor: 'text-[#22C55E]', bar: 'w-[65%]', icon: <FileText weight="fill" className="text-2xl" /> },
              { label: 'SHARED', title: 'Shared', count: `${shared.length} Items`, color: '#4F6EF7', bg: 'bg-blue-50', iconColor: 'text-[#4F6EF7]', bar: 'w-[40%]', icon: <UsersThree weight="fill" className="text-2xl" /> },
              { label: 'UPLOADS', title: 'Uploads', count: '370 Items', color: '#F59E0B', bg: 'bg-amber-50', iconColor: 'text-[#F59E0B]', bar: 'w-[80%]', icon: <CloudArrowUp weight="fill" className="text-2xl" /> },
              { label: 'STARRED', title: 'Starred', count: '457 Items', color: '#8B5CF6', bg: 'bg-purple-50', iconColor: 'text-[#8B5CF6]', bar: 'w-[25%]', icon: <Star weight="fill" className="text-2xl" /> },
            ].map((card) => (
              <div key={card.label} className="bg-white rounded-xl border border-[#E5E7EB] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 cursor-pointer" style={{padding: '20px'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px'}}>
                  <div style={{width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'}} className={card.bg + ' ' + card.iconColor}>
                    {card.icon}
                  </div>
                  <span style={{fontSize: '10px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>{card.label}</span>
                </div>
                <h3 style={{fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '4px'}}>{card.title}</h3>
                <p style={{fontSize: '12px', color: '#6B7280', marginBottom: '16px'}}>{card.count}</p>
                <div style={{width: '100%', backgroundColor: '#F5F6FA', height: '4px', borderRadius: '9999px'}}>
                  <div style={{backgroundColor: card.color, height: '100%', borderRadius: '9999px'}} className={card.bar}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#111827]">Recent Activity</h2>
              <button className="text-xs font-bold text-[#4F6EF7] hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Card 1 */}
              <div
                onClick={() => owned[0] && router.push(`/doc/${owned[0].id}`)}
                className="min-w-0 bg-white rounded-xl border border-[#E5E7EB] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <div className="h-32 bg-blue-50 flex items-center justify-center">
                  <FileDoc className="text-6xl text-[#4F6EF7]" />
                </div>
                <div className="p-4 border-t border-[#E5E7EB] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="text-[#4F6EF7] text-lg" />
                    <div>
                      <p className="text-sm font-semibold text-[#111827] truncate max-w-[160px]">Article System.doc</p>
                      <p className="text-[10px] text-[#6B7280]">Modified 2m ago</p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-[#F5F6FA] rounded text-[#6B7280]">
                    <DotsThreeVertical />
                  </button>
                </div>
              </div>

              {/* Card 2 */}
              <div className="min-w-0 bg-white rounded-xl border border-[#E5E7EB] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden">
                <div className="h-32 bg-green-50 flex items-center justify-center">
                  <FileText className="text-6xl text-green-500" />
                </div>
                <div className="p-4 border-t border-[#E5E7EB] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="text-green-500 text-lg" />
                    <div>
                      <p className="text-sm font-semibold text-[#111827] truncate max-w-[160px]">Language Article.pdf</p>
                      <p className="text-[10px] text-[#6B7280]">Modified 1h ago</p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-[#F5F6FA] rounded text-[#6B7280]">
                    <DotsThreeVertical />
                  </button>
                </div>
              </div>

              {/* Card 3 */}
              <div className="min-w-0 bg-white rounded-xl border border-[#E5E7EB] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden">
                <div className="h-32 bg-gray-50 flex items-center justify-center">
                  <FileText className="text-6xl text-gray-400" />
                </div>
                <div className="p-4 border-t border-[#E5E7EB] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="text-[#6B7280] text-lg" />
                    <div>
                      <p className="text-sm font-semibold text-[#111827] truncate max-w-[160px]">Test Scores.xls</p>
                      <p className="text-[10px] text-[#6B7280]">Modified 5h ago</p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-[#F5F6FA] rounded text-[#6B7280]">
                    <DotsThreeVertical />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Files Table */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
            {/* Table Toolbar */}
            <div className="p-4 md:p-6 border-b border-[#E5E7EB]">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3">
                <div className="relative w-full md:w-48">
                  <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm" />
                  <input
                    type="text"
                    placeholder="Search in table..."
                    className="w-full bg-[#F5F6FA] rounded-lg border border-[#E5E7EB] py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F6EF7]"
                    style={{ paddingLeft: '36px', paddingRight: '16px' }}
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto scrollbar-hide">
                  <button className="bg-[#F5F6FA] shrink-0 border border-[#E5E7EB] rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-white transition-colors" style={{ padding: '8px 16px' }}>
                    <FileText className="text-sm" /> All Documents <CaretRight className="text-xs rotate-90" />
                  </button>
                  <div className="hidden md:flex gap-3">
                    <button className="bg-[#F5F6FA] shrink-0 border border-[#E5E7EB] rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-white transition-colors" style={{ padding: '8px 16px' }}>
                      Person <CaretRight className="text-xs rotate-90" />
                    </button>
                    <button className="bg-[#F5F6FA] shrink-0 border border-[#E5E7EB] rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-white transition-colors" style={{ padding: '8px 16px' }}>
                      Dates <CaretRight className="text-xs rotate-90" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left">
                <thead className="bg-[#F5F6FA]/50 border-b border-[#E5E7EB] text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 w-12">
                      <input type="checkbox" className="rounded border-[#E5E7EB]" />
                    </th>
                    <th className="px-4 py-4">
                      Name <ArrowDown className="inline ml-1 text-xs" />
                    </th>
                    <th className="hidden md:table-cell px-4 py-4">Created By</th>
                    <th className="hidden lg:table-cell px-4 py-4">Size</th>
                    <th className="px-4 py-4">
                      Created <ArrowDown className="inline ml-1 text-xs" />
                    </th>
                    <th className="hidden sm:table-cell px-4 py-4">
                      Last Modified <ArrowDown className="inline ml-1 text-xs" />
                    </th>
                    <th className="px-4 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-[#E5E7EB]">
                  {owned.map((doc) => (
                    <tr
                      key={doc.id}
                      onClick={() => router.push(`/doc/${doc.id}`)}
                      className="hover:bg-[#F5F6FA] transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <input type="checkbox" defaultChecked className="accent-[#4F6EF7]" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-[#4F6EF7]">
                            <FileDoc />
                          </div>
                          <span className="font-medium text-[#111827]">{doc.title || "Untitled"}</span>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-600">
                            {getInitials(userEmail)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#111827]">You</p>
                            <p className="text-[10px] text-[#6B7280]">Owner</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden lg:table-cell px-4 py-4 text-[#6B7280]">2 KB</td>
                      <td className="px-4 py-4 text-[#6B7280]">{new Date(doc.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                      <td className="hidden sm:table-cell px-4 py-4 text-[#6B7280]">{new Date(doc.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                      <td className="px-4 py-4">
                        <CheckCircle className="text-[#22C55E] text-lg" />
                      </td>
                    </tr>
                  ))}
                  {owned.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#6B7280] text-sm">
                        No documents yet. Create your first one!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="hidden xl:flex flex-col fixed right-0 top-0 h-full w-[280px] bg-white border-l border-gray-100 overflow-y-auto">
        {/* Announcements */}
        <div className="p-6">
          <h2 className="text-lg font-bold text-[#111827] mb-6">Announcement</h2>
          <div className="flex flex-col gap-6">
            {[
              { title: "Storage Still available", time: "Mon, 6 May, 09.30 AM" },
              { title: "XLS Changes", time: "Mon, 6 May, 02.00 PM" },
              { title: "Material downloaded", time: "Tue, 7 May, 07.30 AM" },
              { title: "PDF Download Success", time: "Tue, 7 May, 11.30 AM" },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 group cursor-pointer">
                <div className="w-2 rounded-full bg-blue-100 group-hover:bg-[#4F6EF7] transition-colors shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-[#111827]">{item.title}</h3>
                    <CaretRight className="text-[#6B7280] text-xs" />
                  </div>
                  <p className="text-[10px] text-[#6B7280] flex items-center gap-1">
                    <Clock className="text-xs" /> {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Folders */}
        <div className="p-6 border-t border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#111827]">Folders</h2>
            <PlusCircle className="text-[#4F6EF7] text-xl cursor-pointer hover:opacity-80" />
          </div>
          <div className="flex flex-col gap-4">
            {[
              { name: "May Project", sub: "Project Plan • 15 Files • 185 MB", color: "bg-green-50", icon: "text-green-500", starred: true },
              { name: "Project Client", sub: "Team Plan • 35 Files • 583 MB", color: "bg-blue-50", icon: "text-[#4F6EF7]", starred: false },
              { name: "Task Drive", sub: "My Zip • 20 Files • 288 MB", color: "bg-amber-50", icon: "text-amber-500", starred: false },
            ].map((folder) => (
              <div
                key={folder.name}
                className="bg-[#F5F6FA]/50 p-4 rounded-xl border border-transparent hover:border-[#4F6EF7] hover:bg-white transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${folder.color} flex items-center justify-center ${folder.icon}`}>
                      <FolderOpen weight="fill" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#111827]">{folder.name}</h3>
                      <p className="text-[10px] text-[#6B7280]">{folder.sub}</p>
                    </div>
                  </div>
                  <button className="text-[#6B7280]">
                    <DotsThreeVertical />
                  </button>
                </div>
                <div className="flex items-center justify-end">
                  <Star weight={folder.starred ? "fill" : "regular"} className={folder.starred ? "text-amber-400" : "text-[#6B7280]"} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
