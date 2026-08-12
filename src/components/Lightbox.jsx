import { useCallback, useEffect } from 'react'
import Icon from '../lib/icons'

/**
 * Lightbox galeri — foto referensi tampil besar, bisa di-zoom,
 * navigasi antar foto dengan panah / geser.
 */
export default function Lightbox({ images, index, onClose, onNavigate }) {
  const count = images.length
  const img = images[index]

  const next = useCallback(() => onNavigate((index + 1) % count), [index, count, onNavigate])
  const prev = useCallback(() => onNavigate((index - 1 + count) % count), [index, count, onNavigate])

  // Keyboard: Esc tutup, panah kiri/kanan navigasi
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev, onClose])

  const src = img?.publicUrl || img?.dataUrl || ''

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col bg-black/85 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Pratinjau foto"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 text-white/80">
        <span className="text-sm">
          {index + 1} / {count}
        </span>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
          aria-label="Tutup"
        >
          <Icon name="xmark" className="h-4 w-4" />
        </button>
      </div>

      {/* Gambar */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-4">
        <img
          src={src}
          alt={`referensi ${index + 1}`}
          className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
        {img?.link && (
          <a
            href={img.link}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-xs text-white backdrop-blur transition hover:bg-white/30"
            onClick={(e) => e.stopPropagation()}
          >
            <Icon name="external" className="h-3 w-3" /> Buka link referensi
          </a>
        )}

        {/* Tombol navigasi */}
        {count > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 sm:left-5"
              aria-label="Sebelumnya"
            >
              <Icon name="arrowLeft" className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 sm:right-5"
              aria-label="Berikutnya"
            >
              <Icon name="arrowRight" className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
