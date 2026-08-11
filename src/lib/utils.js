import { SECTION_IDS, THEMES, PRIORITY_ITEMS } from './constants'

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export function makeToken() {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'
  let t = ''
  for (let i = 0; i < 8; i++) t += chars[Math.floor(Math.random() * chars.length)]
  return t
}

/** Ubah nama pasangan jadi slug URL: 'Salsabila & Raka' → 'salsabila-raka'. */
export function slugify(name = '') {
  return String(name)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
}

/** Link moodboard client — cantik dengan nama pasangan: #/mb/salsabila-raka/TOKEN */
export function shareUrl(token, who, couple) {
  const q = who === 'two' ? '?who=two' : ''
  const slug = couple ? slugify(couple) : ''
  return window.location.origin + window.location.pathname + '#/mb/' + (slug ? slug + '/' : '') + token + q
}

/** Link halaman pasangan — cantik juga: #/couple/salsabila-raka/TOKEN */
export function coupleUrl(token, couple) {
  const slug = couple ? slugify(couple) : ''
  return window.location.origin + window.location.pathname + '#/couple/' + (slug ? slug + '/' : '') + token
}

/** Normalisasi nomor WA untuk wa.me: 08xx → 628xx, buang spasi/+/-. */
/** Deteksi jenis link: spotify / youtube / link lain. */
export function linkType(url) {
  if (!url) return 'link'
  try {
    const h = new URL(url).hostname
    if (h.includes('spotify')) return 'spotify'
    if (h.includes('youtube') || h.includes('youtu.be')) return 'youtube'
  } catch {}
  return 'link'
}

/** Ambil judul lagu/video otomatis via oEmbed (Spotify & YouTube, tanpa API key). */
export async function fetchLinkMeta(url) {
  try {
    const u = new URL(url)
    let oembed = ''
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    } else if (u.hostname.includes('spotify.com')) {
      oembed = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`
    } else {
      return { type: 'link', title: '' }
    }
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 4000)
    const res = await fetch(oembed, { signal: ctrl.signal })
    clearTimeout(t)
    if (!res.ok) return { type: linkType(url), title: '' }
    const j = await res.json()
    return { type: linkType(url), title: j.title || '' }
  } catch {
    return { type: linkType(url), title: '' }
  }
}

export function waNumber(raw) {
  if (!raw) return ''
  // Mode bareng bisa berisi dua nomor dipisah ' / ' — pakai yang pertama
  const first = String(raw).split('/')[0]
  let n = first.replace(/[^0-9]/g, '')
  if (n.startsWith('0')) n = '62' + n.slice(1)
  if (n.length < 9) return ''
  return n
}

export function waShareUrl(token, coupleName, who, pin, number) {
  const url = shareUrl(token, who, coupleName)
  const whoLabel = who === 'two' ? ' (mempelai 2)' : who === 'one' ? ' (mempelai 1)' : ''
  const pinLine = pin ? `\n🔒 Kode akses moodboard: ${pin}` : ''
  const text = `Halo ${coupleName || 'kamu'} 🎀\nIni moodboard pernikahan kita — isi sesuai keinginan ya, tinggal klik link di bawah ini${whoLabel}:\n${url}${pinLine}\n\nTerima kasih! — Mentari Wedding`
  const num = waNumber(number)
  return `https://wa.me/${num ? num : ""}?text=${encodeURIComponent(text)}`
}

export function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''))
  if (isNaN(d)) return iso
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function todayISO() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** Buat file kalender (ICS) untuk tanggal pernikahan. */
export function makeIcs({ summary, date, time, endTime, location, description }) {
  const esc = (s) => String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,')
  const dateNum = (d) => (d || '').replace(/-/g, '')
  const timeNum = (t) => (t || '').replace(/:/g, '') + '00'
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const hasTime = Boolean(time && /^\d{2}:\d{2}/.test(time))
  const startDate = dateNum(date)
  const start = hasTime ? startDate + 'T' + timeNum(time) : startDate
  const end = hasTime
    ? startDate + 'T' + timeNum(endTime || addHours(time, 5))
    : startDate
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mentari Wedding//Wedding Moodboard//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:' + Date.now() + '@mentariwedding',
    'DTSTAMP:' + now + 'Z',
    hasTime ? 'DTSTART:' + start : 'DTSTART;VALUE=DATE:' + start,
    hasTime ? 'DTEND:' + end : 'DTEND;VALUE=DATE:' + end,
    'SUMMARY:' + esc(summary),
  ]
  if (location) lines.push('LOCATION:' + esc(location))
  if (description) lines.push('DESCRIPTION:' + esc(description))
  lines.push('END:VEVENT', 'END:VCALENDAR')
  return lines.join('\r\n')
}

