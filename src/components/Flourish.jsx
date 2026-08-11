/** Ornamen flourish SVG — pembatas dekoratif ala undangan wedding. */
export default function Flourish({ className = '' }) {
  return (
    <svg
      viewBox="0 0 240 24"
      className={`mx-auto block h-6 w-56 max-w-full text-gold ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {/* kurva kiri */}
      <path d="M6 12 C 26 3, 52 3, 74 12 C 88 18, 100 18, 110 12" />
      {/* kurva kanan */}
      <path d="M234 12 C 214 3, 188 3, 166 12 C 152 18, 140 18, 130 12" />
      {/* daun tengah */}
      <path d="M114 4 L 120 12 L 114 20 L 108 12 Z" fill="currentColor" stroke="none" opacity="0.85" />
      {/* titik aksen */}
      <circle cx="6" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="234" cy="12" r="1.6" fill="currentColor" stroke="none" />
      {/* daun kecil di kurva */}
      <path d="M40 7 C 36 4, 32 5, 31 9" opacity="0.6" />
      <path d="M200 7 C 204 4, 208 5, 209 9" opacity="0.6" />
    </svg>
  )
}
