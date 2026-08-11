import { useState } from 'react'
import Icon from '../lib/icons'
import { timeAgo } from '../lib/utils'

/**
 * Komentar per seksi — percakapan WO ↔ client di dalam aplikasi.
 * author: 'wo' (Mentari Wedding) atau 'client'.
 */
export default function CommentsBlock({ comments = [], author, onAdd, placeholder }) {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    const t = text.trim()
    if (!t || busy) return
    setBusy(true)
    try {
      await onAdd(t)
      setText('')
    } catch (e) {
      alert('Gagal mengirim komentar: ' + e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-5 rounded-2xl border border-ink/5 bg-white/80 p-4">
      <p className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone">
        <Icon name="comment" className="h-3.5 w-3.5 text-gold" /> Komentar ({comments.length})
      </p>

      {comments.length === 0 && (
        <p className="mb-3 text-xs italic text-stone/70">Belum ada komentar — tanya atau sampaikan sesuatu di sini.</p>
      )}

      <div className="space-y-2.5">
        {comments.map((c) => {
          const mine = c.author === author
          return (
            <div key={c.id} className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : ''}`}>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                  c.author === 'wo' ? 'bg-gold text-white' : 'bg-cream text-stone'
                }`}
              >
                {c.author === 'wo' ? 'WO' : 'CL'}
              </span>
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${
                  mine ? 'bg-ink text-ivory' : 'bg-cream text-ink'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{c.text}</p>
                <p className={`mt-0.5 text-[10px] ${mine ? 'text-ivory/60' : 'text-stone'}`}>
                  {c.author === 'wo' ? 'Mentari Wedding' : 'Client'} · {timeAgo(c.at)}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
          placeholder={placeholder || 'Tulis komentar…'}
          className="min-w-0 flex-1 rounded-full border border-ink/15 bg-white px-4 py-2 text-[13px] text-ink placeholder:text-stone/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
        />
        <button
          onClick={submit}
          disabled={!text.trim() || busy}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-ivory transition hover:bg-gold disabled:opacity-40"
          title="Kirim"
        >
          <Icon name="send" className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
