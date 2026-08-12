import { useEffect, useMemo } from 'react'
import { PALETTE_META } from './constants'
import { accentFromPalette, lighten, contrastText } from './utils'

/**
 * Hook aksen dinamis — UI wizard mengikuti palet warna yang dipilih client.
 * Set CSS variables: --accent, --accent-light, --accent-text di <html>.
 */
export default function useAccent(data) {
  const paletteName = data?.colors?.paletteName
  const palette = data?.colors?.palette

  const accent = useMemo(() => {
    if (paletteName && PALETTE_META[paletteName]) return PALETTE_META[paletteName]
    return accentFromPalette(palette)
  }, [paletteName, palette])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--accent', accent)
    root.style.setProperty('--accent-light', lighten(accent))
    root.style.setProperty('--accent-text', contrastText(accent))
  }, [accent])

  return accent
}
