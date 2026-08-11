/**
 * Capture elemen HTML jadi PNG — pakai html-to-image (SVG foreignObject)
 * yang merender teks & font web dengan akurat (tidak seperti html2canvas
 * yang sering membuat teks berantakan/terpotong).
 */
export async function captureElement(el, { filename, backgroundColor = '#FBF8F4', scale = 2 } = {}) {
  // 1) Tunggu & paksa semua font web selesai dimuat
  try {
    await document.fonts.ready
    await Promise.allSettled([
      document.fonts.load('400 16px "Cormorant Garamond"'),
      document.fonts.load('500 16px "Cormorant Garamond"'),
      document.fonts.load('400 16px "Great Vibes"'),
      document.fonts.load('400 16px "Playfair Display"'),
      document.fonts.load('400 16px "Jost"'),
    ])
    // Beri waktu browser benar-benar menerapkan font
    await new Promise((r) => setTimeout(r, 150))
  } catch {}

  // 2) Lazy-load library (tidak membebani bundle utama)
  const { toPng } = await import('html-to-image')

  // 3) Render ke PNG.
  //    skipFonts:true dipakai saat mode percobaan pertama gagal karena
  //    stylesheet remote (Google Fonts) tidak bisa dibaca (SecurityError).
  //    Font sudah dimuat di halaman → hasil tetap memakai font (fallback aman).
  let dataUrl
  try {
    dataUrl = await toPng(el, {
      backgroundColor,
      pixelRatio: scale,
      cacheBust: true,
    })
  } catch (err) {
    // Coba lagi tanpa inlining font remote (menghindari SecurityError cssRules)
    dataUrl = await toPng(el, {
      backgroundColor,
      pixelRatio: scale,
      cacheBust: true,
      skipFonts: true,
    })
  }

  // 4) Unduh
  const a = document.createElement('a')
  a.download = filename
  a.href = dataUrl
  a.click()
}
