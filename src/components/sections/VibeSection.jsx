import { THEMES, VIBES } from '../../lib/constants'
import { Field, TextArea } from '../ui'
import { ChipGroup, Note } from './common'
import Icon from '../../lib/icons'

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
