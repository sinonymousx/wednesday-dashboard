"use client";

import { useEffect, useState } from "react";
import Dashboard from "@/components/dashboard";

type DashboardData = {
  activity: any[];
  isRunningTask: boolean;
  currentTask: string | null;
  files: string[];
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
  files: [],
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
      memoryFiles={data.files || []}
    />
  );
}
