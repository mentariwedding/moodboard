import { PRIORITY_ITEMS } from '../../lib/constants'
import { Field, TextArea } from '../ui'
import { Note } from './common'
import Icon from '../../lib/icons'

function Rating({ label, icon, value, onChange }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white p-4">
      <p className="mb-2.5 text-sm font-medium text-ink">{icon} {label}</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`h-9 flex-1 rounded-lg text-sm font-semibold transition-all ${
              value >= n
                ? n >= 4
                  ? 'bg-gold text-white'
                  : 'bg-goldlight/50 text-[#7a5c30]'
                : 'bg-cream/70 text-stone hover:bg-cream'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function PrioritiesSection({ data, update }) {
  const ratings = data.ratings || {}
  const top3 = data.top3 || []

  const toggleTop = (id) => {
    const next = top3.includes(id) ? top3.filter((x) => x !== id) : top3.length < 3 ? [...top3, id] : top3
    update({ top3: next })
  }

  return (
    <div className="space-y-7">
      <div>
        <p className="mb-3 text-sm font-medium text-ink">Pilih 3 hal PALING penting di hari pernikahan kalian</p>
        <p className="mb-3 text-xs text-stone -mt-2">Ini membantu WO mengalokasikan budget & perhatian dengan benar. Pilih maksimal 3.</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PRIORITY_ITEMS.map((p) => {
            const idx = top3.indexOf(p.id)
            const active = idx !== -1
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggleTop(p.id)}
                className={`relative rounded-2xl border-2 p-4 text-center transition-all ${
                  active ? 'border-gold bg-goldlight/20 shadow-soft' : 'border-ink/10 bg-white hover:border-gold/50'
                }`}
              >
                <span className="text-2xl">{p.icon}</span>
                <p className="mt-1.5 text-sm font-medium text-ink">{p.label}</p>
                {active && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-ink">Rating kepentingan (1 = santai, 5 = wajib maksimal)</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {PRIORITY_ITEMS.map((p) => (
            <Rating
              key={p.id}
              label={p.label}
              icon={p.icon}
              value={ratings[p.id] || 3}
              onChange={(n) => update({ ratings: { ...ratings, [p.id]: n } })}
            />
          ))}
        </div>
      </div>

      <Field label="Catatan prioritas" hint="Anything we should know about priorities">
        <TextArea rows={2} value={data.notes || ''} onChange={(e) => update({ notes: e.target.value })} placeholder="cth: foto itu nomor satu, makanan bisa disederhanakan…" />
      </Field>

      <Note><Icon name="priorities" className="mr-1.5 inline h-3.5 w-3.5" /><b>Kenapa ini penting?</b> Kalau budget mepet, WO tahu bagian mana yang tidak boleh dikorbankan dan mana yang bisa disesuaikan.</Note>
    </div>
  )
}
