'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import Link from 'next/link';
import { deleteTask } from '../actions/tasks';
import { useRouter } from 'next/navigation';
import Toast from './Toast';

interface TaskTableProps {
  tasks: Task[];
}

export default function TaskTable({ tasks }: TaskTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setIsDeleting(id);
    try {
      await deleteTask(id);
      router.refresh();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
      setIsDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter((task) => {
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      task.taskBranch.toLowerCase().includes(query) ||
      task.createdBranch.toLowerCase().includes(query) ||
      task.serverType.toLowerCase().includes(query) ||
      task.serverName.toLowerCase().includes(query) ||
      (task.prLink && task.prLink.toLowerCase().includes(query))
    );
  });

  return (
    <div>
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Toast Notification */}
      <Toast
        message="Copied!"
        show={showToast}
        onClose={() => setShowToast(false)}
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="text-left py-3 px-4 font-semibold text-sm">Title</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Branch</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Created From</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">PR Link</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Server</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Created At</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-zinc-500">
                  {searchQuery ? 'No tasks found matching your search.' : 'No tasks yet. Create your first task above.'}
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-zinc-100 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                >
                  <td className="py-3 px-4">
                    <Link
                      href={`/task/${task.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      {task.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 font-mono text-sm">{task.taskBranch}</td>
                  <td className="py-3 px-4 font-mono text-sm text-zinc-600 dark:text-zinc-400">
                    {task.createdBranch}
                  </td>
                  <td className="py-3 px-4">
                    {task.prLink ? (
                      <a
                        href={task.prLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Open PR
                      </a>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-800">
                      {task.serverType}/{task.serverName}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {formatDate(task.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(task.taskBranch)}
                        className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                        title="Copy Branch"
                      >
                        Copy Branch
                      </button>
                      {task.prLink && (
                        <a
                          href={task.prLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                        >
                          Open PR
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(task.id)}
                        disabled={isDeleting === task.id}
                        className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 rounded hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-300 disabled:opacity-50 cursor-pointer"
                        title="Delete Task"
                      >
                        {isDeleting === task.id ? 'Deleting...' : '🗑️'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
