"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/sidebar";
import { FolderTree, Terminal, Zap, ArrowRight, Loader2, GitBranch, Play } from "lucide-react";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { app } from "@/lib/firebase";

type AntigravityState = {
  status: "idle" | "running" | "error"; 
  currentSprint?: string; 
  ticket?: string;
  objective?: string;
  specStatus?: string;
};

export default function WorkspacesPage() {
  const [antigravity, setAntigravity] = useState<AntigravityState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial fetch
    const fetchState = async () => {
      try {
        const res = await fetch("/api/dashboard", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch state");
        const json = await res.json();
        setAntigravity(json.antigravity || { status: 'idle' });
        setLoading(false);
      } catch (e) {
        console.error(e);
        if (loading) setLoading(false);
      }
    };
    fetchState();

    // 2. Real-time Firebase listener
    if (!app) return;
    const db = getFirestore(app);
    const unsubscribe = onSnapshot(doc(db, "dashboard", "antigravity"), (doc) => {
      if (doc.exists()) {
        setAntigravity(doc.data() as any);
      }
    });

    return () => unsubscribe();
  }, [loading]);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 font-mono">
        <div className="flex items-end justify-between border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-3">
              <FolderTree className="h-6 w-6 text-zinc-500" />
              Workspaces & Repositories
            </h1>
            <p className="text-zinc-500 mt-2 text-sm uppercase tracking-widest">
              Active Antigravity deployments across the local filesystem
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            
            {/* facilityLense Workspace Card */}
            <div className="border border-zinc-800 bg-zinc-900/30 rounded-lg overflow-hidden group">
              <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
                    <GitBranch className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-200">facilityLense</h2>
                    <span className="text-xs text-zinc-500">C:\Users\clayt\facilityLense</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase px-2 py-1 rounded border ${antigravity?.status === 'running' ? 'text-amber-300 border-amber-900 bg-amber-950/40 animate-pulse' : antigravity?.status === 'error' ? 'text-red-300 border-red-900 bg-red-950/40' : 'text-emerald-300 border-emerald-900 bg-emerald-950/40'}`}>
                    {antigravity?.status || 'idle'}
                  </span>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">Overarching Goal</span>
                    <p className="text-sm text-zinc-300 bg-zinc-950 p-3 rounded border border-zinc-800 h-full">
                      {antigravity?.objective || "No active objective. System is dormant."}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">Current Pipeline Spec</span>
                    <div className="text-xs text-zinc-400 bg-emerald-950/10 p-3 rounded border border-emerald-900/30 h-full font-mono whitespace-pre-wrap overflow-y-auto max-h-48">
                      {antigravity?.currentSprint || antigravity?.objective ? "Awaiting worker execution..." : "N/A"}
                    </div>
                  </div>
                </div>

                {antigravity?.specStatus === 'approved' && antigravity?.status !== 'running' && (
                  <div className="flex items-center gap-3 p-3 bg-amber-950/20 border border-amber-900/30 rounded text-amber-500/70 text-sm">
                    <Zap className="h-4 w-4" />
                    <span>Spec approved. Antigravity worker is ready for deployment.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Inactive Workspaces */}
            <div className="border border-zinc-800 bg-zinc-900/10 rounded-lg overflow-hidden opacity-50 grayscale">
              <div className="p-4 border-b border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
                    <GitBranch className="h-5 w-5 text-zinc-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-400">wednesday-dashboard</h2>
                    <span className="text-xs text-zinc-600">C:\Users\clayt\wednesday-dashboard</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase px-2 py-1 rounded border text-zinc-500 border-zinc-800 bg-zinc-900">
                  idle
                </span>
              </div>
              <div className="p-4">
                <p className="text-sm text-zinc-600">This workspace is currently managed directly by OpenClaw. No Antigravity worker attached.</p>
              </div>
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
}