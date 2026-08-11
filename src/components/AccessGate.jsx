import { useState } from 'react'
import Icon from '../lib/icons'
import Flourish from './Flourish'
import Petals from './Petals'

const MAX_ATTEMPTS = 5
const COOLDOWN_MS = 60000

/**
 * Layar kunci moodboard — client harus memasukkan kode akses (PIN)
 * sebelum melihat/mengisi. Kode dikirim WO lewat pesan WhatsApp.
 */
export default function AccessGate({ project, onUnlock }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)

  const tryUnlock = () => {
    const now = Date.now()
    let stored
    try {
      stored = JSON.parse(localStorage.getItem(`mw_pin_try_${project.token}`) || '{"count":0,"until":0}')
    } catch {
      stored = { count: 0, until: 0 }
    }
    if (stored.until > now) {
      setError(`Terlalu banyak percobaan. Coba lagi dalam ${Math.ceil((stored.until - now) / 1000)} detik.`)
      return
    }
    if (pin.trim() === String(project.pin)) {
      try {
        localStorage.removeItem(`mw_pin_try_${project.token}`)
      } catch {}
      onUnlock()
    } else {
      const count = stored.count + 1
      const locked = count >= MAX_ATTEMPTS
      const next = locked ? { count: 0, until: now + COOLDOWN_MS } : { count, until: 0 }
      try {
        localStorage.setItem(`mw_pin_try_${project.token}`, JSON.stringify(next))
      } catch {}
      setAttempts(count)
      setError(
        locked
          ? 'Terlalu banyak percobaan — tunggu 1 menit ya.'
          : `Kode salah. Sisa percobaan: ${MAX_ATTEMPTS - count}.`,
      )
      setPin('')
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-wedding-pattern bg-ivory px-4 py-10">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-goldlight/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blush/20 blur-3xl" />
      <Petals count={10} />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-[2rem] border border-gold/25 bg-white/90 px-6 py-10 text-center shadow-soft backdrop-blur sm:px-10">
          <span
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: 'var(--accent-light, #D6BE93)', color: 'var(--accent-text, #7a5c30)' }}
          >
            <Icon name="lock" className="h-7 w-7" />
          </span>

          <h1 className="mt-4 font-display text-3xl text-ink">Moodboard Terkunci</h1>
          <p className="mt-1 font-script text-2xl text-gold">{project.couple || 'Wedding Moodboard'}</p>

          <div className="mt-4 flex justify-center">
            <Flourish />
          </div>

          <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-stone">
            Untuk menjaga privasi kalian, moodboard ini dilindungi kode akses. Kode dikirim bersama link lewat
            pesan WhatsApp dari Mentari Wedding.
          </p>

          <div className="mt-6">
            <input
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))
                setError('')
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') tryUnlock() }}
              inputMode="numeric"
              autoFocus
              placeholder="••••••"
              className="w-48 rounded-2xl border border-ink/15 bg-white px-4 py-3 text-center text-2xl font-semibold tracking-[0.45em] text-ink placeholder:text-stone/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
            />
            {error && (
              <p className="mt-2 text-xs font-medium text-rose">{error}</p>
            )}
          </div>

          <button
            onClick={tryUnlock}
            disabled={pin.length === 0}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium text-white shadow-soft transition hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
            style={{ background: 'var(--accent, #B08D57)' }}
          >
            <Icon name="lock" className="h-4 w-4" /> Buka Moodboard
          </button>

          <p className="mt-4 inline-flex items-center justify-center gap-1.5 text-xs text-stone/70">
            Lupa kode? Hubungi Wedding Organizer kalian.
            <Icon name="heart" className="h-3 w-3 text-gold" />
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-stone/70">
          Kode hanya diminta sekali di perangkat ini.
        </p>
      </div>
    </div>
  )
}
