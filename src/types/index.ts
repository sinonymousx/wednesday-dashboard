export type ActivityType = 'heartbeat' | 'email' | 'website' | 'notion' | 'task' | 'error';

export interface ActivityItem {
  type: ActivityType;
  title: string;
  description: string;
  time: string;
  timestamp?: string;
}

export interface TaskStatus {
  isRunning: boolean;
  currentTask: string | null;
}

export interface MemoryFile {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: MemoryFile[];
}
