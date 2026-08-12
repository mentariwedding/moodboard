import { useState } from 'react'
import { generateConcept } from '../lib/utils'
import Icon from '../lib/icons'

/**
 * Kartu "konsep otomatis" — ringkasan konsep dari semua jawaban,
 * bisa diedit oleh client (dipakai di step terakhir wizard + halaman sukses).
 */
export default function ConceptCard({ data, onSaveConcept, className = '' }) {
  const [text, setText] = useState(() => data?.references?._concept || generateConcept(data))
  const [saved, setSaved] = useState(false)

  const save = () => {
    onSaveConcept?.(text)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className={`rounded-2xl border-2 p-5 ${className}`} style={{ borderColor: 'var(--accent-light)', background: 'linear-gradient(135deg, var(--accent-light), transparent 60%)' }}>
      <p className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--accent)' }}>
        <Icon name="magic" className="h-4 w-4" /> Konsep otomatis untuk kalian
      </p>
      <p className="mb-3 mt-0.5 text-xs text-stone">
        Sistem merangkum semua jawaban kalian jadi satu konsep — silakan perbaiki kalimatnya supaya pas dengan imajinasi kalian.
      </p>
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setSaved(false) }}
        rows={5}
        className="w-full resize-none rounded-xl border border-ink/10 bg-white/80 px-4 py-3 text-sm leading-relaxed text-ink focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
          style={{ background: 'var(--accent)' }}
        >
          {saved && <Icon name="check" className="h-3 w-3" />}
          {saved ? 'Tersimpan' : 'Simpan konsep'}
        </button>
        <button
          type="button"
          onClick={() => { setText(generateConcept(data)); setSaved(false) }}
          className="inline-flex items-center gap-1 text-xs text-stone underline-offset-2 hover:text-[var(--accent)] hover:underline"
        >
          <Icon name="rotate" className="h-3 w-3" /> Acak ulang
        </button>
      </div>
    </div>
  )
}
