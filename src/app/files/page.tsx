"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/sidebar";
import { 
  FileText, 
  FolderOpen, 
  Search,
  Clock,
  RefreshCw
} from "lucide-react";

interface MemoryFile {
  name: string;
  path: string;
  modified?: string;
}

export default function FilesPage() {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        setFiles(data.memoryFiles || []);
      } catch (e) {
        console.error("Failed to fetch files:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchFiles();
    const interval = setInterval(fetchFiles, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredFiles = files.filter(f => 
    f.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Memory Files</h1>
            <p className="text-zinc-500 mt-1">My memories. Every file tells a story.</p>
          </div>
          <button 
            onClick={() => setLoading(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
          />
        </div>

        {/* Files Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 text-zinc-500 animate-spin" />
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <FileText className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">No memories found</p>
              <p className="text-xs text-zinc-600 mt-1">The void is empty</p>
            </div>
          ) : (
            filteredFiles.map((file, i) => (
              <div 
                key={i}
                className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-zinc-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">{file}</p>
                    <p className="text-xs text-zinc-500 mt-1">Memory file</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Total memories</span>
            </div>
            <span className="text-xl font-bold text-zinc-100">{files.length}</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
