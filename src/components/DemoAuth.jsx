import { useState } from 'react'
import Icon from '../lib/icons'
import Flourish from './Flourish'
import Petals from './Petals'

const DEMO_PIN = import.meta.env.VITE_DEMO_PIN || '1234'
const STORAGE_KEY = 'mw_demo_auth'

export function demoAuthed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === DEMO_PIN
  } catch {
    return false
  }
}

export function lockDemo() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

/**
 * Kunci dashboard mode demo — tanpa Supabase, dashboard tidak boleh
 * terbuka bebas. PIN default '1234', bisa diubah via VITE_DEMO_PIN di .env.
 */
export default function DemoAuth({ onUnlock }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const tryUnlock = () => {
    if (pin.trim() === DEMO_PIN) {
      try {
        localStorage.setItem(STORAGE_KEY, DEMO_PIN)
      } catch {}
      onUnlock()
    } else {
      setError('Kode salah. Coba lagi.')
      setPin('')
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ivory px-4 py-10">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-goldlight/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blush/20 blur-3xl" />
      <Petals count={8} />

      <div className="relative z-10 w-full max-w-sm">
        <div className="rounded-[2rem] border border-gold/25 bg-white/90 px-6 py-10 text-center shadow-soft backdrop-blur">
          <span
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: 'var(--accent-light, #D6BE93)', color: 'var(--accent-text, #7a5c30)' }}
          >
            <Icon name="lock" className="h-7 w-7" />
          </span>

          <h1 className="mt-4 font-display text-3xl text-ink">Dashboard Terkunci</h1>
          <p className="mt-1 font-script text-2xl text-gold">Mentari Wedding</p>

          <div className="mt-4 flex justify-center">
            <Flourish />
          </div>

          <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-stone">
            Dashboard berisi data pribadi semua client — hanya untuk tim Mentari Wedding. Masukkan kode untuk membuka.
          </p>

          <div className="mt-5">
            <input
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))
                setError('')
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') tryUnlock() }}
              inputMode="numeric"
              autoFocus
              placeholder="••••"
              className="w-44 rounded-2xl border border-ink/15 bg-white px-4 py-3 text-center text-2xl font-semibold tracking-[0.45em] text-ink placeholder:text-stone/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
            />
            {error && <p className="mt-2 text-xs font-medium text-rose">{error}</p>}
          </div>

          <button
            onClick={tryUnlock}
            disabled={pin.length === 0}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium text-white shadow-soft transition hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
            style={{ background: 'var(--accent, #B08D57)' }}
          >
            <Icon name="lock" className="h-4 w-4" /> Buka Dashboard
          </button>

          {DEMO_PIN === '1234' && (
            <p className="mt-4 text-xs text-stone/70">
              Mode demo — kode bawaan: <b className="text-gold">1234</b> (ubah lewat <code className="rounded bg-cream px-1">VITE_DEMO_PIN</code> di .env)
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
