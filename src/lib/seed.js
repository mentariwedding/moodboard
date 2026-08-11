// Seed proyek demo — hanya aktif di mode demo (tanpa Supabase),
// supaya halaman dashboard & link /mb/demo punya contoh isian.
// Proyek demo memakai "mode isi bareng": mempelai 1 & 2 punya isian masing-masing.
import { EMPTY_DATA } from '../lib/constants'

const DEMO_TOKEN = 'demo'

/** Data contoh lengkap (mempelai 1 & 2). */
export function buildDemoData() {
  const blank = () => JSON.parse(JSON.stringify(EMPTY_DATA))
  const one = blank()
  one.couple = { brideName: 'Salsabila Putri', groomName: '', wa: '081234567890', weddingDate: '2026-12-12', city: 'Bandung', venue: 'The Lodge Maribaya, Lembang', guests: '100 – 300', budget: '100 – 250 juta' }
  one.vibe = { themes: ['garden', 'rustic'], keywords: 'hangat, elegan, penuh tawa', vibes: ['Romantis', 'Santai & Hangat'] }
  one.colors = { paletteName: 'Blush & Gold', palette: ['#F4DADB', '#C98A8A', '#B08D57', '#FFFFFF'], avoid: ['Merah menyala', ''] }
  one.decor = { stage: 'Arch / Gapura Bunga', flowersSource: 'Campuran', flowersLike: ['Mawar / Rose', 'Baby Breath', 'Eucalyptus'], lighting: ['String Light', 'Candle / Lilin'], tables: 'Meja panjang family style', signage: ['Welcome Sign', 'Guest Book', 'Backdrop Foto'], notes: 'Pengen ada taman kecil di depan pelaminan.' }
  one.look = { dress: 'A-Line', dressAccent: 'Lace / renda', makeup: 'Soft Glam', groom: '', accessories: '', notes: 'Pakai veil panjang, sepatu harus nyaman.' }
  one.ceremony = { format: 'Akad + Resepsi', time: '09:00', traditions: ['Seserahan', 'Sungkeman'], entertainment: ['Akustik / Solo Singer'], music: ['Akustik Romantic', 'Jazz / Lounge'], notes: 'Akadnya khidmat, resepsinya meriah.' }
  one.feast = { style: 'Prasmanan / Buffet', mustHave: 'Rendang, sate ayam', allergies: 'Seafood (ada tamu alergi)', cake: 'Bunga Segar', notes: '' }
  one.stationery = { type: 'Keduanya', style: ['Floral', 'Calligraphy'], monogram: 'Inisial dalam lingkaran', fontStyle: 'elegant-script', notes: 'Bilingual ID-EN.' }
  one.photo = { styles: ['Candid / Natural', 'Golden Hour'], mustShots: ['Pertukaran cincin', 'Momen haru / menangis', 'Foto keluarga besar'], notes: 'Pengen ada video cinematic 3 menit.' }
  one.priorities = { top3: ['photo', 'decor', 'food'], ratings: { decor: 4, food: 3, photo: 5, outfit: 4, entertainment: 2 }, notes: '' }
  one.avoid = { colors: ['Merah menyala', ''], themes: '', notes: 'Tidak mau sambutan terlalu panjang.' }
  one.playlist = { songs: [{ moment: 'Akad / Prosesi', title: 'Perfect — Ed Sheeran', url: 'https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v' }, { moment: 'Resepsi / Party', title: 'Cinta Terbaik — Cassandra', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }], doNotPlay: 'Lagu yang terlalu sedih', notes: 'First dance belum diputuskan.' }
  one.references = { images: [], links: ['https://pin.it/example-garden-wedding', 'https://instagram.com/p/example-floral-arch'], liked: ['g1', 'g4', 'g7'] }
  one.references._concept = 'Konsep utamanya adalah garden & rustic dengan nuansa romantis dan santai, dipertegas dengan palet blush & gold; acara berformat akad dan resepsi dengan fokus utama di foto, dekorasi, dan makanan.'
  one._submitted = true

  const two = blank()
  two.couple = { brideName: '', groomName: 'Raka Pratama', wa: '081298765432', weddingDate: '2026-12-12', city: '', venue: '', guests: '', budget: '' }
  two.vibe = { themes: ['modernmuslim'], keywords: 'khidmat, modern', vibes: ['Tenang & Minimalis'] }
  two.colors = { paletteName: 'Ivory & Sage', palette: ['#F7F2E9', '#8A9B83', '#D6BE93', '#FFFFFF'], avoid: ['', ''] }
  two.decor = { stage: '', flowersSource: '', flowersLike: ['Orchid'], lighting: [], tables: '', signage: [], notes: 'Yang penting tidak terlalu ramai.' }
  two.priorities = { top3: ['food'], ratings: { decor: 3, food: 5, photo: 3, outfit: 3, entertainment: 1 }, notes: '' }
  two.avoid = { colors: ['', ''], themes: 'Hindari tema yang terlalu ramai', notes: '' }
  two.references = { images: [], links: [] }

  return {
    project: {
      token: DEMO_TOKEN,
      couple: 'Salsabila & Raka',
      venue: 'The Lodge Maribaya, Lembang',
      date: '2026-12-12',
      note: 'Proyek contoh — coba buka link dan lihat tampilan dari sisi client.',
      status: 'invited',
      couple_mode: true,
      pin: '1234',
      client_wa: '081234567890',
      staff_notes: { decor: 'Ganti bunga jadi artificial — budget', look: 'Gaun coba warna ivory' },
    },
    moodboard: {
      data: { coupleData: { one, two } },
      is_draft: true,
      submitted_at: null,
      comments: {
        colors: [
          { id: 'c1', author: 'wo', text: 'Halo! Boleh kami sarankan palet yang lebih hangat? Kalau kurang sreg, biarkan dulu ya — nanti kita diskusi saat rapat desain.', at: new Date(Date.now() - 3600000).toISOString() },
        ],
      },
    },
  }
}

