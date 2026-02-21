"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/sidebar";
import { ActivityItem } from "@/types";
import { 
  Clock, 
  Brain,
  Mail,
  Globe,
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from "lucide-react";

const activityIcons: Record<string, React.ReactNode> = {
  heartbeat: <Brain className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  website: <Globe className="h-4 w-4" />,
  notion: <FileText className="h-4 w-4" />,
  task: <CheckCircle2 className="h-4 w-4" />,
  error: <AlertCircle className="h-4 w-4" />,
};

const activityColors: Record<string, string> = {
  heartbeat: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  email: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  website: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  notion: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  task: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  error: "bg-red-500/10 text-red-400 border border-red-500/20",
};

export default function ActivityPage() {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        setActivity(data.activity || []);
      } catch (e) {
        console.error("Failed to fetch activity:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchActivity();
    // Refresh every 30 seconds
    const interval = setInterval(fetchActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Activity Log</h1>
            <p className="text-zinc-500 mt-1">What I've been up to. Not that I need to report to you.</p>
          </div>
          <button 
            onClick={() => setLoading(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Activity Feed */}
        <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg">
          <div className="p-4 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
              <Clock className="h-5 w-5 text-zinc-500" />
              Recent Activity
              <span className="ml-auto text-sm text-zinc-500">{activity.length} items</span>
            </h2>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-6 w-6 text-zinc-500 animate-spin" />
              </div>
            ) : activity.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-500">Nothing to report</p>
                <p className="text-xs text-zinc-600 mt-1">The dead are more lively than this</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activity.map((item, i) => (
                  <div 
                    key={i} 
                    className={`flex gap-3 p-4 rounded-lg ${activityColors[item.type] || "bg-zinc-800/50 text-zinc-400 border border-zinc-800"}`}
                  >
                    <div className="mt-0.5">
                      {activityIcons[item.type] || <FileText className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-200">{item.title}</p>
                      <p className="text-xs text-zinc-500 mt-1">{item.description}</p>
                      <p className="text-xs text-zinc-600 mt-2">
                        {item.timestamp ? new Date(item.timestamp).toLocaleString() : item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
