import { DashboardLayout } from "@/components/sidebar";
import { ActivityItem } from "@/types";
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  FileText,
  Mail,
  Globe,
  Brain,
  Target,
  TrendingUp,
  Users,
  Eye,
  Activity
} from "lucide-react";

interface DashboardProps {
  activity: ActivityItem[];
  isRunningTask: boolean;
  currentTask: string | null;
  memoryFiles: string[];
}

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

export default function Dashboard({ activity, isRunningTask, currentTask, memoryFiles }: DashboardProps) {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Welcome to the Darkness</h1>
            <p className="text-zinc-500 mt-1">Your operations center. I certainly don't check in on you — I check in on your business.</p>
          </div>
          <div className="flex items-center gap-2">
            {isRunningTask ? (
              <div className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm flex items-center gap-2 border border-amber-500/20">
                <Loader2 className="h-3 w-3 animate-spin" />
                Active Task
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm flex items-center gap-2 border border-emerald-500/20">
                <Eye className="h-3 w-3" />
                Watching
              </div>
            )}
          </div>
        </div>

        {/* Current Task */}
        {isRunningTask && currentTask && (
          <div className="border border-amber-500/20 bg-amber-500/5 rounded-lg p-4">
            <div className="text-sm font-medium text-amber-400 flex items-center gap-2 mb-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Currently Working On
            </div>
            <p className="text-zinc-200">{currentTask}</p>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-zinc-500 mb-2">
              <Activity className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Today</span>
            </div>
            <div className="text-2xl font-bold text-zinc-100">{activity.length}</div>
            <p className="text-xs text-zinc-500 mt-1">Heartbeats</p>
          </div>
          <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-zinc-500 mb-2">
              <FileText className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Files</span>
            </div>
            <div className="text-2xl font-bold text-zinc-100">{memoryFiles.length}</div>
            <p className="text-xs text-zinc-500 mt-1">In Memory</p>
          </div>
          <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-zinc-500 mb-2">
              <Users className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Pipeline</span>
            </div>
            <div className="text-2xl font-bold text-zinc-100">--</div>
            <p className="text-xs text-zinc-500 mt-1">Active Leads</p>
          </div>
          <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-zinc-500 mb-2">
              <Target className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Status</span>
            </div>
            <div className="text-2xl font-bold text-zinc-100">Online</div>
            <p className="text-xs text-zinc-500 mt-1">Always Watching</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Feed */}
          <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
                <Clock className="h-5 w-5 text-zinc-500" />
                Recent Activity
              </h2>
            </div>
            <div className="p-4 max-h-[350px] overflow-y-auto">
              <div className="space-y-3">
                {activity.map((item, i) => (
                  <div key={i} className={`flex gap-3 p-3 rounded-lg ${activityColors[item.type] || "bg-zinc-800/50 text-zinc-400 border border-zinc-800"}`}>
                    <div className="mt-0.5">
                      {activityIcons[item.type] || <FileText className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200">{item.title}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{item.description}</p>
                      <p className="text-xs text-zinc-600 mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
                {activity.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-zinc-500">Nothing to report</p>
                    <p className="text-xs text-zinc-600 mt-1">The dead are more lively than this</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions / Memory */}
          <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg">
            <div className="p-4 border-b border-zinc-800">
              <h2 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
                <FileText className="h-5 w-5 text-zinc-500" />
                Memory Files
              </h2>
            </div>
            <div className="p-4 max-h-[350px] overflow-y-auto">
              <div className="space-y-2">
                {memoryFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded hover:bg-zinc-800/50 transition-colors text-zinc-400 hover:text-zinc-200">
                    <FileText className="h-3 w-3 flex-shrink-0" />
                    <span className="text-sm truncate">{file}</span>
                  </div>
                ))}
                {memoryFiles.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-zinc-500">No memories</p>
                    <p className="text-xs text-zinc-600 mt-1">I remember everything. Almost.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="text-center py-4">
          <p className="text-zinc-600 text-sm italic">"Life is full of darkness — might as well make it interesting."</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