export function seedDemoIfNeeded() {
  if (typeof localStorage === 'undefined') return
  const all = JSON.parse(localStorage.getItem('mw_demo_projects') || '{}')
  if (all[DEMO_TOKEN]) return

  const demo = buildDemoData()
  all[DEMO_TOKEN] = {
    ...demo.project,
    created: new Date(Date.now() - 86400000).toISOString(),
    data: demo.moodboard.data,
    comments: demo.moodboard.comments,
    is_draft: demo.moodboard.is_draft,
    submitted_at: demo.moodboard.submitted_at,
    updated_at: new Date().toISOString(),
  }
  localStorage.setItem('mw_demo_projects', JSON.stringify(all))
}

/** Seed contoh demo ke Supabase (dipanggil sekali saat app start). */
export async function seedDemoToSupabase() {
  const { supabase, isSupabaseConfigured, TABLE } = await import('./supabase')
  if (!isSupabaseConfigured) return
  try {
    const demo = buildDemoData()
    // Proyek
    const { error: pErr } = await supabase.from(TABLE('projects')).upsert(
      { ...demo.project, created_at: new Date().toISOString() },
      { onConflict: 'token' },
    )
    if (pErr) throw pErr
    // Moodboard
    const { error: mErr } = await supabase.from(TABLE('moodboards')).upsert(
      {
        project_id: DEMO_TOKEN,
        data: demo.moodboard.data,
        is_draft: demo.moodboard.is_draft,
        submitted_at: demo.moodboard.submitted_at,
        comments: demo.moodboard.comments,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'project_id' },
    )
    if (mErr) throw mErr
  } catch (e) {
    // Tidak fatal — biarkan dashboard menangani
    console.warn('[mw] Seed demo ke Supabase gagal:', e?.message || e)
  }
}
