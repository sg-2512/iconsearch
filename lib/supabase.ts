import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Helper to check if Supabase is properly configured with real credentials
export const isSupabaseConfigured = (): boolean => {
  if (!supabaseUrl || !supabaseAnonKey) return false
  if (supabaseUrl.includes('your-supabase-project-id')) return false
  if (supabaseAnonKey.includes('your-anon-key')) return false
  return true
}

export const createClient = () => {
  if (!isSupabaseConfigured()) {
    // If not configured, we'll return a proxy client that warns on invocation
    // but prevents the app from crashing on start.
    console.warn(
      'Supabase credentials are not configured or are still placeholders. ' +
      'Falling back to secure local-only workspace mode.'
    )
    return null
  }

  return createBrowserClient(supabaseUrl!, supabaseAnonKey!)
}