function addHours(time, h) {
  const [hh, mm] = time.split(':').map(Number)
  const total = (hh + h) % 24
  return String(total).padStart(2, '0') + ':' + String(mm).padStart(2, '0')
}

/** Unduh file kalender (.ics). */
export function downloadIcs(filename, content) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** Waktu relatif: 'baru saja', '5 menit lalu', '2 jam lalu', '3 hari lalu'. */

export function timeAgo(iso) {
  if (!iso) return ''
  const t = new Date(iso).getTime()
  if (isNaN(t)) return ''
  const diff = Date.now() - t
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'baru saja'
  if (m < 60) return m + ' menit lalu'
  const h = Math.floor(m / 60)
  if (h < 24) return h + ' jam lalu'
  const d = Math.floor(h / 24)
  if (d < 30) return d + ' hari lalu'
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function daysUntil(iso) {
  if (!iso) return null
  const target = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''))
  if (isNaN(target)) return null
  return Math.ceil((target - new Date(new Date().toDateString())) / 86400000)
}

/** Ambil warna aksen pertama dari palet client (untuk UI dinamis). */
export function accentFromPalette(palette = []) {
  const light = ['#F4DADB', '#F7F2E9', '#F9E2C9', '#FFFFFF', '#F2EDE4', '#E8E4DE', '#E8D5E8', '#F6C6C6', '#C9D8E8']
  const usable = palette.filter((c) => c && c !== '#FFFFFF' && !light.includes(c.toUpperCase()))
  return usable[0] || '#B08D57'
}

/** Warna lebih terang untuk gradient/ring. */
export function lighten(hex, amt = 0.55) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const num = parseInt(full, 16)
  if (isNaN(num)) return '#D6BE93'
  const r = Math.min(255, Math.round(((num >> 16) & 255) + (255 - ((num >> 16) & 255)) * amt))
  const g = Math.min(255, Math.round(((num >> 8) & 255) + (255 - ((num >> 8) & 255)) * amt))
  const b = Math.min(255, Math.round((num & 255) + (255 - (num & 255)) * amt))
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

/** Teks kontras (putih/hitam) di atas warna aksen. */
export function contrastText(hex) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const num = parseInt(full, 16)
  if (isNaN(num)) return '#fff'
  const yiq = ((num >> 16) & 255) * 299 + ((num >> 8) & 255) * 587 + (num & 255) * 114
  return yiq >= 150000 ? '#2B2622' : '#FFFFFF'
}

