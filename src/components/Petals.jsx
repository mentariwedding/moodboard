import { useMemo } from 'react'

const PETAL_COLORS = ['#E8B4B8', '#F4DADB', '#D6BE93', '#F0C9C9']

/** Kelopak bunga melayang halus — dekorasi latar (non-interaktif). */
export default function Petals({ count = 14 }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        size: 7 + Math.random() * 10,
        delay: Math.random() * 14,
        dur: 10 + Math.random() * 11,
        color: PETAL_COLORS[i % PETAL_COLORS.length],
        blur: Math.random() > 0.6,
      })),
    [count],
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden motion-reduce:hidden" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.2,
            background: p.color,
            filter: p.blur ? 'blur(1px)' : undefined,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  )
}
