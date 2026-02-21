import Dashboard from "@/components/dashboard";

async function getDashboardData() {
  try {
    const res = await fetch('/api/dashboard', { next: { revalidate: 10 } });
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch (e) {
    console.error(e);
    return {
      activity: [
        {
          type: "heartbeat",
          title: "System Startup",
          description: "Dashboard initialized",
          time: new Date().toLocaleTimeString()
        }
      ],
      isRunningTask: false,
      currentTask: null,
      files: []
    };
  }
}

export default async function Home() {
  const data = await getDashboardData();

  return (
    <Dashboard
      activity={data.activity || []}
      isRunningTask={data.isRunningTask || false}
      currentTask={data.currentTask}
      memoryFiles={data.files || []}
    />
  );
}