/** Susun ringkasan konsep otomatis dari jawaban client. */
export function generateConcept(data) {
  const d = data || {}
  const couple = d.couple || {}
  const vibe = d.vibe || {}
  const colors = d.colors || {}
  const decor = d.decor || {}
  const look = d.look || {}
  const ceremony = d.ceremony || {}
  const feast = d.feast || {}
  const photo = d.photo || {}
  const priorities = d.priorities || {}
  const who = [couple.brideName, couple.groomName].filter(Boolean).join(' & ') || 'Kalian berdua'

  const themeNames = (vibe.themes || []).map((t) => THEMES.find((x) => x.id === t)?.label || t)
  const vibes = vibe.vibes || []
  const pal = colors.paletteName || (colors.palette?.length ? 'palet custom' : '')

  const parts = []
  const mood = [themeNames.join(' & '), vibes.join(', ')].filter(Boolean).join(' dengan nuansa ')
  if (mood) parts.push(`Konsep utamanya adalah ${mood}`)
  else parts.push('Konsep utamanya masih terbuka')

  const accents = []
  if (pal) accents.push(`palet ${pal.toLowerCase()}`)
  if (decor.flowersSource) accents.push(`bunga ${decor.flowersSource.toLowerCase()}`)
  if (decor.lighting?.length) accents.push(`pencahayaan ${decor.lighting.slice(0, 2).join(' & ').toLowerCase()}`)
  if (accents.length) parts.push(`dipertegas dengan ${accents.join(', ')}`)

  if (ceremony.format) parts.push(`acara berformat ${ceremony.format.toLowerCase()}`)
  if (look.dress) parts.push(`busana ${look.dress.toLowerCase()}`)
  if (feast.style) parts.push(`hidangan ${feast.style.toLowerCase()}`)

  const top = (priorities.top3 || []).map((t) => PRIORITY_ITEMS.find((p) => p.id === t)?.label || t)
  if (top.length) parts.push(`fokus utama ada di ${top.join(', ').toLowerCase()}`)

  if (photo.styles?.length) parts.push(`dengan gaya foto ${photo.styles.slice(0, 2).join(' & ').toLowerCase()}`)
  if ((data.playlist?.songs || []).length) parts.push('lengkap dengan playlist lagu pilihan kalian')

  const avoid = []
  if (colors.avoid?.filter(Boolean).length) avoid.push('warna ' + colors.avoid.filter(Boolean).join(' & '))
  if (d.avoid?.themes && String(d.avoid.themes).trim()) {
    const t = String(d.avoid.themes).trim().replace(/^tema\s+/i, '')
    avoid.push('tema ' + t)
  }
  if (avoid.length) parts.push(`sementara yang dihindari adalah ${avoid.join(' dan ')}`)

  const out = `${who}, pernikahan impian kalian kami bayangkan sebagai berikut. ${parts.join('; ')}.`
  return out
}

