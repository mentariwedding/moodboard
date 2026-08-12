import { SECTIONS, THEMES, PRIORITY_ITEMS } from '../lib/constants'
import { formatDate, linkType } from '../lib/utils'
import Icon from '../lib/icons'
import Monogram from './Monogram'

const PRIO_LABEL = (id) => PRIORITY_ITEMS.find((p) => p.id === id)?.label || id

function Value({ icon, label, value }) {
  if (!value) return null
  return (
    <p className="inline-flex items-start gap-2 text-sm leading-relaxed text-ink/90">
      <Icon name={icon} className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
      <span>
        <span className="font-medium text-ink">{label}: </span>
        {value}
      </span>
    </p>
  )
}

function SectionCard({ s, sec }) {
  const d = sec || {}
  const rows = []
  const add = (icon, label, val, max = 4) => {
    if (val == null) return
    if (Array.isArray(val)) {
      if (val.length) rows.push({ icon, label, value: val.slice(0, max).join(', ') + (val.length > max ? ' …' : '') })
    } else if (typeof val === 'string' && val.trim()) {
      rows.push({ icon, label, value: val.trim() })
    }
  }

  if (s.id === 'couple') {
    add('heart', 'Mempelai', [d.brideName, d.groomName].filter(Boolean).join(' & '))
    add('calendar', 'Tanggal', formatDate(d.weddingDate))
    add('location', 'Venue', d.venue)
    add('users', 'Kota', d.city)
    add('userGroup', 'Tamu', d.guests)
    add('wallet', 'Budget', d.budget)
  } else if (s.id === 'vibe') {
    const themes = (d.themes || []).map((t) => THEMES.find((x) => x.id === t)?.label || t)
    add('colors', 'Tema', themes)
    add('magic', 'Suasana', d.vibes)
    add('feather', 'Kata kunci', d.keywords)
  } else if (s.id === 'colors') {
    add('colors', 'Palet', d.paletteName)
  } else if (s.id === 'decor') {
    add('archway', 'Pelaminan', d.stage)
    add('sprout', 'Bunga', d.flowersSource)
    add('gift', 'Bunga favorit', d.flowersLike)
    add('lightbulb', 'Lighting', d.lighting)
    add('chair', 'Meja', d.tables)
    add('signs', 'Signage', d.signage)
    add('feather', 'Catatan', d.notes)
  } else if (s.id === 'look') {
    add('look', 'Gaun', d.dress)
    add('magic', 'Aksen', d.dressAccent)
    add('brush', 'Rias', d.makeup)
    add('tie', 'Pria', d.groom)
    add('feather', 'Catatan', d.notes)
    if (d.outfitPhoto) rows.push({ icon: 'look', label: 'Foto gaun', value: 'ada (lihat lampiran)' })
  } else if (s.id === 'ceremony') {
    add('ceremony', 'Format', d.format)
    add('clock', 'Jam mulai', d.time)
    add('crown', 'Adat', d.traditions)
    add('guitar', 'Hiburan', d.entertainment)
    add('music', 'Musik', d.music)
    add('feather', 'Catatan', d.notes)
  } else if (s.id === 'playlist') {
    const songs = (d.songs || []).map((x) => `[${x.moment}] ${x.title || x.url}`)
    add('music', 'Playlist', songs, 6)
    add('avoid', 'Jangan diputar', d.doNotPlay)
    add('feather', 'Catatan', d.notes)
  } else if (s.id === 'feast') {
    add('feast', 'Penyajian', d.style)
    add('gift', 'Menu wajib', d.mustHave)
    add('avoid', 'Alergi', d.allergies)
    add('cake', 'Kue', d.cake)
    add('feather', 'Catatan', d.notes)
  } else if (s.id === 'stationery') {
    add('stationery', 'Jenis', d.type)
    add('colors', 'Gaya', d.style)
    add('signature', 'Font', d.fontStyle)
    add('signature', 'Monogram', d.monogram)
    add('feather', 'Catatan', d.notes)
  } else if (s.id === 'photo') {
    add('photo', 'Gaya', d.styles)
    add('cameraRetro', 'Momen wajib', d.mustShots)
    add('feather', 'Catatan', d.notes)
  } else if (s.id === 'priorities') {
    add('priorities', 'TOP 3', (d.top3 || []).map(PRIO_LABEL))
    const stars = PRIORITY_ITEMS.filter((p) => (d.ratings?.[p.id] || 3) >= 4).map((p) => `${p.label} ${d.ratings?.[p.id]}/5`)
    add('crown', 'Prioritas tinggi', stars)
    add('feather', 'Catatan', d.notes)
  } else if (s.id === 'avoid') {
    add('avoid', 'Tema dihindari', d.themes)
    add('colors', 'Warna dihindari', (d.colors || []).filter(Boolean))
    add('feather', 'Catatan', d.notes)
  }

  return (
    <div className="rounded-2xl border border-ink/5 bg-white p-4 shadow-card">
      <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-ink">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cream text-gold">
          <Icon name={s.icon} className="h-3.5 w-3.5" />
        </span>
        {s.en}
      </p>
      {rows.length ? (
        <div className="space-y-1">{rows.map((r, i) => <Value key={i} {...r} />)}</div>
      ) : (
        <p className="text-sm italic text-stone/60">Belum diisi.</p>
      )}
    </div>
  )
}

