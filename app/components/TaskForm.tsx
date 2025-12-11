'use client';

import { useState } from 'react';
import { createTask } from '../actions/tasks';
import { SERVER_NAMES, ServerType } from '@/types/task';
import { useRouter } from 'next/navigation';

interface TaskFormProps {
  onSuccess?: () => void;
}

export default function TaskForm({ onSuccess }: TaskFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    createdBranch: '',
    taskBranch: '',
    prLink: '',
    serverType: 'backend' as ServerType,
    serverName: 'dev' as typeof SERVER_NAMES[number],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createTask(formData);
      setFormData({
        title: '',
        createdBranch: '',
        taskBranch: '',
        prLink: '',
        serverType: 'backend',
        serverName: 'dev',
      });
      onSuccess?.();
      router.refresh();
    } catch (error) {
      console.error('Error creating task:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
      
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-1">
            Error creating task
          </p>
          <p className="text-xs text-red-700 dark:text-red-300">
            {error.includes('table') || error.includes('schema') ? (
              <>
                The database table doesn't exist yet. Please run the SQL migration in your Supabase dashboard.
                <br />
                <code className="mt-1 block text-xs bg-red-100 dark:bg-red-900/40 p-2 rounded">
                  Check supabase-migration.sql file
                </code>
              </>
            ) : (
              error
            )}
          </p>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Created Branch</label>
        <input
          type="text"
          required
          value={formData.createdBranch}
          onChange={(e) => setFormData({ ...formData, createdBranch: e.target.value })}
          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Task Branch</label>
        <input
          type="text"
          required
          value={formData.taskBranch}
          onChange={(e) => setFormData({ ...formData, taskBranch: e.target.value })}
          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">PR Link</label>
        <input
          type="url"
          value={formData.prLink}
          onChange={(e) => setFormData({ ...formData, prLink: e.target.value })}
          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Server Type</label>
          <select
            value={formData.serverType}
            onChange={(e) => setFormData({ ...formData, serverType: e.target.value as ServerType })}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
          >
            <option value="backend">Backend</option>
            <option value="frontend">Frontend</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Server Name</label>
          <select
            value={formData.serverName}
            onChange={(e) => setFormData({ ...formData, serverName: e.target.value as typeof SERVER_NAMES[number] })}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
          >
            {SERVER_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}