/** Gabungkan dua isian (mempelai 1 & 2) untuk dashboard. */
export function mergeMoodboards(a = {}, b = {}) {
  const pick = (x, y, key) => (x && x[key] ? x[key] : y && y[key] ? y[key] : '')
  const mergeArr = (x, y, key) => [...new Set([...(x?.[key] || []), ...(y?.[key] || [])])]
  const mergeNotes = (x, y, key) => [x?.[key], y?.[key]].filter(Boolean).join('\n')
  const prefer = (x, y, key) => (x && x[key] ? x[key] : y && y[key] ? y[key] : '')

  return {
    couple: {
      brideName: pick(a.couple, b.couple, 'brideName'),
      groomName: pick(a.couple, b.couple, 'groomName'),
      wa: [a.couple?.wa, b.couple?.wa].filter(Boolean).join(' / '),
      weddingDate: pick(a.couple, b.couple, 'weddingDate'),
      city: pick(a.couple, b.couple, 'city'),
      venue: pick(a.couple, b.couple, 'venue'),
      guests: pick(a.couple, b.couple, 'guests'),
      budget: pick(a.couple, b.couple, 'budget'),
    },
    vibe: {
      themes: mergeArr(a.vibe, b.vibe, 'themes'),
      vibes: mergeArr(a.vibe, b.vibe, 'vibes'),
      keywords: [a.vibe?.keywords, b.vibe?.keywords].filter(Boolean).join(' · '),
    },
    colors: {
      paletteName: prefer(a.colors, b.colors, 'paletteName'),
      palette: (a.colors?.palette?.length ? a.colors.palette : b.colors?.palette || []),
      avoid: [...new Set([...(a.colors?.avoid || []), ...(b.colors?.avoid || [])].filter(Boolean))].slice(0, 4),
    },
    decor: {
      stage: prefer(a.decor, b.decor, 'stage'),
      flowersSource: prefer(a.decor, b.decor, 'flowersSource'),
      flowersLike: mergeArr(a.decor, b.decor, 'flowersLike'),
      lighting: mergeArr(a.decor, b.decor, 'lighting'),
      tables: prefer(a.decor, b.decor, 'tables'),
      signage: mergeArr(a.decor, b.decor, 'signage'),
      notes: mergeNotes(a.decor, b.decor, 'notes'),
    },
    look: {
      dress: prefer(a.look, b.look, 'dress'),
      dressAccent: prefer(a.look, b.look, 'dressAccent'),
      makeup: prefer(a.look, b.look, 'makeup'),
      groom: prefer(a.look, b.look, 'groom'),
      accessories: mergeNotes(a.look, b.look, 'accessories'),
      notes: mergeNotes(a.look, b.look, 'notes'),
    },
    ceremony: {
      format: prefer(a.ceremony, b.ceremony, 'format'),
      time: prefer(a.ceremony, b.ceremony, 'time'),
      traditions: mergeArr(a.ceremony, b.ceremony, 'traditions'),
      entertainment: mergeArr(a.ceremony, b.ceremony, 'entertainment'),
      music: mergeArr(a.ceremony, b.ceremony, 'music'),
      notes: mergeNotes(a.ceremony, b.ceremony, 'notes'),
    },
    feast: {
      style: prefer(a.feast, b.feast, 'style'),
      mustHave: mergeNotes(a.feast, b.feast, 'mustHave'),
      allergies: mergeNotes(a.feast, b.feast, 'allergies'),
      cake: prefer(a.feast, b.feast, 'cake'),
      notes: mergeNotes(a.feast, b.feast, 'notes'),
    },
    stationery: {
      type: prefer(a.stationery, b.stationery, 'type'),
      style: mergeArr(a.stationery, b.stationery, 'style'),
      monogram: prefer(a.stationery, b.stationery, 'monogram'),
      notes: mergeNotes(a.stationery, b.stationery, 'notes'),
    },
    photo: {
      styles: mergeArr(a.photo, b.photo, 'styles'),
      mustShots: mergeArr(a.photo, b.photo, 'mustShots'),
      notes: mergeNotes(a.photo, b.photo, 'notes'),
    },
    priorities: {
      top3: mergeArr(a.priorities, b.priorities, 'top3').slice(0, 3),
      ratings: (() => {
        const r = {}
        PRIORITY_ITEMS.forEach((p) => {
          const va = a.priorities?.ratings?.[p.id]
          const vb = b.priorities?.ratings?.[p.id]
          r[p.id] = va && vb ? Math.max(va, vb) : va || vb || 3
        })
        return r
      })(),
      notes: mergeNotes(a.priorities, b.priorities, 'notes'),
    },
    playlist: {
      songs: [...(a.playlist?.songs || []), ...(b.playlist?.songs || [])],
      doNotPlay: mergeNotes(a.playlist, b.playlist, 'doNotPlay'),
      notes: mergeNotes(a.playlist, b.playlist, 'notes'),
    },
    avoid: {
      colors: [...new Set([...(a.avoid?.colors || []), ...(b.avoid?.colors || [])].filter(Boolean))].slice(0, 4),
      themes: mergeNotes(a.avoid, b.avoid, 'themes'),
      notes: mergeNotes(a.avoid, b.avoid, 'notes'),
    },
    references: {
      images: [...(a.references?.images || []), ...(b.references?.images || [])],
      links: [...new Set([...(a.references?.links || []), ...(b.references?.links || [])])],
      _concept: a.references?._concept || b.references?._concept || '',
    },
  }
}