/**
 * Ringkasan final moodboard — tampilan read-only yang elegan untuk client
 * setelah submit (dan bisa dibuka kembali kapan saja).
 */
export default function FinalSummary({ data, project }) {
  const palette = data.colors?.palette || []
  const refs = data.references?.images || []
  const links = data.references?.links || []
  const concept = data.references?._concept || data.vibe?.keywords

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <Monogram data={data} size={84} />
        <h1 className="mt-3 font-script text-4xl text-ink sm:text-5xl">{project?.couple}</h1>
        <p className="mt-1 text-sm text-stone">
          {formatDate(data.couple?.weddingDate || project?.date)}
          {data.couple?.city ? ` · ${data.couple.city}` : ''}
        </p>
      </div>

      {/* Konsep */}
      {concept && (
        <div className="mt-6 rounded-3xl bg-white p-6 text-center shadow-soft">
          <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-gold">
            <Icon name="magic" className="h-3.5 w-3.5" /> Konsep Kami
          </p>
          <p className="mt-2 font-serif text-lg leading-relaxed text-ink">{concept}</p>
        </div>
      )}

      {/* Palet */}
      {palette.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-ink/5 bg-white px-5 py-4 shadow-card">
          <span className="text-sm font-medium text-ink">🎨 Palet{data.colors?.paletteName ? ` · ${data.colors.paletteName}` : ''}</span>
          <div className="flex gap-1.5">
            {palette.map((c) => (
              <span key={c} className="h-7 w-7 rounded-full border border-ink/10" style={{ background: c }} />
            ))}
          </div>
        </div>
      )}

      {/* Semua seksi */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {SECTIONS.filter((s) => s.id !== 'colors' && s.id !== 'references').map((s) => (
          <SectionCard key={s.id} s={s} sec={data[s.id]} />
        ))}
      </div>

      {/* Foto referensi */}
      {refs.length > 0 && (
        <div className="mt-4 rounded-2xl border border-ink/5 bg-white p-4 shadow-card">
          <p className="mb-2 text-sm font-semibold text-ink">🖼️ Foto Referensi ({refs.length})</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {refs.slice(0, 8).map((img, i) => (
              <img key={i} src={img.publicUrl || img.dataUrl} alt={`ref ${i + 1}`} className="aspect-square max-w-full rounded-xl object-cover" loading="lazy" />
            ))}
          </div>
        </div>
      )}

      {/* Link inspirasi */}
      {links.length > 0 && (
        <div className="mt-4 rounded-2xl border border-ink/5 bg-white p-4 shadow-card">
          <p className="mb-2 text-sm font-semibold text-ink">🔗 Link Inspirasi ({links.length})</p>
          <ul className="space-y-1">
            {links.map((l, i) => (
              <li key={i}>
                <a href={l} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 break-all text-sm text-gold underline-offset-2 hover:underline">
                  <Icon name={linkType(l)} className="h-3.5 w-3.5" /> {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-stone/70">
        Dibuat dengan <Icon name="brand" className="h-3.5 w-3.5 text-gold" /> Mentari Wedding — The Wedding Moodboard
      </p>
    </div>
  )
}
