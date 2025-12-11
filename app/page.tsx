import { getTasks } from './actions/tasks';
import TaskForm from './components/TaskForm';
import TaskTable from './components/TaskTable';
import DatabaseStatus from './components/DatabaseStatus';
import { Task } from '@/types/task';

export default async function Home() {
  let tasks: Task[] = [];
  let error: string | null = null;

  try {
    tasks = await getTasks();
  } catch (err) {
    console.error('Error loading tasks:', err);
    tasks = [];
    error = err instanceof Error ? err.message : 'Failed to load tasks';
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-2">
            Task → Branch → PR Tracker
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Track your tasks, branches, and pull requests in one place
          </p>
        </div>

        <div className="mb-6">
          <DatabaseStatus />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Database Error:</strong> {error}
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
              Make sure your Supabase table exists and environment variables are set correctly.
            </p>
          </div>
        )}

        <div className="mb-8">
          <TaskForm />
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold">All Tasks</h2>
          </div>
          <div className="p-6">
            <TaskTable tasks={tasks} />
          </div>
        </div>
      </main>
    </div>
  );
}
