import { useEffect, useRef, useState } from 'react'
import { THEMES, PALETTE_META, SECTIONS, PRIORITY_ITEMS } from '../lib/constants'
import { accentFromPalette, filledSections } from '../lib/utils'
import Icon from '../lib/icons'

const PRIO_LABEL = (id) => PRIORITY_ITEMS.find((p) => p.id === id)?.label || id

/** Kumpulkan semua pilihan client menjadi isi papan moodboard. */
function boardContent(data) {
  const themes = (data.vibe?.themes || []).map((id) => THEMES.find((t) => t.id === id)).filter(Boolean)
  const palette = data.colors?.palette || []
  const chips = []
  const add = (icon, label, val, max = 3) => {
    if (Array.isArray(val)) {
      if (val.length) chips.push({ icon, label, value: val.slice(0, max).join(', ') + (val.length > max ? ' …' : '') })
    } else if (typeof val === 'string' && val.trim()) {
      chips.push({ icon, label, value: val.trim() })
    }
  }
  add('archway', 'Pelaminan', data.decor?.stage)
  add('sprout', 'Bunga', data.decor?.flowersLike)
  add('lightbulb', 'Lighting', data.decor?.lighting)
  add('look', 'Gaun', data.look?.dress)
  add('brush', 'Rias', data.look?.makeup)
  add('tie', 'Pria', data.look?.groom)
  add('ceremony', 'Acara', data.ceremony?.format)
  const songs = data.playlist?.songs || []
  if (songs.length) chips.push({ icon: 'music', label: 'Playlist', value: songs.slice(0, 3).map((x) => x.title || 'lagu').join(', ') + (songs.length > 3 ? ' …' : '') })
  add('guitar', 'Musik', data.ceremony?.music)
  add('feast', 'Penyajian', data.feast?.style)
  add('cake', 'Kue', data.feast?.cake)
  add('stationery', 'Undangan', data.stationery?.type)
  add('photo', 'Foto', data.photo?.styles)
  add('priorities', 'Prioritas', (data.priorities?.top3 || []).map(PRIO_LABEL))
  return { themes, palette, paletteName: data.colors?.paletteName || '', chips, refs: data.references?.images || [] }
}

