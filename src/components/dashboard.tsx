"use client";

import { DashboardLayout } from "@/components/sidebar";
import { ActivityItem } from "@/types";
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2,
  FileCode,
  Mail,
  Globe,
  BrainCircuit,
  Target,
  TrendingUp,
  Users,
  Eye,
  Activity,
  Skull,
  Zap,
  Power,
  RefreshCw,
  Terminal,
  Server
} from "lucide-react";
import { useState } from "react";

type CriticalTask = {
  id: string;
  title: string;
  owner?: string;
  due?: string;
  status?: "open" | "blocked" | "done";
  source?: string;
};

interface DashboardProps {
  activity: ActivityItem[];
  isRunningTask: boolean;
  currentTask: string | null;
  memoryFiles: string[];
  criticalTasks: CriticalTask[];
}

const activityIcons: Record<string, React.ReactNode> = {
  heartbeat: <BrainCircuit className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  website: <Globe className="h-4 w-4" />,
  notion: <FileCode className="h-4 w-4" />,
  task: <CheckCircle2 className="h-4 w-4" />,
  error: <Skull className="h-4 w-4" />,
};

const activityColors: Record<string, string> = {
  heartbeat: "bg-purple-950/30 text-purple-400 border-purple-900/50",
  email: "bg-blue-950/30 text-blue-400 border-blue-900/50",
  website: "bg-emerald-950/30 text-emerald-400 border-emerald-900/50",
  notion: "bg-amber-950/30 text-amber-400 border-amber-900/50",
  task: "bg-cyan-950/30 text-cyan-400 border-cyan-900/50",
  error: "bg-red-950/30 text-red-400 border-red-900/50",
};

