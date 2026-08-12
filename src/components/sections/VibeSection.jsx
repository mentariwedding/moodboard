import { THEMES, VIBES } from '../../lib/constants'
import Icon from '../../lib/icons'

// Palet & elemen khas per tema — untuk preview "hidup" saat dipilih
const THEME_LIVE = {
  garden: { colors: ['#8A9B83', '#F4DADB', '#B08D57'], tags: ['Floral arch', 'String light', 'Greenery'] },
  rustic: { colors: ['#6B4F3A', '#C9BDA4', '#B08D57'], tags: ['Wood', 'Burlap', 'Mason jar'] },
  minimalist: { colors: ['#2B2622', '#E8E4DE', '#B08D57'], tags: ['Clean lines', 'Negative space', 'White'] },
  classic: { colors: ['#B08D57', '#2B2622', '#FFFFFF'], tags: ['Chandelier', 'Tall centerpiece', 'Ballroom'] },
  vintage: { colors: ['#E8B4B8', '#C9BDA4', '#7A6C5D'], tags: ['Lace', 'Antique', 'Pastel'] },
  bohemian: { colors: ['#C97B5D', '#6B4F3A', '#E8C39E'], tags: ['Macrame', 'Pampas', 'Rug'] },
  tropical: { colors: ['#3F5242', '#F2A65A', '#5B7B8A'], tags: ['Monstera', 'Palm', 'Rattan'] },
  royal: { colors: ['#8C1F28', '#B08D57', '#2B2622'], tags: ['Gold', 'Velvet', 'Crystal'] },
  modernmuslim: { colors: ['#B08D57', '#F7F2E9', '#2B2622'], tags: ['Geometric', 'Modest', 'Elegant'] },
  javanese: { colors: ['#6B4F3A', '#B08D57', '#C9BDA4'], tags: ['Batik', 'Pelaminan', 'Teak'] },
}
import { Field, TextArea } from '../ui'
import { ChipGroup, Note } from './common'

export default function VibeSection({ data, update }) {
  const toggleTheme = (id) => {
    const cur = data.themes || []
    if (cur.includes(id)) {
      update({ themes: cur.filter((t) => t !== id) })
    } else if (cur.length < 3) {
      update({ themes: [...cur, id] })
    }
  }

  return (
    <div className="space-y-7">
      <div>
        <p className="mb-3 text-sm font-medium text-ink">Pilih tema yang paling mendekati keinginan kalian (maks. 3)</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {THEMES.map((t) => {
            const active = (data.themes || []).includes(t.id)
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleTheme(t.id)}
                className={`group relative overflow-hidden rounded-2xl border-2 text-left transition-all ${
                  active ? 'border-gold shadow-soft scale-[1.01]' : 'border-transparent hover:border-gold/40'
                }`}
              >
                <img src={t.img} alt={t.label} className="h-28 w-full object-cover sm:h-32" loading="lazy" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8">
                  <p className="text-sm font-medium text-white">{t.label}</p>
                  <p className="text-[11px] text-white/80">{t.sub}</p>
                </div>
                {active && (
                  <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-white shadow">
                    <Icon name="check" className="h-3 w-3" />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Preview tema hidup — muncul saat ada tema dipilih */}
      {(data.themes || []).length > 0 && (
        <div className="space-y-3">
          {(data.themes || []).map((tid) => {
            const live = THEME_LIVE[tid]
            const t = THEMES.find((x) => x.id === tid)
            if (!live || !t) return null
            return (
              <div key={tid} className="rounded-2xl border border-gold/25 bg-white/85 p-4 shadow-card">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-ink">
                    <Icon name="wand" className="mr-1.5 inline h-3.5 w-3.5 text-gold" />
                    {t.label} — sekilas konsep
                  </p>
                </div>
                <div className="mt-2.5 flex items-center gap-1.5">
                  {live.colors.map((c) => (
                    <span key={c} className="h-6 w-6 rounded-full border border-ink/10" style={{ background: c }} title={c} />
                  ))}
                  <span className="ml-2 flex flex-wrap gap-1.5">
                    {live.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-cream px-2.5 py-0.5 text-[10px] text-stone">{tag}</span>
                    ))}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div>
        <Field label="Suasana yang diinginkan — pilih beberapa" hint="Mood & atmosphere you want on the day">
          <ChipGroup allowMultiple options={VIBES} value={data.vibes || []} onChange={(vibes) => update({ vibes })} />
        </Field>
      </div>

      <div>
        <Field label="Tuliskan 3 kata kunci konsep" hint="3 words that describe your dream wedding (cth: intimate, golden, joyful)">
          <TextArea rows={2} value={data.keywords || ''} onChange={(e) => update({ keywords: e.target.value })} placeholder="cth: hangat, elegan, penuh tawa" />
        </Field>
      </div>

      <Note><Icon name="lightbulb" className="mr-1.5 inline h-3.5 w-3.5" /><b>Tips:</b> kalau masih ragu antara dua tema, pilih dua-duanya — nanti WO yang bantu menyatukan.</Note>
    </div>
  )
}