export function Board({ data, project, scrollable = true }) {
  const { themes, palette, paletteName, chips, refs } = boardContent(data)
  const filled = filledSections(data)
  const total = SECTIONS.length
  const accent =
    (data.colors?.paletteName && PALETTE_META[data.colors.paletteName]) ||
    accentFromPalette(palette) ||
    '#B08D57'
  const isEmpty = filled === 0
  const couple = project?.couple || 'Moodboard Kami'

  return (
    <div className="overflow-hidden rounded-3xl border border-ink/5 bg-white/85 shadow-soft backdrop-blur">
      {/* Header */}
      <div className="border-b border-ink/5 bg-gradient-to-br from-goldlight/25 via-transparent to-blush/10 px-5 pb-4 pt-5">
        <div className="flex items-center justify-between">
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-gold">
            <Icon name="magic" className="h-3 w-3" /> Moodboard Kami
          </p>
          <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
        </div>
        <p className="mt-1 truncate font-display text-xl italic text-ink">{couple}</p>
      </div>

      {/* Isi papan */}
      <div className={scrollable ? 'max-h-[calc(100vh-19rem)] space-y-4 overflow-y-auto px-4 py-4' : 'space-y-4 px-4 py-4'}>
        {isEmpty ? (
          <div className="rounded-2xl border border-dashed border-gold/30 bg-goldlight/10 px-4 py-8 text-center">
            <Icon name="colors" className="mx-auto h-7 w-7 text-gold" />
            <p className="mt-2 text-sm font-medium text-ink">Papan moodboard kamu masih kosong</p>
            <p className="mt-1 text-xs leading-relaxed text-stone">
              Pilih tema, warna, dan jawab seksi-seksinya — semua pilihanmu akan tersusun otomatis di papan ini.
            </p>
          </div>
        ) : (
          <>
            {themes.length > 0 && (
              <div className={`grid gap-2 ${themes.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {themes.map((t) => (
                  <div key={t.id} className="relative overflow-hidden rounded-xl">
                    <img
                      src={t.img}
                      alt={t.label}
                      className={`w-full object-cover ${themes.length > 1 ? 'h-20' : 'h-24'}`}
                      loading="lazy"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1 pt-4 text-[10px] font-medium text-white">
                      {t.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {palette.length > 0 && (
              <div className="rounded-2xl border border-ink/5 bg-cream/50 p-3">
                <p className="mb-1.5 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-stone">
                  <Icon name="colors" className="h-3 w-3" /> Palet {paletteName ? `· ${paletteName}` : ''}
                </p>
                <div className="flex h-2.5 overflow-hidden rounded-full">
                  {palette.map((c) => (
                    <span key={c} className="flex-1" style={{ background: c }} />
                  ))}
                </div>
              </div>
            )}

            {chips.length > 0 && (
              <div className="space-y-1.5">
                {chips.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-xl bg-ivory/80 px-3 py-2">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cream text-gold">
                      <Icon name={c.icon} className="h-3 w-3" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase tracking-wider text-stone">{c.label}</p>
                      <p className="truncate text-[13px] font-medium text-ink">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {refs.length > 0 && (
              <div>
                <p className="mb-1.5 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-stone">
                  <Icon name="cameraRetro" className="h-3 w-3" /> Referensi kalian
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {refs.slice(0, 6).map((img, i) => (
                    <img
                      key={i}
                      src={img.demo ? img.dataUrl : img.publicUrl}
                      alt={`ref ${i + 1}`}
                      className="h-16 w-full rounded-lg object-cover"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer progress */}
      <div className="border-t border-ink/5 px-4 py-3">
        <div className="flex items-center justify-between text-[11px] text-stone">
          <span>{filled} dari {total} seksi masuk papan</span>
          <span className="font-semibold" style={{ color: accent }}>{Math.round((filled / total) * 100)}%</span>
        </div>
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-ink/10">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(filled / total) * 100}%`, background: accent }}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Live Moodboard Canvas — papan moodboard ala Pinterest yang tersusun
 * otomatis dari jawaban client. Desktop: panel sticky di kanan.
 * Mobile: tombol melayang + bottom sheet.
 */
export default function MoodboardCanvas({ data, project }) {
  const [open, setOpen] = useState(false)
  const [sheet, setSheet] = useState(false)
  const autoOpened = useRef(false)
  const filled = filledSections(data)

  // Auto-buka panel desktop sekali, setelah client mengisi ≥ 2 seksi
  useEffect(() => {
    if (!autoOpened.current && filled >= 2) {
      autoOpened.current = true
      setOpen(true)
    }
  }, [filled])

  return (
    <>
      {/* Desktop: panel kanan */}
      <aside className="hidden pb-24 xl:block">
        {open ? (
          <div className="sticky top-24 animate-[fadeIn_.3s_ease]">
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-3 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-ivory shadow transition hover:bg-gold"
              title="Tutup panel"
            >
              <Icon name="xmark" className="h-3 w-3" />
            </button>
            <Board data={data} project={project} />
          </div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="sticky top-24 ml-auto inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white px-4 py-2.5 text-sm font-medium text-[#8a6a3a] shadow-soft transition hover:shadow-card"
          >
            <Icon name="colors" className="h-4 w-4" /> Buka Moodboard
          </button>
        )}
      </aside>

      {/* Mobile: tombol melayang — di atas bottom nav, tidak menutupi tombol Submit */}
      <button
        onClick={() => setSheet(true)}
        className="fixed bottom-[104px] right-4 z-40 flex h-13 w-13 items-center justify-center rounded-full text-white shadow-soft transition hover:scale-105 xl:hidden"
        style={{ background: 'var(--accent, #B08D57)', height: 52, width: 52 }}
        title="Lihat moodboard"
      >
        <Icon name="colors" className="h-5 w-5" />
        {filled > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-ivory">
            {filled}
          </span>
        )}
      </button>

      {/* Mobile: bottom sheet */}
      {sheet && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/35 animate-[fadeIn_.2s_ease] xl:hidden"
            onClick={() => setSheet(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 max-h-[78vh] overflow-y-auto rounded-t-3xl bg-ivory p-4 pb-8 shadow-2xl animate-[slideUp_.3s_ease] xl:hidden">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-ink/15" />
            <div className="flex items-center justify-between px-1">
              <p className="inline-flex items-center gap-2 font-display text-xl text-ink">
                <Icon name="magic" className="h-4 w-4 text-gold" /> Moodboard Kami
              </p>
              <button
                onClick={() => setSheet(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/10 text-sm text-ink"
              >
                <Icon name="xmark" className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mt-3">
              <Board data={data} project={project} scrollable={false} />
            </div>
          </div>
        </>
      )}
    </>
  )
}
