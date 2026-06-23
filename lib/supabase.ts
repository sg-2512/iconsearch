const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Helper to check if Supabase is properly configured with real credentials
export const isSupabaseConfigured = (): boolean => {
  if (!supabaseUrl || !supabaseAnonKey) return false
  if (supabaseUrl.includes('your-supabase-project-id')) return false
  if (supabaseAnonKey.includes('your-anon-key')) return false
  return true
}

// Lazy-loaded, failure-safe Supabase client creation.
// Uses dynamic import so the @supabase/ssr package is never pulled into
// the client bundle when Supabase is unreachable (e.g. paused project).
export const createClient = async () => {
  if (!isSupabaseConfigured()) {
    console.warn(
      'Supabase credentials are not configured or are still placeholders. ' +
      'Falling back to secure local-only workspace mode.'
    )
    return null
  }

  try {
    const { createBrowserClient } = await import('@supabase/ssr')
    return createBrowserClient(supabaseUrl!, supabaseAnonKey!)
  } catch (err) {
    console.warn('Failed to initialise Supabase client – falling back to local-only mode.', err)
    return null
  }
}