/** Ambil info embed (YouTube/Spotify) dari link — untuk media player. */
export function getEmbedInfo(url) {
  if (!url) return null
  try {
    const u = new URL(url)
    const host = u.hostname.replace('www.', '')
    // YouTube: watch?v=, youtu.be/, shorts/, embed/, live/
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      let id = null
      if (host === 'youtu.be') id = u.pathname.split('/')[1]
      else if (u.pathname.startsWith('/shorts/')) id = u.pathname.split('/')[2]
      else if (u.pathname.startsWith('/embed/')) id = u.pathname.split('/')[2]
      else if (u.pathname.startsWith('/live/')) id = u.pathname.split('/')[2]
      else id = u.searchParams.get('v')
      if (id && /^[\w-]{11}$/.test(id)) {
        return {
          type: 'youtube',
          id,
          embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
          thumb: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        }
      }
    }
    // Spotify: open.spotify.com/track/ID (juga album/playlist/episode)
    if (host.includes('spotify.com')) {
      const parts = u.pathname.split('/').filter(Boolean)
      if (parts.length >= 2 && parts[0] === 'embed') {
        return { type: 'spotify', id: parts[2] || '', embedUrl: url, thumb: '' }
      }
      if (parts.length >= 2 && ['track', 'album', 'playlist', 'episode', 'show'].includes(parts[0])) {
        return {
          type: parts[0] === 'track' ? 'spotify' : 'spotify-' + parts[0],
          id: parts[1],
          embedUrl: `https://open.spotify.com/embed/${parts[0]}/${parts[1]}`,
          thumb: '',
        }
      }
    }
  } catch {}
  return null
}

/** Ubah array of objects jadi CSV (dengan kutip & escape). */
export function toCsv(rows) {
  if (!rows.length) return ''
  const keys = Object.keys(rows[0])
  const esc = (v) => {
    if (v == null) return ''
    const s = String(v)
    return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }
  const lines = [keys.map(esc).join(',')]
  rows.forEach((r) => lines.push(keys.map((k) => esc(r[k])).join(',')))
  return lines.join('\n')
}

/** Unduh CSV sebagai file. */
export function downloadCsv(filename, content) {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** Pesan WA pengingat untuk client yang belum selesai mengisi. */
export function waReminderUrl(token, coupleName, number, label) {
  const url = shareUrl(token, undefined, coupleName)
  const who = coupleName || 'kamu'
  const whoLabel = label ? ` (${label})` : ''
  const text = `Halo ${who}${whoLabel} 🌸\nIni kami dari Mentari Wedding — sekadar mengingatkan, moodboard pernikahan kalian masih menunggu isian (bisa disimpan sebagai draft dan dilanjut kapan saja).\n\nKlik di sini:\n${url}\n\nKalau ada kendala, tinggal balas pesan ini ya. Terima kasih!`
  const num = waNumber(number)
  return `https://wa.me/${num ? num : ""}?text=${encodeURIComponent(text)}`
}

/** Isi file → dataURL JPEG yang sudah dikompres (max ~800px). */
export function compressImage(file, maxW = 900, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Gagal membaca file'))
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = () => reject(new Error('File bukan gambar'))
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

/** Berapa seksi yang sudah diisi (0..1). */
export function filledSections(data) {
  if (!data) return 0
  const filled = SECTION_IDS.filter((id) => isSectionFilled(data[id])).length
  return filled
}

export function computeProgress(data) {
  return Math.round((filledSections(data) / SECTION_IDS.length) * 100)
}

function hasValue(v) {
  if (v == null) return false
  if (typeof v === 'string') return v.trim() !== ''
  if (typeof v === 'number') return true
  if (Array.isArray(v)) return v.some(hasValue)
  if (typeof v === 'object') return Object.values(v).some(hasValue)
  return false
}

export function isSectionFilled(section) {
  if (!section || typeof section !== 'object') return false
  // couple: minimal nama kedua mempelai (tanggal boleh dikosongkan dulu)
  if (section.brideName !== undefined) {
    return Boolean(section.brideName?.trim() && section.groomName?.trim())
  }
  return Object.values(section).some(hasValue)
}

export function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

export function copyText(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text)
  const ta = document.createElement('textarea')
  ta.value = text
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  ta.remove()
  return Promise.resolve()
}
