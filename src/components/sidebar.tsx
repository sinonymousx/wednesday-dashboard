"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Activity, 
  FileText, 
  Users, 
  Brain,
  Settings,
  Target,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Skull
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Overview" },
  { href: "/activity", icon: Activity, label: "Activity" },
  { href: "/files", icon: FileText, label: "Memory Files" },
  { href: "/pipeline", icon: Users, label: "Contacts" },
  { href: "/tasks", icon: Target, label: "Tasks" },
  { href: "/research", icon: Brain, label: "Research" },
  { href: "/sales", icon: TrendingUp, label: "Sales" },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={`${collapsed ? "w-16" : "w-64"} min-h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col transition-all duration-300`}>
      {/* Logo */}
      <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center">
          <Skull className="h-5 w-5 text-zinc-400" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-sm font-bold text-zinc-100 tracking-wide">WEDNESDAY</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Operations</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive 
                  ? "bg-zinc-800/80 text-zinc-100" 
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-zinc-800">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 transition-colors"
        >
          <Settings className="h-5 w-5" />
          {!collapsed && <span className="text-sm">Settings</span>}
        </Link>
        
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 transition-colors mt-1"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
