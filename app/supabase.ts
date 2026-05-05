import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// createBrowserClient stores session AND code verifier in cookies (with chunking for large values)
// This is required so both survive the OAuth redirect through Google
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

export const supabase = getSupabase()
