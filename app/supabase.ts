import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Este es el puente oficial que conecta GOVERNIA con tus tablas de Flutter
export const supabase = createClient(supabaseUrl, supabaseAnonKey)