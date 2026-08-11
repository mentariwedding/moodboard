// html2canvas sengaja di-load dinamis (lazy) hanya saat tombol unduh diklik,
// supaya aplikasi tetap berjalan walau dependency ini bermasalah.
import { THEMES } from '../lib/constants'
import { computeProgress, formatDate } from '../lib/utils'
import Icon from '../lib/icons'
import Monogram from './Monogram'

/** Poster ringkasan visual 1080px — dibangun di belakang layar, di-download sebagai PNG. */
export default function Poster({ project, data, id }) {
  const couple = data.couple || {}
  const themeImgs = (data.vibe?.themes || []).map((t) => THEMES.find((x) => x.id === t)).filter(Boolean)
  const palette = data.colors?.palette || []
  const refs = data.references?.images || []
  const top3 = (data.priorities?.top3 || []).map((t) => {
    const map = { decor: 'Dekorasi', food: 'Makanan', photo: 'Foto & Video', outfit: 'Busana & Rias', entertainment: 'Hiburan' }
    return map[t] || t
  })

  return (
    <div
      id={id}
      style={{ width: 1080, position: 'fixed', left: -5000, top: 0, pointerEvents: 'none', zIndex: -1 }}
      className="bg-ivory"
    >
      <div className="px-16 py-14">
        {/* Header */}
        <div className="flex items-end justify-between border-b-2 border-ink/10 pb-6">
          <div className="flex items-end gap-5">
            <Monogram data={data} size={84} className="shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gold">Mentari Wedding</p>
              <h1 className="mt-2 font-display text-6xl leading-tight text-ink">{project?.couple || 'Wedding Moodboard'}</h1>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-stone">{project?.date ? formatDate(project.date) : ''}</p>
            <p className="mt-1 text-xs text-stone">{computeProgress(data)}% terisi</p>
          </div>
        </div>

        {/* Tema */}
        <div className="mt-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">The Vibe</p>
          {themeImgs.length > 0 && (
            <div className="mt-3 flex gap-4">
              {themeImgs.map((t) => (
                <img key={t.id} src={t.img} alt={t.label} style={{ width: 220, height: 150 }} className="rounded-2xl object-cover" />
              ))}
            </div>
          )}
          <p className="mt-3 text-lg text-ink">{themeImgs.map((t) => t.label).join(' · ') || 'Konsep masih didiskusikan'}</p>
        </div>

        {/* Palet */}
        {palette.length > 0 && (
          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Color Palette</p>
            <div className="mt-3 flex gap-4">
              {palette.map((c) => (
                <div key={c} className="flex items-center gap-3">
                  <span style={{ background: c, width: 64, height: 64 }} className="rounded-2xl border border-ink/10" />
                  <span className="text-xs text-stone">{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Konsep */}
        {(data.references?._concept || data.vibe?.keywords) && (
          <div className="mt-8 rounded-3xl bg-white p-7 shadow-card">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Concept</p>
            <p className="mt-2 font-serif text-xl leading-relaxed text-ink">
              {data.references?._concept || data.vibe?.keywords}
            </p>
          </div>
        )}

        {/* Prioritas + foto */}
        <div className="mt-8 flex gap-8">
          {top3.length > 0 && (
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Top Priorities</p>
              <div className="mt-3 space-y-2">
                {top3.map((t, i) => (
                  <div key={t} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm text-ivory">{i + 1}</span>
                    <span className="text-lg text-ink">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {refs.length > 0 && (
            <div className="flex-[2]">
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Inspiration</p>
              <div className="mt-3 flex gap-3">
                {refs.slice(0, 4).map((img, i) => (
                  <img key={i} src={img.publicUrl || img.dataUrl} alt={`ref ${i + 1}`} style={{ width: 150, height: 150 }} className="rounded-xl object-cover" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Playlist */}
        {(data.playlist?.songs || []).length > 0 && (
          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Playlist</p>
            <div className="mt-3 space-y-1.5">
              {data.playlist.songs.slice(0, 6).map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="rounded-full bg-cream px-2 py-0.5 text-[11px] text-stone">{s.moment}</span>
                  <span className="text-sm text-ink">{s.title || s.url}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="mt-12 flex items-center justify-center gap-1.5 text-center text-sm text-stone">
          Dibuat dengan <Icon name="brand" className="h-3.5 w-3.5 text-gold" /> The Wedding Moodboard — Mentari Wedding
        </p>
      </div>
    </div>
  )
}

export async function downloadPoster(el) {
  let html2canvas
  try {
    ;({ default: html2canvas } = await import('html2canvas'))
  } catch (e) {
    throw new Error('Library html2canvas belum terpasang. Jalankan "npm install" lalu coba lagi.')
  }
  const canvas = await html2canvas(el, { scale: 0.7, useCORS: true, backgroundColor: '#FBF8F4' })
  const a = document.createElement('a')
  a.download = 'moodboard-poster.png'
  a.href = canvas.toDataURL('image/png')
  a.click()
}
