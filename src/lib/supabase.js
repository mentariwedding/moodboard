import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && key)

// Prefix tabel & bucket — supaya bisa berbagi satu proyek Supabase
// dengan aplikasi lain tanpa bentrok. Ubah lewat VITE_DB_PREFIX di .env
// (harus sama dengan yang dipakai saat menjalankan supabase/schema.sql).
export const DB_PREFIX = import.meta.env.VITE_DB_PREFIX || 'mw_'
export const TABLE = (name) => `${DB_PREFIX}${name}`
export const BUCKET = `${DB_PREFIX}references`

export const supabase = isSupabaseConfigured
  ? createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null

/** Client dengan header token proyek — dipakai untuk upload foto oleh client. */
export function clientSupabaseWithToken(token) {
  if (!supabase) return null
  return createClient(url, key, {
    auth: { persistSession: false },
    global: { headers: { 'x-project-token': token } },
  })
}
