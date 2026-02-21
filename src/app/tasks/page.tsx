"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/sidebar";
import { 
  Target, 
  Search,
  RefreshCw,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    // Demo tasks
    setTasks([
      { id: "1", title: "Invoice MCCS Foster SAC", description: "Send February invoice for Foster SAC program", status: 'completed', priority: 'high' },
      { id: "2", title: "Research DeCA contacts", description: "Deep dive on Robert E. Armel Jr.", status: 'completed', priority: 'medium' },
      { id: "3", title: "Setup heartbeat Firebase sync", description: "Write activity to Firestore on each heartbeat", status: 'completed', priority: 'high' },
      { id: "4", title: "Build dashboard pages", description: "Create all dashboard pages (files, pipeline, tasks, research, sales)", status: 'in_progress', priority: 'high' },
      { id: "5", title: "Get quote records from Wakana", description: "Email sent - awaiting response", status: 'pending', priority: 'medium' },
      { id: "6", title: "Research competitors", description: "Monitor Okinawa language school offerings", status: 'pending', priority: 'low' },
      { id: "7", title: "Notion sync contacts", description: "Query Notion for new contacts", status: 'completed', priority: 'medium' },
      { id: "8", title: "Website health check", description: "Verify all Koeigo sites are up", status: 'completed', priority: 'high' },
    ]);
    setLoading(false);
  }, []);

  const filteredTasks = tasks.filter(t => filter === 'all' || t.status === filter);

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <Circle className="h-4 w-4 text-zinc-500" />,
    in_progress: <Clock className="h-4 w-4 text-amber-400" />,
    completed: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
  };

  const priorityColors: Record<string, string> = {
    high: "border-l-red-500",
    medium: "border-l-amber-500", 
    low: "border-l-zinc-500",
  };

  const statusCounts = {
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Tasks</h1>
            <p className="text-zinc-500 mt-1">What needs doing. What I've done.</p>
          </div>
          <button 
            onClick={() => setLoading(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(['all', 'pending', 'in_progress', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f 
                  ? "bg-zinc-800 text-zinc-100" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
              }`}
            >
              {f === 'all' ? 'All' : f.replace('_', ' ')} 
              <span className="ml-2 text-xs opacity-60">
                {f === 'all' ? tasks.length : statusCounts[f as keyof typeof statusCounts]}
              </span>
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 text-zinc-500 animate-spin" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">No tasks here</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div 
                key={task.id}
                className={`border border-zinc-800 bg-zinc-900/50 rounded-lg p-4 border-l-4 ${priorityColors[task.priority]}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {statusIcons[task.status]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-zinc-200">{task.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        task.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-zinc-500/20 text-zinc-400'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1">{task.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
