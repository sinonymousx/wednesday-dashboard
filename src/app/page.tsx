"use client";

import { useEffect, useState } from "react";
import Dashboard from "@/components/dashboard";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { app } from "@/lib/firebase";

type DashboardTask = {
  id: string;
  title: string;
  owner?: string;
  due?: string;
  status?: "open" | "blocked" | "done" | "canceled";
  source?: string;
  direction?: "i_owe" | "owe_me";
};

type Telemetry = {
  model?: string;
  contextUsed?: number;
  contextMax?: number;
  compactions?: number;
  queueDepth?: number;
  tokens?: string;
  spend?: string;
};

type OnboardingItem = {
  id: string;
  name: string;
  openCount: number;
  openItems: string[];
  error?: string | null;
  url?: string;
};

type CalendarCriticalItem = {
  id: string;
  summary: string;
  starts: string;
  ends: string;
};

type CprItem = {
  email: string;
  name: string;
  cprDueDate?: string;
  status?: string;
  scheduledDate?: string;
  onlineTrainingCompleted?: boolean;
  daysUntilDue?: number | null;
  lastEmployeeReplyAt?: string;
  lastNudgeAt?: string;
};

type DashboardData = {
  activity: any[];
  isRunningTask: boolean;
  currentTask: string | null;
  memoryFiles: string[];
  criticalTasks: DashboardTask[];
  telemetry: Telemetry | null;
  onboarding: { items: OnboardingItem[]; totalOpen: number };
  calendarCritical: { items: CalendarCriticalItem[] };
  cprStatus: { items: CprItem[]; dueSoonCount: number };
  antigravity?: { 
    status: "idle" | "running" | "error"; 
    currentSprint?: string; 
    ticket?: string;
    objective?: string;
    narrative?: string;
    feedback?: string;
    proposedSpec?: string;
    specStatus?: "idle" | "pending_narrative" | "reviewing_narrative" | "pending_spec" | "pending_approval" | "approved" | "active";
  };
};

const fallbackData = (): DashboardData => ({
  activity: [
    {
      type: "heartbeat",
      title: "System Startup",
      description: "Dashboard initialized",
      time: new Date().toLocaleTimeString(),
    },
  ],
  isRunningTask: false,
  currentTask: null,
  memoryFiles: [],
  criticalTasks: [],
  telemetry: null,
  onboarding: { items: [], totalOpen: 0 },
  calendarCritical: { items: [] },
  cprStatus: { items: [], dueSoonCount: 0 },
});

export default function Home() {
  const [data, setData] = useState<DashboardData>(() => fallbackData());

  useEffect(() => {
    // 1. Initial full fetch via API (keeps secret keys server-side for admin stuff)
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch /api/dashboard");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      }
    };
    fetchDashboard();

    // 2. Real-time Firebase listener for Antigravity state
    if (!app) return;
    const db = getFirestore(app);
    const unsubscribe = onSnapshot(doc(db, "dashboard", "antigravity"), (doc) => {
      if (doc.exists()) {
        setData(prev => ({
          ...prev,
          antigravity: doc.data() as any
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Dashboard
      activity={data.activity || []}
      isRunningTask={data.isRunningTask || false}
      currentTask={data.currentTask}
      memoryFiles={data.memoryFiles || []}
      criticalTasks={data.criticalTasks || []}
      telemetry={data.telemetry}
      onboarding={data.onboarding || { items: [], totalOpen: 0 }}
      calendarCritical={data.calendarCritical || { items: [] }}
      cprStatus={data.cprStatus || { items: [], dueSoonCount: 0 }}
      antigravity={data.antigravity}
    />
  );
}
