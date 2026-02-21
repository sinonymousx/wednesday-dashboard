"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/sidebar";
import { 
  TrendingUp, 
  Search,
  RefreshCw,
  DollarSign,
  FileText,
  Send,
  Clock,
  CheckCircle2
} from "lucide-react";

interface Sale {
  id: string;
  company: string;
  contact: string;
  value?: number;
  status: 'lead' | 'quoted' | 'won' | 'lost';
  lastContact?: string;
  notes?: string;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'lead' | 'quoted' | 'won' | 'lost'>('all');

  useEffect(() => {
    // Demo data
    setSales([
      { id: "1", company: "MCCS Okinawa (Foster SAC)", contact: "Jasmine Johnson", value: 2000, status: 'won', notes: "Contract #BUM25-C-0008" },
      { id: "2", company: "Youth Center", contact: "Samantha Silva", value: 1050, status: 'won', notes: "$10.50/student/hour" },
      { id: "3", company: "Teen Center", contact: "Samantha Silva", value: 1050, status: 'won', notes: "$10.50/student/hour" },
      { id: "4", company: "OCSI", contact: "Nick McQuillin", status: 'lead', notes: "Operations - potential contract" },
      { id: "5", company: "DeCA Pacific", contact: "Eric Bable / Robert Armel", status: 'lead', notes: "Commissary opportunities" },
    ]);
    setLoading(false);
  }, []);

  const filteredSales = sales.filter(s => filter === 'all' || s.status === filter);

  const statusIcons: Record<string, React.ReactNode> = {
    lead: <Clock className="h-4 w-4 text-zinc-400" />,
    quoted: <FileText className="h-4 w-4 text-amber-400" />,
    won: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
    lost: <TrendingUp className="h-4 w-4 text-red-400" />,
  };

  const statusColors: Record<string, string> = {
    lead: "border-zinc-800 bg-zinc-900/50",
    quoted: "border-amber-500/20 bg-amber-500/5",
    won: "border-emerald-500/20 bg-emerald-500/5",
    lost: "border-red-500/20 bg-red-500/5",
  };

  const totalValue = sales
    .filter(s => s.status === 'won' && s.value)
    .reduce((acc, s) => acc + (s.value || 0), 0);

  const pipelineValue = sales
    .filter(s => (s.status === 'lead' || s.status === 'quoted') && s.value)
    .reduce((acc, s) => acc + (s.value || 0), 0);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Sales</h1>
            <p className="text-zinc-500 mt-1">Money. Opportunities. The sweet sound of winning.</p>
          </div>
          <button 
            onClick={() => setLoading(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-lg p-4">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Won</span>
            </div>
            <p className="text-2xl font-bold text-zinc-100">${totalValue.toLocaleString()}</p>
          </div>
          <div className="border border-amber-500/20 bg-amber-500/5 rounded-lg p-4">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Pipeline</span>
            </div>
            <p className="text-2xl font-bold text-zinc-100">${pipelineValue.toLocaleString()}</p>
          </div>
          <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <Send className="h-4 w-4" />
              <span className="text-sm">Active Deals</span>
            </div>
            <p className="text-2xl font-bold text-zinc-100">{sales.filter(s => s.status === 'lead' || s.status === 'quoted').length}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(['all', 'lead', 'quoted', 'won', 'lost'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f 
                  ? "bg-zinc-800 text-zinc-100" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Sales List */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 text-zinc-500 animate-spin" />
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">No deals here</p>
            </div>
          ) : (
            filteredSales.map((sale) => (
              <div 
                key={sale.id}
                className={`border rounded-lg p-4 ${statusColors[sale.status]}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {statusIcons[sale.status]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-zinc-200">{sale.company}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          sale.status === 'won' ? 'bg-emerald-500/20 text-emerald-400' :
                          sale.status === 'quoted' ? 'bg-amber-500/20 text-amber-400' :
                          sale.status === 'lost' ? 'bg-red-500/20 text-red-400' :
                          'bg-zinc-500/20 text-zinc-400'
                        }`}>
                          {sale.status}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500 mt-1">{sale.contact}</p>
                      {sale.notes && (
                        <p className="text-xs text-zinc-600 mt-2">{sale.notes}</p>
                      )}
                    </div>
                  </div>
                  {sale.value && (
                    <div className="text-right">
                      <p className="text-lg font-bold text-zinc-100">${sale.value.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
