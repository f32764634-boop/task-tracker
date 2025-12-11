import { NextResponse } from 'next/server';

export async function GET() {
  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
  };

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  diagnostics.envVars = {
    hasUrl: !!supabaseUrl,
    hasServiceKey: !!supabaseServiceKey,
    urlLength: supabaseUrl?.length || 0,
    keyLength: supabaseServiceKey?.length || 0,
    urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'missing',
    keyPreview: supabaseServiceKey ? `${supabaseServiceKey.substring(0, 10)}...` : 'missing',
  };

  // Validate URL format
  if (supabaseUrl) {
    try {
      const url = new URL(supabaseUrl);
      diagnostics.urlValidation = {
        valid: true,
        protocol: url.protocol,
        hostname: url.hostname,
      };
    } catch (e) {
      diagnostics.urlValidation = {
        valid: false,
        error: e instanceof Error ? e.message : 'Invalid URL',
      };
    }
  }

  // Try to create Supabase client
  try {
    const { getSupabase } = await import('@/lib/supabase');
    const supabase = getSupabase();
    
    // Try a simple query
    const { data, error } = await supabase
      .from('tasks')
      .select('id')
      .limit(1);

    diagnostics.connection = {
      success: true,
      hasError: !!error,
      error: error ? {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      } : null,
      hasData: !!data,
    };
  } catch (err) {
    diagnostics.connection = {
      success: false,
      error: err instanceof Error ? {
        message: err.message,
        stack: err.stack,
      } : String(err),
    };
  }

  return NextResponse.json(diagnostics, {
    status: diagnostics.connection?.success ? 200 : 500,
  });
}
