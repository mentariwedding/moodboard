import { useState } from 'react'
import { COLOR_PRESETS } from '../../lib/constants'
import { Field, TextInput } from '../ui'
import { Note } from './common'
import Icon from '../../lib/icons'

const CUSTOM_SWATCHES = [
  '#E8B4B8', '#D96C6C', '#C97064', '#F2A65A', '#E8C07D', '#B08D57', '#8A9B83',
  '#7D9AA8', '#5B7B8A', '#7A6C5D', '#6B4F3A', '#3F5242', '#8C1F28', '#2B2622',
]

export default function ColorsSection({ data, update }) {
  const [tab, setTab] = useState(data.paletteName ? 'custom' : 'preset')
  const palette = data.palette || ['#C98A8A', '#B08D57', '#F4DADB', '#FFFFFF']

  const applyPreset = (p) => {
    update({ paletteName: p.name, palette: [...p.colors] })
    setTab('custom')
  }

  const toggleCustom = (c) => {
    let next
    if (palette.includes(c)) next = palette.filter((x) => x !== c)
    else if (palette.length < 4) next = [...palette, c]
    else next = [...palette.slice(1), c]
    update({ palette: next, paletteName: 'Custom' })
  }

  const setAvoid = (i, v) => {
    const avoid = [...(data.avoid || ['', ''])]
    avoid[i] = v
    update({ avoid })
  }

  return (
    <div className="space-y-7">
      <div>
        <p className="mb-3 text-sm font-medium text-ink">1. Pilih kombinasi warna yang paling disukai</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COLOR_PRESETS.map((p) => {
            const active = data.paletteName === p.name
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p)}
                className={`rounded-2xl border-2 bg-white p-3 text-left transition-all ${
                  active ? 'border-gold shadow-soft' : 'border-ink/10 hover:border-gold/50'
                }`}
              >
                <div className="flex h-10 overflow-hidden rounded-lg">
                  {p.colors.map((c) => (
                    <span key={c} className="flex-1" style={{ background: c }} />
                  ))}
                </div>
                <p className="mt-2 text-[13px] font-medium text-ink">{p.name}</p>
                {active && (
                  <p className="inline-flex items-center gap-1 text-[11px] text-gold">
                    <Icon name="check" className="h-2.5 w-2.5" /> dipilih
                  </p>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink">2. Atau susun palet sendiri (maks. 4 warna)</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {palette.map((c) => (
            <span
              key={c}
              title={c}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 text-[9px] text-white shadow-sm"
              style={{ background: c }}
            />
          ))}
          {palette.length === 0 && <span className="text-xs text-stone">Belum ada warna — klik swatch di bawah</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          {CUSTOM_SWATCHES.map((c) => {
            const active = palette.includes(c)
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleCustom(c)}
                style={{ background: c }}
                className={`h-9 w-9 rounded-full border-2 transition-all ${active ? 'scale-110 border-gold ring-2 ring-gold/30' : 'border-white/60 hover:scale-105'}`}
                title={c}
              />
            )
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Warna yang TIDAK disukai (1)" hint="Colors to avoid">
          <TextInput value={data.avoid?.[0] || ''} onChange={(e) => setAvoid(0, e.target.value)} placeholder="cth: pink terang" />
        </Field>
        <Field label="Warna yang TIDAK disukai (2)">
          <TextInput value={data.avoid?.[1] || ''} onChange={(e) => setAvoid(1, e.target.value)} placeholder="cth: hijau neon" />
        </Field>
      </div>

      <Note><Icon name="colors" className="mr-1.5 inline h-3.5 w-3.5" /><b>Catatan:</b> palet warna akan dipakai sebagai acuan seluruh dekorasi, undangan, dan styling foto. Boleh tetap fleksibel di hari-H.</Note>
    </div>
  )
}
