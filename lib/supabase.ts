import { createClient, SupabaseClient } from '@supabase/supabase-js';

// This client is for server-side use only (API routes, server actions)
// Never expose service role key to client

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    const missingVars = [];
    if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!supabaseServiceKey) missingVars.push('SUPABASE_SERVICE_ROLE_KEY');
    
    throw new Error(
      `Missing Supabase environment variables: ${missingVars.join(', ')}. Please set them in your .env.local file`
    );
  }

  // Validate URL format
  try {
    new URL(supabaseUrl);
  } catch (e) {
    throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`);
  }

  supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseClient;
}

// Export a getter function instead of calling it at module load
// This prevents build-time errors when env vars aren't set
export function getSupabase() {
  return getSupabaseClient();
}

// For backward compatibility, export supabase as a lazy getter
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const value = client[prop as keyof SupabaseClient];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});