export default function Dashboard({ activity, isRunningTask, currentTask, memoryFiles, criticalTasks }: DashboardProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    setLoadingAction(action);
    // Simulate API call for now
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoadingAction(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 font-mono">
        {/* Header */}
        <div className="flex items-end justify-between border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-100 tracking-tighter flex items-center gap-3">
              <Skull className="h-8 w-8 text-zinc-500" />
              OPERATIONS CENTER
            </h1>
            <p className="text-zinc-500 mt-2 text-sm uppercase tracking-widest">
              Surveillance Active • Systems Nominal • Threat Level: Low
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isRunningTask ? (
              <div className="px-4 py-2 rounded-md bg-amber-950/30 text-amber-500 text-xs uppercase tracking-wider flex items-center gap-2 border border-amber-900/50 animate-pulse">
                <Loader2 className="h-3 w-3 animate-spin" />
                Processing
              </div>
            ) : (
              <div className="px-4 py-2 rounded-md bg-emerald-950/30 text-emerald-500 text-xs uppercase tracking-wider flex items-center gap-2 border border-emerald-900/50">
                <Eye className="h-3 w-3" />
                Monitoring
              </div>
            )}
            <div className="px-4 py-2 rounded-md bg-zinc-900 text-zinc-500 text-xs uppercase tracking-wider border border-zinc-800 flex items-center gap-2">
              <Server className="h-3 w-3" />
              v2026.2.22
            </div>
          </div>
        </div>

        {/* Command Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Task Monitor */}
            <div className="border border-zinc-800 bg-zinc-900/30 rounded-lg p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="h-24 w-24 text-amber-500" />
              </div>
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                Current Execution Context
              </h2>
              {isRunningTask && currentTask ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
                    </div>
                    <div>
                      <p className="text-lg text-zinc-200 font-medium">{currentTask}</p>
                      <p className="text-sm text-zinc-500 mt-1">Process ID: {Math.floor(Math.random() * 9000) + 1000}</p>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500/50 w-2/3 animate-pulse"></div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 text-zinc-600 py-4">
                  <div className="h-2 w-2 rounded-full bg-zinc-700 animate-ping"></div>
                  <p>Awaiting commands...</p>
                </div>
              )}
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button 
                onClick={() => handleAction('scan')}
                disabled={!!loadingAction}
                className="p-4 border border-zinc-800 bg-zinc-900/30 rounded-lg hover:bg-zinc-800/50 hover:border-zinc-700 transition-all text-left group disabled:opacity-50"
              >
                <Target className="h-5 w-5 text-zinc-500 group-hover:text-purple-400 mb-3 transition-colors" />
                <div className="text-sm font-medium text-zinc-300">Run Scan</div>
                <div className="text-xs text-zinc-600 mt-1">System diagnostics</div>
              </button>
              
              <button 
                onClick={() => handleAction('research')}
                disabled={!!loadingAction}
                className="p-4 border border-zinc-800 bg-zinc-900/30 rounded-lg hover:bg-zinc-800/50 hover:border-zinc-700 transition-all text-left group disabled:opacity-50"
              >
                <BrainCircuit className="h-5 w-5 text-zinc-500 group-hover:text-cyan-400 mb-3 transition-colors" />
                <div className="text-sm font-medium text-zinc-300">Deep Research</div>
                <div className="text-xs text-zinc-600 mt-1">Initialize probe</div>
              </button>

              <button 
                onClick={() => handleAction('deploy')}
                disabled={!!loadingAction}
                className="p-4 border border-zinc-800 bg-zinc-900/30 rounded-lg hover:bg-zinc-800/50 hover:border-zinc-700 transition-all text-left group disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 text-zinc-500 group-hover:text-emerald-400 mb-3 transition-colors ${loadingAction === 'deploy' ? 'animate-spin' : ''}`} />
                <div className="text-sm font-medium text-zinc-300">Deploy</div>
                <div className="text-xs text-zinc-600 mt-1">Production push</div>
              </button>

              <button 
                onClick={() => handleAction('kill')}
                disabled={!!loadingAction}
                className="p-4 border border-zinc-800 bg-zinc-900/30 rounded-lg hover:bg-red-950/10 hover:border-red-900/30 transition-all text-left group disabled:opacity-50"
              >
                <Power className="h-5 w-5 text-zinc-500 group-hover:text-red-500 mb-3 transition-colors" />
                <div className="text-sm font-medium text-zinc-300 group-hover:text-red-400">Kill All</div>
                <div className="text-xs text-zinc-600 mt-1 group-hover:text-red-900/50">Emergency stop</div>
              </button>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-4">
            <div className="border border-zinc-800 bg-zinc-900/30 rounded-lg p-5">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Vital Signs</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-400">System Load</span>
                    <span className="text-emerald-500">12%</span>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500/50 w-[12%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-400">Memory Usage</span>
                    <span className="text-purple-500">45%</span>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500/50 w-[45%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-400">Storage</span>
                    <span className="text-cyan-500">67%</span>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500/50 w-[67%]"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-900/30 rounded-lg p-5">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Memory Index</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-zinc-100">{memoryFiles.length}</span>
                <span className="text-sm text-zinc-500">active nodes</span>
              </div>
              <p className="text-xs text-zinc-600 mt-2">Last consolidation: 14m ago</p>
            </div>
          </div>
        </div>

        {/* Critical Tasks */}
        <div className="border border-zinc-800 bg-zinc-900/30 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Critical Tasks</h2>
            <span className="text-xs text-zinc-500">{criticalTasks.filter(t => t.status !== "done").length} open</span>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {criticalTasks.length > 0 ? criticalTasks.map((task) => (
              <div key={task.id} className="p-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-zinc-200">{task.title}</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {task.owner ? `Owner: ${task.owner}` : "Owner: unassigned"}
                    {task.due ? ` • Due: ${task.due}` : ""}
                    {task.source ? ` • Source: ${task.source}` : ""}
                  </p>
                </div>
                <span className={`text-[10px] uppercase px-2 py-1 rounded border ${task.status === "blocked" ? "text-red-300 border-red-900 bg-red-950/40" : task.status === "done" ? "text-emerald-300 border-emerald-900 bg-emerald-950/40" : "text-amber-300 border-amber-900 bg-amber-950/40"}`}>
                  {task.status || "open"}
                </span>
              </div>
            )) : (
              <div className="p-4 text-sm text-zinc-500">No critical tasks tracked yet.</div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="border border-zinc-800 bg-zinc-900/30 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Event Log
            </h2>
            <div className="flex gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500/50"></span>
              <span className="h-2 w-2 rounded-full bg-amber-500/50"></span>
              <span className="h-2 w-2 rounded-full bg-emerald-500/50"></span>
            </div>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {activity.map((item, i) => (
              <div key={i} className="p-4 flex items-start gap-4 hover:bg-zinc-800/20 transition-colors group">
                <div className={`mt-1 p-1.5 rounded-md border ${activityColors[item.type] || "bg-zinc-800/50 border-zinc-700 text-zinc-400"}`}>
                  {activityIcons[item.type] || <FileCode className="h-3 w-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">{item.title}</p>
                    <span className="text-xs text-zinc-600 font-mono">{item.time}</span>
                  </div>
                  <p className="text-xs text-zinc-500 truncate">{item.description}</p>
                </div>
              </div>
            ))}
            {activity.length === 0 && (
              <div className="p-12 text-center">
                <Skull className="h-8 w-8 text-zinc-800 mx-auto mb-3" />
                <p className="text-zinc-600">No recent activity detected.</p>
                <p className="text-xs text-zinc-700 mt-1">Silence is suspicious.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
