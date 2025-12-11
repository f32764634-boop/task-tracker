export interface Task {
  id: string;
  title: string;
  createdBranch: string;
  taskBranch: string;
  prLink: string;
  serverType: 'backend' | 'frontend';
  serverName: string;
  createdAt: string;
}

export interface TaskNote {
  id: string;
  taskId: string;
  content: string;
  createdAt: string;
}

export type ServerType = 'backend' | 'frontend';

export const SERVER_NAMES = [
  'dev',
  'dev-exp',
  'qa',
  'stage',
  'prod',
] as const;

export type ServerName = typeof SERVER_NAMES[number];
