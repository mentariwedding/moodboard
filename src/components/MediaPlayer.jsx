import { useState } from 'react'
import Icon from '../lib/icons'
import { getEmbedInfo } from '../lib/utils'

/**
 * Media player untuk link playlist (YouTube/Spotify).
 * - Menampilkan thumbnail (YouTube) + tombol play
 * - Klik play → iframe embed dimuat on-demand (lazy), autoplay
 * - Variant 'inline' → embed muncul di bawah tombol
 * - Variant 'modal' → embed muncul di modal kecil
 */
export default function MediaPlayer({ url, title, variant = 'inline', size = 'md' }) {
  const [playing, setPlaying] = useState(false)
  const info = getEmbedInfo(url)

  if (!info) {
    // Link biasa: buka di tab baru
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs text-stone transition hover:border-gold hover:text-gold"
        title="Buka link"
      >
        <Icon name="external" className="h-3 w-3" /> Buka
      </a>
    )
  }

  const sizeCls = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'

  // ====== Modal ======
  if (variant === 'modal') {
    return (
      <>
        <button
          onClick={() => setPlaying(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs text-stone transition hover:border-gold hover:text-gold"
          title={`Putar ${title || 'lagu'}`}
        >
          <Icon name="play" className="h-3 w-3" /> Putar
        </button>
        {playing && (
          <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/60 p-4" onClick={() => setPlaying(false)}>
            <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-soft" onClick={(e) => e.stopPropagation()}>
              <div className="mb-2 flex items-center justify-between">
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{title || 'Pratinjau'}</p>
                <button onClick={() => setPlaying(false)} className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink/10 text-ink" aria-label="Tutup">
                  <Icon name="xmark" className="h-3 w-3" />
                </button>
              </div>
              <div className="overflow-hidden rounded-xl bg-black">
                <EmbedFrame info={info} />
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // ====== Inline ======
  return (
    <div className="inline-block">
      <button
        onClick={() => setPlaying(!playing)}
        className={`inline-flex items-center justify-center rounded-full text-white shadow transition hover:scale-105 ${sizeCls}`}
        style={{ background: 'var(--accent, #B08D57)' }}
        title={playing ? 'Jeda' : `Putar ${title || 'lagu'}`}
        aria-label={playing ? 'Jeda' : 'Putar'}
      >
        <Icon name={playing ? 'pause' : 'play'} className="h-3.5 w-3.5" />
      </button>
      {playing && (
        <div className="mt-2 overflow-hidden rounded-xl bg-black shadow-card">
          <EmbedFrame info={info} />
        </div>
      )}
    </div>
  )
}

function EmbedFrame({ info }) {
  if (info.type === 'youtube') {
    return (
      <iframe
        src={info.embedUrl}
        title="Pemutar media"
        className="aspect-video w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }
  // Spotify & lainnya
  return (
    <iframe
      src={info.embedUrl}
      title="Pemutar media"
      className="h-20 w-full"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  )
}
