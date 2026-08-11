import { useEffect, useRef, useState } from 'react'

/** Angka yang beranimasi naik menuju nilai target (easing). */
export default function useCountUp(target, duration = 600) {
  const [val, setVal] = useState(target)
  const prev = useRef(target)

  useEffect(() => {
    const from = prev.current
    const to = target
    if (from === to) return
    const start = performance.now()
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(from + (to - from) * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
      else prev.current = to
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      prev.current = to
    }
  }, [target, duration])

  return val
}
