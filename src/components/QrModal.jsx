import { useEffect, useState } from 'react'
import { copyText } from '../lib/utils'
import Icon from '../lib/icons'
import { Spinner } from './ui'
import Monogram from './Monogram'

/**
 * Modal QR Code — link moodboard jadi QR siap cetak
 * (undangan fisik, brosur, kartu nama).
 */
export default function QrModal({ url, couple, onClose, data }) {
  const [qr, setQr] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let alive = true
    import('qrcode')
      .then((m) => m.default.toDataURL(url, { width: 640, margin: 2, color: { dark: '#2B2622', light: '#FFFFFF' } }))
      .then((dataUrl) => alive && setQr(dataUrl))
      .catch(() => alive && setQr('error'))
    return () => {
      alive = false
    }
  }, [url])

  const download = () => {
    if (!qr || qr === 'error') return
    const a = document.createElement('a')
    a.download = `moodboard-${(couple || 'qrcode').replace(/[^a-z0-9]/gi, '-')}.png`
    a.href = qr
    a.click()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-soft" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <p className="font-display text-2xl text-ink">QR Code Link</p>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/10 text-ink" aria-label="Tutup" title="Tutup">
            <Icon name="xmark" className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-center gap-3">
          <Monogram data={data} size={44} className="shrink-0" />
          <p className="truncate font-script text-2xl text-ink">{couple}</p>
        </div>
        <p className="mt-1 text-left text-xs text-stone">
          Scan untuk membuka moodboard <b>{couple}</b> — bisa dicetak di undangan fisik, brosur, atau kartu nama.
        </p>

        <div className="mt-4 flex items-center justify-center">
          {qr === null && <Spinner className="h-10 w-10" />}
          {qr === 'error' && <p className="py-8 text-sm text-rose">Gagal membuat QR — coba lagi nanti.</p>}
          {qr && qr !== 'error' && (
            <img src={qr} alt="QR code moodboard" className="h-56 w-56 rounded-2xl border border-ink/10 p-2" />
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={download}
            disabled={!qr || qr === 'error'}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm text-ivory transition hover:bg-gold disabled:opacity-50"
          >
            <Icon name="download" className="h-3.5 w-3.5" /> Unduh PNG
          </button>
          <button
            onClick={() => {
              copyText(url)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-ink/15 px-4 py-2.5 text-sm text-ink transition hover:border-gold hover:text-gold"
          >
            <Icon name={copied ? 'check' : 'copy'} className="h-3.5 w-3.5" /> {copied ? 'Tersalin' : 'Salin Link'}
          </button>
        </div>
      </div>
    </div>
  )
}
