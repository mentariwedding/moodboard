import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { SECTIONS, THEMES, PRIORITY_ITEMS } from '../lib/constants'
import { computeProgress, formatDate, generateConcept } from '../lib/utils'
import Icon from '../lib/icons'

const PRIO_LABEL = (id) => PRIORITY_ITEMS.find((p) => p.id === id)?.label || id

function Row({ icon, label, value }) {
  if (!value) return null
  return (
    <p className="text-[11.5px] leading-snug text-ink/90">
      <span className="font-semibold text-ink">
        <Icon name={icon} className="mr-1 inline h-2.5 w-2.5" />
        {label}:{' '}
      </span>
      {value}
    </p>
  )
}

function SectionBlock({ s, sec }) {
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
    add('phone', 'WA', d.wa)
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
  } else if (s.id === 'ceremony') {
    add('ceremony', 'Format', d.format)
    add('clock', 'Jam mulai', d.time)
    add('crown', 'Adat', d.traditions)
    add('guitar', 'Hiburan', d.entertainment)
    add('music', 'Musik', d.music)
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
  } else if (s.id === 'playlist') {
    const songs = (d.songs || []).map((x) => `[${x.moment}] ${x.title || x.url}`)
    add('music', 'Playlist', songs, 6)
    add('avoid', 'Jangan diputar', d.doNotPlay)
    add('feather', 'Catatan', d.notes)
  } else if (s.id === 'avoid') {
    add('avoid', 'Tema dihindari', d.themes)
    add('colors', 'Warna dihindari', (d.colors || []).filter(Boolean))
    add('feather', 'Catatan', d.notes)
  } else if (s.id === 'references') {
    add('images', 'Foto referensi', `${(d.images || []).length} foto`)
    add('heart', 'Galeri disukai', `${(d.liked || []).length} gaya`)
    add('link', 'Link', (d.links || []).join('  ·  '))
  }

  return (
    <div className="break-inside-avoid rounded-xl border border-ink/10 p-3">
      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a6a3a]">
        {s.icon} {s.en}
      </p>
      {rows.length ? (
        <div className="space-y-0.5">{rows.map((r, i) => <Row key={i} {...r} />)}</div>
      ) : (
        <p className="text-[11px] italic text-ink/40">Belum diisi.</p>
      )}
    </div>
  )
}

/**
 * Ringkasan A4 multi-halaman — dicetak via dialog browser "Save as PDF".
 * Dirender lewat portal ke <body> supaya tidak ikut tersembunyi saat print.
 */
export default function PrintSummary({ project, data }) {
  // Portal hanya dirender di browser setelah mount — aman untuk SSR/prerender.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted || typeof document === 'undefined') return null

  const palette = data.colors?.palette || []
  const refs = data.references?.images || []
  const concept = data.references?._concept || generateConcept(data)
  const couple = data.couple || {}

  const doc = (
    <div id="print-summary" className="bg-white text-ink">
      {/* Kop */}
      <div className="mb-4 flex items-end justify-between border-b-2 border-ink/15 pb-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a6a3a]">Mentari Wedding · The Wedding Moodboard</p>
          <h1 className="font-display text-3xl leading-tight text-ink">{project?.couple}</h1>
          <p className="text-[12px] text-ink/60">
            {formatDate(couple.weddingDate || project?.date)}
            {couple.city ? ` · ${couple.city}` : ''}
            {project?.venue ? ` · ${project.venue}` : ''}
          </p>
        </div>
        <div className="text-right text-[11px] text-ink/60">
          <p>Kemajuan: {computeProgress(data)}%</p>
          <p>Dicetak: {new Date().toLocaleDateString('id-ID')}</p>
        </div>
      </div>

      {/* Konsep */}
      {concept && (
        <div className="mb-4 break-inside-avoid rounded-xl border border-ink/10 bg-ivory p-4">
          <p className="mb-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a6a3a]">
            <Icon name="magic" className="h-2.5 w-2.5" /> Konsep
          </p>
          <p className="font-serif text-[13px] leading-relaxed text-ink">{concept}</p>
        </div>
      )}

      {/* Palet swatch */}
      {palette.length > 0 && (
        <div className="mb-4 break-inside-avoid flex items-center gap-3 rounded-xl border border-ink/10 p-3">
          <p className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a6a3a]">
            <Icon name="colors" className="h-2.5 w-2.5" /> Palet:
          </p>
          <div className="flex gap-1.5">
            {palette.map((c) => (
              <span key={c} className="inline-block h-6 w-6 rounded-full border border-ink/10" style={{ background: c }} />
            ))}
          </div>
          {data.colors?.paletteName && <span className="text-[11px] text-ink/70">{data.colors.paletteName}</span>}
        </div>
      )}

      {/* Semua seksi */}
      <div className="grid grid-cols-2 gap-2.5">
        {SECTIONS.filter((s) => s.id !== 'references' && s.id !== 'colors').map((s) => (
          <SectionBlock key={s.id} s={s} sec={data[s.id]} />
        ))}
      </div>
      {SECTIONS.filter((s) => s.id === 'colors').map((s) => (
        <div key={s.id} className="mt-2.5">
          <SectionBlock s={s} sec={data[s.id]} />
        </div>
      ))}

      {/* Foto referensi */}
      {refs.length > 0 && (
        <div className="mt-4 break-inside-avoid rounded-xl border border-ink/10 p-3">
          <p className="mb-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a6a3a]">
            <Icon name="images" className="h-2.5 w-2.5" /> Foto Referensi ({refs.length})
          </p>
          <div className="grid grid-cols-4 gap-2">
            {refs.slice(0, 8).map((img, i) => (
              <img
                key={i}
                src={img.publicUrl || img.dataUrl}
                alt={`ref ${i + 1}`}
                className="h-16 w-full rounded-lg object-cover"
              />
            ))}
          </div>
        </div>
      )}

      <p className="mt-5 flex items-center justify-center gap-1 text-center text-[10px] text-ink/40">
        Dokumen ringkasan moodboard — dibuat otomatis oleh The Wedding Moodboard · Mentari Wedding
        <Icon name="brand" className="h-2.5 w-2.5" />
      </p>
    </div>
  )

  return createPortal(doc, document.body)
}
