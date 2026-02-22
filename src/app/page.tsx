"use client";

import { useEffect, useState } from "react";
import Dashboard from "@/components/dashboard";

type DashboardTask = {
  id: string;
  title: string;
  owner?: string;
  due?: string;
  status?: "open" | "blocked" | "done" | "canceled";
  source?: string;
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

type DashboardData = {
  activity: any[];
  isRunningTask: boolean;
  currentTask: string | null;
  memoryFiles: string[];
  criticalTasks: DashboardTask[];
  telemetry: Telemetry | null;
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
});

export default function Home() {
  const [data, setData] = useState<DashboardData>(() => fallbackData());

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const res = await fetch("/api/dashboard", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch /api/dashboard");
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        console.error(e);
        if (!cancelled) setData(fallbackData());
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Dashboard
      activity={data.activity || []}
      isRunningTask={data.isRunningTask || false}
      currentTask={data.currentTask}
      memoryFiles={data.memoryFiles || []}
      criticalTasks={data.criticalTasks || []}
      telemetry={data.telemetry}
    />
  );
}
