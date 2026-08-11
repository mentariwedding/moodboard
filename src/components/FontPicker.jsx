import { FONT_STYLES } from '../lib/constants'

/**
 * Pilihan gaya font undangan — client melihat contoh langsung
 * nama mereka dalam tiap font, lalu memilih.
 */
export default function FontPicker({ value, onChange, coupleName }) {
  const sample = coupleName || 'Salsabila & Raka'
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {FONT_STYLES.map((f) => {
        const active = value === f.id
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onChange(f.id)}
            className={`rounded-2xl border-2 p-4 text-left transition-all ${
              active ? 'border-gold bg-goldlight/15 shadow-soft' : 'border-ink/10 bg-white hover:border-gold/50'
            }`}
          >
            <p className="text-xs uppercase tracking-wider text-stone">{f.label}</p>
            <p className="mt-1.5 truncate font-display text-xl text-ink" style={{ fontFamily: f.font }}>
              {sample}
            </p>
            <p className="mt-1 text-[11px] text-stone">{f.desc}</p>
            {active && <p className="mt-1.5 text-[11px] font-semibold text-gold">✓ Dipilih</p>}
          </button>
        )
      })}
    </div>
  )
}
