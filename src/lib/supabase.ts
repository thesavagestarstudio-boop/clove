/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  supabaseAnonKey !== 'placeholder'
)

// Ensure URL is valid to prevent synchronous crashes during app load
const validUrl = supabaseUrl?.startsWith('http') ? supabaseUrl : 'https://placeholder.supabase.co'
const validAnonKey = supabaseAnonKey || 'placeholder'

export const supabase = createClient(validUrl, validAnonKey)
