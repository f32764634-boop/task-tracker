import { getTaskById } from '@/app/actions/tasks';
import { notFound } from 'next/navigation';
import TaskDetails from '@/app/components/TaskDetails';

interface TaskPageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { id } = await params;
  const task = await getTaskById(id);

  if (!task) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <a
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            ← Back to Tasks
          </a>
        </div>
        <TaskDetails task={task} />
      </main>
    </div>
  );
}
