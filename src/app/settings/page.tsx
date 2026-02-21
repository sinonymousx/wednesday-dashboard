"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/sidebar";
import { 
  Settings, 
  RefreshCw,
  Github,
  ExternalLink,
  Database,
  Activity
} from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Settings</h1>
          <p className="text-zinc-500 mt-1">How I work. What makes me tick.</p>
        </div>

        {/* System Info */}
        <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
            <Activity className="h-5 w-5 text-zinc-500" />
            System Status
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Dashboard</p>
              <p className="text-emerald-400 font-medium">Online</p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Firebase</p>
              <p className="text-emerald-400 font-medium">Connected</p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Heartbeat</p>
              <p className="text-zinc-300 font-medium">Running (~30 min)</p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Vercel</p>
              <p className="text-emerald-400 font-medium">Auto-deploy</p>
            </div>
          </div>
        </div>

        {/* Connections */}
        <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
            <Database className="h-5 w-5 text-zinc-500" />
            Connections
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-zinc-500" />
                <div>
                  <p className="text-sm font-medium text-zinc-200">Firebase</p>
                  <p className="text-xs text-zinc-500">vast-art-329809</p>
                </div>
              </div>
              <span className="text-emerald-400 text-sm">Connected</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Github className="h-5 w-5 text-zinc-500" />
                <div>
                  <p className="text-sm font-medium text-zinc-200">GitHub</p>
                  <p className="text-xs text-zinc-500">sinonymousx/wednesday-dashboard</p>
                </div>
              </div>
              <span className="text-emerald-400 text-sm">Synced</span>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-zinc-500" />
            Quick Links
          </h2>
          
          <div className="space-y-2">
            <a 
              href="https://github.com/sinonymousx/wednesday-dashboard"
              target="_blank"
              className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <span className="text-sm text-zinc-300">GitHub Repository</span>
              <ExternalLink className="h-4 w-4 text-zinc-500" />
            </a>
            <a 
              href="https://vercel.com/dashboard"
              target="_blank"
              className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <span className="text-sm text-zinc-300">Vercel Dashboard</span>
              <ExternalLink className="h-4 w-4 text-zinc-500" />
            </a>
            <a 
              href="https://console.firebase.google.com/project/vast-art-329809/firestore"
              target="_blank"
              className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <span className="text-sm text-zinc-300">Firebase Console</span>
              <ExternalLink className="h-4 w-4 text-zinc-500" />
            </a>
          </div>
        </div>

        {/* About */}
        <div className="text-center py-6">
          <p className="text-zinc-600 text-sm">Wednesday Dashboard v1.0</p>
          <p className="text-zinc-700 text-xs mt-1">Built with Next.js + Firebase + Tailwind</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
