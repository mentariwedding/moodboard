import { useMemo } from 'react'
import Icon from '../lib/icons'

const SCRIPT_FONT = '"Great Vibes", cursive'
const SERIF_FONT = '"Cormorant Garamond", Georgia, serif'

/**
 * Monogram pasangan — logo melingkar elegan dari inisial nama,
 * memakai warna palet client. Digunakan di header wizard, kartu sukses,
 * poster, QR, dan halaman pasangan.
 */
export default function Monogram({ data, size = 64, className = '', variant = 'auto' }) {
  const couple = data?.couple || {}
  const palette = data?.colors?.palette || []
  const paletteName = data?.colors?.paletteName || ''

  const computed = useMemo(() => {
    const pick = (arr, i, fallback) => (arr && arr[i] ? arr[i] : fallback)
    // Warna utama: ambil dari palet (hindari warna sangat terang)
    const light = ['#F4DADB', '#F7F2E9', '#F9E2C9', '#FFFFFF', '#F2EDE4', '#E8E4DE', '#E8D5E8', '#F6C6C6', '#C9D8E8', '#A9BCC6']
    const usable = (palette || []).filter((c) => !light.includes(c.toUpperCase()))
    const c1 = usable[0] || pick(palette, 1, '#B08D57')
    const c2 = usable[1] || pick(palette, 2, '#D6BE93')
    return { c1, c2 }
  }, [palette, paletteName])

  // Inisial
  const letters = [couple.brideName, couple.groomName]
    .filter(Boolean)
    .map((n) => n.trim().charAt(0).toUpperCase())
  const one = letters[0] || '❤'
  const two = letters[1] || '❤'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="Monogram pasangan"
    >
      {/* Lingkaran luar ganda */}
      <circle cx="60" cy="60" r="56" fill="none" stroke={computed.c1} strokeWidth="1.4" opacity="0.75" />
      <circle cx="60" cy="60" r="50" fill="none" stroke={computed.c2} strokeWidth="0.8" opacity="0.6" strokeDasharray="2.5 3.5" />

      {/* Hati kecil dekoratif */}
      <g fill={computed.c1} opacity="0.85">
        <path d="M60 12.5 c-2 -3 -7 -3 -7 1 c0 3 4 5 7 8 c3 -3 7 -5 7 -8 c0 -4 -5 -4 -7 -1" />
        <path d="M60 107.5 c-2 3 -7 3 -7 -1 c0 -3 4 -5 7 -8 c3 3 7 5 7 8 c0 4 -5 4 -7 1" />
      </g>

      {/* Ampersand */}
      <text
        x="60"
        y="74"
        textAnchor="middle"
        fontFamily={SCRIPT_FONT}
        fontSize="24"
        fill={computed.c1}
        opacity="0.9"
      >
        &amp;
      </text>

      {/* Inisial */}
      <text
        x="28"
        y="42"
        textAnchor="middle"
        fontFamily={SERIF_FONT}
        fontSize="34"
        fontWeight="600"
        fill={computed.c1}
      >
        {one}
      </text>
      <text
        x="92"
        y="42"
        textAnchor="middle"
        fontFamily={SERIF_FONT}
        fontSize="34"
        fontWeight="600"
        fill={computed.c2}
      >
        {two}
      </text>

      {/* Titik aksen */}
      <circle cx="60" cy="22" r="1.4" fill={computed.c1} />
      <circle cx="60" cy="98" r="1.4" fill={computed.c1} />
      <circle cx="22" cy="60" r="1.2" fill={computed.c2} />
      <circle cx="98" cy="60" r="1.2" fill={computed.c2} />
    </svg>
  )
}

/** Ikon hati kecil untuk kondisi tanpa nama. */
export function HeartMark({ className = '' }) {
  return <Icon name="heart" className={className} />
}
