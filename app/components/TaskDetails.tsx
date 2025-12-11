'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import { updateTask, deleteTask } from '../actions/tasks';
import { SERVER_NAMES, ServerType } from '@/types/task';
import { useRouter } from 'next/navigation';

interface TaskDetailsProps {
  task: Task;
}

export default function TaskDetails({ task: initialTask }: TaskDetailsProps) {
  const router = useRouter();
  const [task, setTask] = useState(initialTask);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [note, setNote] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await updateTask(task.id, task);
      setTask(updated);
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      router.push('/');
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-start">
        <div>
          {isEditing ? (
            <input
              type="text"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="text-2xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none w-full"
            />
          ) : (
            <h1 className="text-2xl font-bold">{task.title}</h1>
          )}
          <p className="text-sm text-zinc-500 mt-1">
            Created {formatDate(task.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setTask(initialTask);
                }}
                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Task Branch</label>
            {isEditing ? (
              <input
                type="text"
                value={task.taskBranch}
                onChange={(e) => setTask({ ...task, taskBranch: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 font-mono"
              />
            ) : (
              <p className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded">
                {task.taskBranch}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Created From</label>
            {isEditing ? (
              <input
                type="text"
                value={task.createdBranch}
                onChange={(e) => setTask({ ...task, createdBranch: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 font-mono"
              />
            ) : (
              <p className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded">
                {task.createdBranch}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">PR Link</label>
            {isEditing ? (
              <input
                type="url"
                value={task.prLink}
                onChange={(e) => setTask({ ...task, prLink: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
              />
            ) : (
              <div>
                {task.prLink ? (
                  <a
                    href={task.prLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {task.prLink}
                  </a>
                ) : (
                  <span className="text-zinc-400">No PR link</span>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Server</label>
            {isEditing ? (
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={task.serverType}
                  onChange={(e) => setTask({ ...task, serverType: e.target.value as ServerType })}
                  className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
                >
                  <option value="backend">Backend</option>
                  <option value="frontend">Frontend</option>
                </select>
                <select
                  value={task.serverName}
                  onChange={(e) => setTask({ ...task, serverName: e.target.value as typeof SERVER_NAMES[number] })}
                  className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
                >
                  {SERVER_NAMES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-sm">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-800">
                  {task.serverType}/{task.serverName}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
          <h3 className="text-lg font-semibold mb-4">Notes</h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note..."
                className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && note.trim()) {
                    // TODO: Implement note saving
                    setNote('');
                  }
                }}
              />
              <button
                onClick={() => {
                  if (note.trim()) {
                    // TODO: Implement note saving
                    setNote('');
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Note
              </button>
            </div>
            <div className="text-sm text-zinc-500">
              Note history will be displayed here (coming soon)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
