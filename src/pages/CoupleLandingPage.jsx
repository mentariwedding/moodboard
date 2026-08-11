import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProjectByToken, loadMoodboard } from '../lib/api'
import { THEMES, PRIORITY_ITEMS } from '../lib/constants'
import { mergeMoodboards, formatDate, daysUntil, linkType } from '../lib/utils'
import { Spinner, Skeleton } from '../components/ui'
import Icon from '../lib/icons'
import useAccent from '../lib/useAccent'
import Monogram from '../components/Monogram'

/**
 * Halaman pasangan — mini wedding website publik.
 * Menampilkan konsep moodboard pasangan, bisa dibagikan ke keluarga,
 * sekaligus jadi portfolio WO.
 */
export default function CoupleLandingPage() {
  const { token } = useParams()
  const [project, setProject] = useState(null)
  const [data, setData] = useState(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const p = await getProjectByToken(token)
      if (!alive) return
      if (!p) { setMissing(true); return }
      setProject(p)
      const mb = await loadMoodboard(token)
      if (!alive) return
      const raw = mb?.data || {}
      const merged = p.couple_mode && raw.coupleData ? mergeMoodboards(raw.coupleData.one, raw.coupleData.two) : raw
      setData(merged)
    })()
    return () => { alive = false }
  }, [token])

  useAccent(data)

  if (missing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-soft">
          <Icon name="brokenHeart" className="mx-auto h-10 w-10 text-rose" />
          <h1 className="mt-3 font-display text-2xl text-ink">Halaman tidak ditemukan</h1>
          <p className="mt-2 text-sm text-stone">Minta link terbaru dari Wedding Organizer kamu.</p>
        </div>
      </div>
    )
  }

  if (!project || !data) {
    return (
      <div className="min-h-screen bg-ivory">
        <header className="relative overflow-hidden py-20 text-center sm:py-28">
          <div className="mx-auto flex max-w-3xl flex-col items-center px-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="mt-5 h-4 w-44" />
            <Skeleton className="mt-3 h-12 w-64 sm:w-96" />
            <Skeleton className="mt-5 h-9 w-56 rounded-full" />
          </div>
        </header>
        <main className="mx-auto max-w-3xl space-y-8 px-4">
          <Skeleton className="h-32 w-full rounded-3xl" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
          </div>
          <Skeleton className="h-20 w-full rounded-2xl" />
        </main>
      </div>
    )
  }

  const couple = data.couple || {}
  const name = [couple.brideName, couple.groomName].filter(Boolean).join(' & ') || project.couple
  const date = formatDate(couple.weddingDate || project.date)
  const days = daysUntil(couple.weddingDate || project.date)
  const themeImgs = (data.vibe?.themes || []).map((t) => THEMES.find((x) => x.id === t)).filter(Boolean)
  const palette = data.colors?.palette || []
  const top3 = (data.priorities?.top3 || []).map((t) => PRIORITY_ITEMS.find((p) => p.id === t)?.label || t)
  const refs = data.references?.images || []
  const concept = data.references?._concept || data.vibe?.keywords

  return (
    <div className="min-h-screen overflow-x-hidden bg-ivory">
      {/* Hero */}
      <header className="relative overflow-hidden">
        {themeImgs[0] && (
          <img src={themeImgs[0].img} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ivory" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:py-28">
          <div className="mx-auto flex justify-center">
            <Monogram data={data} size={96} className="drop-shadow-sm" />
          </div>
          <p className="mt-4 px-2 text-[11px] uppercase tracking-[0.22em] text-gold sm:text-xs sm:tracking-[0.4em]">
            We&rsquo;re getting married
          </p>
          <h1 className="mx-auto mt-3 max-w-2xl break-words pb-2 font-script text-5xl leading-[1.2] text-ink sm:text-7xl">
            {name}
          </h1>
          {date && (
            <p className="mx-auto mt-5 inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-2xl bg-white/80 px-5 py-2.5 text-sm text-ink shadow-card backdrop-blur">
              <Icon name="calendar" className="h-4 w-4 shrink-0 text-gold" />
              <span>{date}</span>
              {couple.city && <span className="text-stone">· {couple.city}</span>}
            </p>
          )}
          {days !== null && days >= 0 && (
            <p className="mt-3 inline-flex items-center justify-center gap-1.5 text-sm text-stone">
              <Icon name="heart" className="h-3.5 w-3.5 shrink-0 text-rose" /> {days} hari menuju hari bahagia
            </p>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-10 px-4 pb-20">
        {/* Konsep */}
        {concept && (
          <section className="rounded-3xl bg-white px-6 py-8 text-center shadow-soft sm:px-8">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Our Concept</p>
            <p className="mx-auto mt-3 max-w-2xl text-left font-serif text-[15px] leading-relaxed text-ink sm:text-center sm:text-xl">
              {concept}
            </p>
          </section>
        )}

        {/* Tema */}
        {themeImgs.length > 0 && (
          <section>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">The Vibe</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {themeImgs.slice(0, 3).map((t) => (
                <div key={t.id} className="min-w-0 overflow-hidden rounded-2xl shadow-card">
                  <img src={t.img} alt={t.label} className="h-28 w-full object-cover sm:h-44" />
                  <p className="truncate bg-white px-2 py-2 text-center text-[13px] font-medium text-ink sm:text-sm">
                    {t.label}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Palet */}
        {palette.length > 0 && (
          <section>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">Color Palette</p>
            <div className="flex flex-wrap items-center gap-2.5">
              {palette.map((c) => (
                <div key={c} className="flex items-center gap-2 rounded-full border border-ink/5 bg-white py-1.5 pl-1.5 pr-4 shadow-card">
                  <span className="h-7 w-7 shrink-0 rounded-full border border-ink/10" style={{ background: c }} />
                  <span className="text-xs text-stone">{c}</span>
                </div>
              ))}
              {data.colors?.paletteName && (
                <span className="text-sm font-medium text-stone">— {data.colors.paletteName}</span>
              )}
              {palette.length > 0 && <span className="text-[11px] text-stone/60">{palette.length} warna</span>}
            </div>
          </section>
        )}

        {/* Prioritas */}
        {top3.length > 0 && (
          <section>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">What matters most</p>
            <div className="flex flex-wrap gap-2.5">
              {top3.map((t, i) => (
                <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] text-ivory sm:px-5 sm:py-2.5 sm:text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-[10px]">{i + 1}</span>
                  {t}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Playlist */}
        {(data.playlist?.songs?.length || data.playlist?.doNotPlay) && (
          <section>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">Our Playlist</p>
            <div className="space-y-2">
              {data.playlist.songs.map((x, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl border border-ink/5 bg-white px-4 py-3 shadow-card">
                  <span className="shrink-0 rounded-full bg-cream px-2.5 py-1 text-[10px] text-stone">{x.moment}</span>
                  <span className="min-w-0 flex-1 truncate text-sm text-ink">{x.title || x.url}</span>
                  {x.url && <a href={x.url} target="_blank" rel="noreferrer" className="shrink-0 text-gold hover:opacity-80"><Icon name={linkType(x.url)} className="h-4 w-4" /></a>}
                </div>
              ))}
              {data.playlist.doNotPlay?.trim() && <p className="text-xs text-stone"><Icon name="avoid" className="mr-1 inline h-3 w-3 text-rose" />Jangan diputar: {data.playlist.doNotPlay}</p>}
            </div>
          </section>
        )}

        {/* Foto referensi */}
        {refs.length > 0 && (
          <section>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">Our Inspiration</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {refs.slice(0, 6).map((img, i) => (
                <img key={i} src={img.publicUrl || img.dataUrl} alt={`inspirasi ${i + 1}`} className="aspect-square w-full rounded-2xl object-cover shadow-card" loading="lazy" />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="text-center">
          <Link
            to={`/mb/${token}`}
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium text-white shadow-soft transition hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            <Icon name="heart" className="h-4 w-4" /> Isi / lihat moodboard kami
          </Link>
          <p className="mt-4 inline-flex max-w-full flex-wrap items-center justify-center gap-1.5 text-xs text-stone/70">
            Dibuat dengan <Icon name="brand" className="h-3.5 w-3.5 shrink-0 text-gold" /> Mentari Wedding — The Wedding Moodboard
          </p>
        </section>
      </main>
    </div>
  )
}
