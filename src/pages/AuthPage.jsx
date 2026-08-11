import { useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Btn, Field, TextInput, Spinner } from '../components/ui'

const SIGNUP_CODE = import.meta.env.VITE_WO_SIGNUP_CODE || ''

export default function AuthPage({ onAuthed }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        if (data.session) onAuthed(data.session)
      } else {
        if (SIGNUP_CODE && code.trim() !== SIGNUP_CODE) throw new Error('Kode undangan salah.')
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        if (data.session) onAuthed(data.session)
        else setError('Akun dibuat! Cek email kamu untuk konfirmasi, lalu login.')
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan')
    } finally {
      setBusy(false)
    }
  }

  if (!isSupabaseConfigured) return null

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <div className="w-full max-w-sm rounded-3xl border border-ink/5 bg-white p-8 shadow-soft">
        <p className="text-center text-xs uppercase tracking-[0.35em] text-gold">Mentari Wedding</p>
        <h1 className="mt-2 text-center font-display text-3xl text-ink">Dashboard Moodboard</h1>
        <p className="mt-1 text-center text-sm text-stone">Masuk untuk melihat isian client.</p>

        <div className="mt-5 flex rounded-full bg-cream p-1 text-sm">
          {['login', 'signup'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError('') }}
              className={`flex-1 rounded-full py-2 transition ${mode === m ? 'bg-white text-ink shadow-sm' : 'text-stone'}`}
            >
              {m === 'login' ? 'Masuk' : 'Daftar'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <Field label="Email">
            <TextInput type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="wo@mentariwedding.com" />
          </Field>
          <Field label="Password">
            <TextInput type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </Field>
          {mode === 'signup' && SIGNUP_CODE && (
            <Field label="Kode undangan" hint="Minta kode ke pemilik aplikasi">
              <TextInput value={code} onChange={(e) => setCode(e.target.value)} placeholder="kode rahasia" />
            </Field>
          )}
          {error && <p className="rounded-xl bg-rose/10 px-4 py-2.5 text-xs text-rose">{error}</p>}
          <Btn kind="gold" type="submit" disabled={busy} className="w-full">
            {busy ? <Spinner /> : mode === 'login' ? 'Masuk →' : 'Buat akun'}
          </Btn>
        </form>

        <p className="mt-5 text-center text-xs text-stone/70">
          {mode === 'login' && SIGNUP_CODE && (
            <button type="button" className="hover:text-gold" onClick={() => setMode('signup')}>
              Belum punya akun? Daftar di sini
            </button>
          )}
        </p>

        <div className="mt-5 rounded-2xl border border-ink/10 bg-cream/50 px-4 py-3 text-[11px] leading-relaxed text-stone">
          <p>
            <b className="text-ink">Belum punya akun?</b> Minta dibuatkan ke pemilik aplikasi (di Dashboard Supabase → Authentication → Users), atau atur{' '}
            <code className="rounded bg-white px-1">VITE_WO_SIGNUP_CODE</code> di <code className="rounded bg-white px-1">.env</code> untuk daftar mandiri.
          </p>
          <p className="mt-1.5">
            Ingin mencoba tanpa database? Kosongkan kunci Supabase di <code className="rounded bg-white px-1">.env</code> → aplikasi otomatis masuk <b>Mode Demo</b>.
          </p>
        </div>
      </div>
    </div>
  )
}
