import { useEffect, useRef } from 'react'

export default function Confetti({ duration = 2800 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = (canvas.width = window.innerWidth)
    const H = (canvas.height = window.innerHeight)
    const colors = ['#B08D57', '#D6BE93', '#C98A8A', '#F4DADB', '#8A9B83', '#2B2622', '#E8B4B8']
    const parts = Array.from({ length: 150 }, () => ({
      x: Math.random() * W,
      y: -30 - Math.random() * H * 0.4,
      w: 5 + Math.random() * 7,
      h: 8 + Math.random() * 9,
      vx: (Math.random() - 0.5) * 1.8,
      vy: 2 + Math.random() * 3.4,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.22,
      color: colors[(Math.random() * colors.length) | 0],
    }))
    let raf
    const start = performance.now()
    const tick = (t) => {
      ctx.clearRect(0, 0, W, H)
      parts.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.04
        p.rot += p.vr
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, 1 - (t - start) / duration)
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      })
      if (t - start < duration) raf = requestAnimationFrame(tick)
      else ctx.clearRect(0, 0, W, H)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration])

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[200]" />
}
