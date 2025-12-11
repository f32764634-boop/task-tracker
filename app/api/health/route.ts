import { getSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = getSupabase();
    
    // Try to query the tasks table directly
    const { error, data } = await supabase
      .from('tasks')
      .select('id')
      .limit(1);

    if (error) {
      // Check if it's a "table doesn't exist" error
      const isTableMissing = 
        error.code === '42P01' || 
        error.message.includes('does not exist') || 
        error.message.includes('schema cache') ||
        error.message.includes('Could not find the table');

      if (isTableMissing) {
        return NextResponse.json({ 
          connected: true, 
          tableExists: false,
          error: error.message,
          code: error.code,
          hint: 'Run the SQL migration in Supabase SQL Editor to create the table'
        });
      }
      
      return NextResponse.json({ 
        connected: true, 
        tableExists: false,
        error: error.message,
        code: error.code
      });
    }

    return NextResponse.json({ 
      connected: true, 
      tableExists: true,
      rowCount: data?.length || 0
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    const errorStack = err instanceof Error ? err.stack : undefined;
    
    return NextResponse.json({ 
      connected: false, 
      tableExists: false,
      error: errorMessage,
      stack: errorStack
    }, { status: 500 });
  }
}
