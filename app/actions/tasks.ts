'use server';

import { getSupabase } from '@/lib/supabase';
import { Task } from '@/types/task';
import { revalidatePath } from 'next/cache';

export async function getTasks(): Promise<Task[]> {
  try {
    const supabase = getSupabase();
    const result = await supabase
      .from('tasks')
      .select('*')
      .order('createdAt', { ascending: false });

    // Log the full result to debug
    console.log('Supabase query result:', {
      hasData: !!result.data,
      dataLength: result.data?.length,
      hasError: !!result.error,
      error: result.error ? {
        message: result.error.message,
        details: result.error.details,
        hint: result.error.hint,
        code: result.error.code,
        fullError: JSON.stringify(result.error, null, 2),
      } : null,
    });

    if (result.error) {
      console.error('Supabase error fetching tasks:', result.error);
      // Return empty array instead of throwing to prevent page crash
      // This allows the page to load even if table doesn't exist yet
      return [];
    }

    return result.data || [];
  } catch (err) {
    console.error('Error in getTasks (catch block):', err);
    console.error('Error type:', typeof err);
    console.error('Error stringified:', JSON.stringify(err, null, 2));
    // Return empty array on any error (e.g., missing env vars, table doesn't exist)
    return [];
  }
}

export async function getTaskById(id: string): Promise<Task | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching task:', error);
    return null;
  }

  return data;
}

export async function createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: task.title,
        createdBranch: task.createdBranch,
        taskBranch: task.taskBranch,
        prLink: task.prLink,
        serverType: task.serverType,
        serverName: task.serverName,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw new Error(`Failed to create task: ${error.message}`);
    }

    revalidatePath('/');
    return data;
  } catch (err) {
    console.error('Error in createTask:', err);
    throw err instanceof Error ? err : new Error('Failed to create task');
  }
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  }

  revalidatePath('/');
  revalidatePath(`/task/${id}`);
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  }

  revalidatePath('/');
}
