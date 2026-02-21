"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/sidebar";
import { 
  Brain, 
  Search,
  RefreshCw,
  TrendingUp,
  Users,
  Building2,
  Target
} from "lucide-react";

interface ResearchItem {
  id: string;
  title: string;
  description: string;
  category: 'partner' | 'competitor' | 'courses' | 'market';
  status: 'researching' | 'completed' | 'pending';
}

export default function ResearchPage() {
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'partner' | 'competitor' | 'courses' | 'market'>('all');

  useEffect(() => {
    setItems([
      { id: "1", title: "Robert E. Armel Jr.", description: "DeCA Pacific - Overseas Product Specialist. Based Okinawa. Works with Eric Bable.", category: 'partner', status: 'completed' },
      { id: "2", title: "Jasmine Johnson", description: "MCCS Okinawa - Training & Curriculum Specialist. Key decision maker for Youth Programs.", category: 'partner', status: 'completed' },
      { id: "3", title: "Okinawa Language School A", description: "Competitor - offers English, Japanese courses. Pricing: ¥3000/hr", category: 'competitor', status: 'pending' },
      { id: "4", title: "STEM Education Trends 2026", description: "Solar ovens, bristle bots, AI for kids, sustainable design", category: 'courses', status: 'completed' },
      { id: "5", title: "PACAF 18 FSS Youth Programs", description: "Youth Centers, Teen Centers - potential contract opportunities", category: 'market', status: 'researching' },
      { id: "6", title: "DeCA Procurement Cycle", description: "Organic/as-needed basis unless contract vehicle specified", category: 'market', status: 'completed' },
    ]);
    setLoading(false);
  }, []);

  const filteredItems = items.filter(i => filter === 'all' || i.category === filter);

  const categoryIcons: Record<string, React.ReactNode> = {
    partner: <Users className="h-4 w-4" />,
    competitor: <Building2 className="h-4 w-4" />,
    courses: <Brain className="h-4 w-4" />,
    market: <TrendingUp className="h-4 w-4" />,
  };

  const categoryColors: Record<string, string> = {
    partner: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    competitor: "bg-red-500/10 text-red-400 border-red-500/20",
    courses: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    market: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  const statusColors: Record<string, string> = {
    completed: "text-emerald-400",
    researching: "text-amber-400", 
    pending: "text-zinc-500",
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Research</h1>
            <p className="text-zinc-500 mt-1">What I've learned. What I'm learning.</p>
          </div>
          <button 
            onClick={() => setLoading(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'partner', 'competitor', 'courses', 'market'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                filter === f 
                  ? "bg-zinc-800 text-zinc-100" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
              }`}
            >
              {f !== 'all' && categoryIcons[f]}
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Research Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 text-zinc-500 animate-spin" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <Brain className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">Nothing researched yet</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div 
                key={item.id}
                className={`border rounded-lg p-4 ${categoryColors[item.category]}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {categoryIcons[item.category]}
                    <span className="text-xs uppercase tracking-wider opacity-60">{item.category}</span>
                  </div>
                  <span className={`text-xs ${statusColors[item.status]}`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="font-medium text-zinc-200">{item.title}</h3>
                <p className="text-sm text-zinc-400 mt-1">{item.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
