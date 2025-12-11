'use client';

import { useEffect, useState } from 'react';

export default function DatabaseStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState<string>('');

  useEffect(() => {
    async function checkDatabase() {
      try {
        // First check connection diagnostics
        const diagResponse = await fetch('/api/test-connection');
        const diagnostics = await diagResponse.json();
        
        // Then check health
        const response = await fetch('/api/health');
        const data = await response.json();
        
        if (response.ok && data.tableExists) {
          setStatus('connected');
          setMessage('Database connected and table exists ✓');
        } else if (response.ok && !data.tableExists) {
          setStatus('error');
          setMessage('Database connected but table does not exist.');
          setDetails('Run the SQL migration in Supabase SQL Editor.');
        } else {
          setStatus('error');
          setMessage('Database connection failed.');
          
          // Show diagnostic details
          const diagDetails = [];
          if (!diagnostics.envVars?.hasUrl) {
            diagDetails.push('Missing NEXT_PUBLIC_SUPABASE_URL');
          }
          if (!diagnostics.envVars?.hasServiceKey) {
            diagDetails.push('Missing SUPABASE_SERVICE_ROLE_KEY');
          }
          if (diagnostics.connection?.error) {
            diagDetails.push(diagnostics.connection.error.message || 'Connection error');
          }
          setDetails(diagDetails.join('. ') || 'Check your environment variables in .env.local');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Unable to check database status.');
        setDetails(err instanceof Error ? err.message : 'Unknown error');
      }
    }

    checkDatabase();
  }, []);

  if (status === 'checking') {
    return (
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">Checking database connection...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-2">⚠️ Database Connection Issue</p>
        <p className="text-xs text-red-700 dark:text-red-300 mb-2">{message}</p>
        {details && (
          <p className="text-xs text-red-600 dark:text-red-400 mb-3 font-mono bg-red-100 dark:bg-red-900/40 p-2 rounded">
            {details}
          </p>
        )}
        <div className="text-xs text-red-700 dark:text-red-300 space-y-1">
          <p><strong>Checklist:</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Verify <code className="bg-red-100 dark:bg-red-900/40 px-1 rounded">.env.local</code> exists in project root</li>
            <li>Check <code className="bg-red-100 dark:bg-red-900/40 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> is set</li>
            <li>Check <code className="bg-red-100 dark:bg-red-900/40 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> is set (use service_role key, not anon key)</li>
            <li>Restart dev server after adding env vars: <code className="bg-red-100 dark:bg-red-900/40 px-1 rounded">npm run dev</code></li>
            <li>If table missing: Run SQL from <code className="bg-red-100 dark:bg-red-900/40 px-1 rounded">CREATE_TABLE.sql</code> in Supabase SQL Editor</li>
          </ol>
        </div>
        <details className="mt-3">
          <summary className="text-xs text-red-600 dark:text-red-400 cursor-pointer">View diagnostic details</summary>
          <pre className="text-xs mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded overflow-auto max-h-40">
            {JSON.stringify({ message, details }, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
      <p className="text-sm text-green-800 dark:text-green-200">{message}</p>
    </div>
  );
}
