// ============================================================
// Konten moodboard — semua seksi, opsi & pilihan untuk client
// Bahasa campur Indonesia-English sesuai gaya wedding
// ============================================================

export const BRAND = {
  name: 'Mentari Wedding',
  tagline: 'The Wedding Moodboard',
}

export const SECTIONS = [
  { id: 'couple', en: 'The Couple', idn: 'Data Pasangan', icon: 'couple' },
  { id: 'vibe', en: 'The Vibe', idn: 'Tema & Konsep', icon: 'vibe' },
  { id: 'colors', en: 'Color Palette', idn: 'Palet Warna', icon: 'colors' },
  { id: 'decor', en: 'Décor & Flowers', idn: 'Dekorasi & Bunga', icon: 'decor' },
  { id: 'look', en: 'The Look', idn: 'Busana & Rias', icon: 'look' },
  { id: 'ceremony', en: 'The Ceremony', idn: 'Rangkaian Acara', icon: 'ceremony' },
  { id: 'playlist', en: 'The Playlist', idn: 'Musik & Lagu', icon: 'music' },
  { id: 'feast', en: 'The Feast', idn: 'Makanan & Katering', icon: 'feast' },
  { id: 'stationery', en: 'Stationery', idn: 'Undangan & Branding', icon: 'stationery' },
  { id: 'photo', en: 'Captured Moments', idn: 'Foto & Video', icon: 'photo' },
  { id: 'priorities', en: 'Priorities', idn: 'Prioritas Hari-H', icon: 'priorities' },
  { id: 'avoid', en: 'Never Ever', idn: 'Hal yang Dihindari', icon: 'avoid' },
  { id: 'references', en: 'References', idn: 'Referensi & Inspirasi', icon: 'references' },
]

export const SECTION_IDS = SECTIONS.map((s) => s.id)

// Bab wizard — memberi rasa 'bercerita' alih-alih 13 langkah
export const WIZARD_CHAPTERS = [
  { id: 'dasar', label: 'Tentang Kalian', sub: 'cerita & warna kalian', icon: 'heart' },
  { id: 'hari', label: 'Hari Bahagia', sub: 'dekorasi, acara & musik', icon: 'ceremony' },
  { id: 'detail', label: 'Detail & Sentuhan', sub: 'undangan, foto & prioritas', icon: 'gem' },
  { id: 'final', label: 'Sentuhan Akhir', sub: 'hal yang dihindari & referensi', icon: 'magic' },
]

// Peta seksi → bab (index)
export const CHAPTER_OF_SECTION = {
  couple: 0, vibe: 0, colors: 0,
  decor: 1, look: 1, ceremony: 1, playlist: 1, feast: 1,
  stationery: 2, photo: 2, priorities: 2,
  avoid: 3, references: 3,
}

export const THEMES = [
  { id: 'garden', label: 'Garden', sub: 'hijau segar · romantis · outdoor', img: '/themes/garden.jpg' },
  { id: 'rustic', label: 'Rustic', sub: 'kayu hangat · natural · cozy', img: '/themes/rustic.jpg' },
  { id: 'minimalist', label: 'Minimalist', sub: 'bersih · modern · elegan', img: '/themes/minimalist.jpg' },
  { id: 'classic', label: 'Classic Elegant', sub: 'ballroom · mewah · timeless', img: '/themes/classic.jpg' },
  { id: 'vintage', label: 'Vintage', sub: 'antik · lace · pastel lembut', img: '/themes/vintage.jpg' },
  { id: 'bohemian', label: 'Bohemian', sub: 'pampas · earthy · santai', img: '/themes/bohemian.jpg' },
  { id: 'tropical', label: 'Tropical', sub: 'monstera · cerah · resort', img: '/themes/tropical.jpg' },
  { id: 'royal', label: 'Royal Luxury', sub: 'emas · megah · mewah', img: '/themes/royal.jpg' },
  { id: 'modernmuslim', label: 'Modern Muslim', sub: 'elegan · modest · syar\u2019i', img: '/themes/modernmuslim.jpg' },
  { id: 'javanese', label: 'Adat Jawa', sub: 'pelaminan · batik · tradisional', img: '/themes/javanese.jpg' },
]

export const VIBES = [
  'Romantis', 'Mewah / Glamour', 'Santai & Hangat', 'Ceria & Fun',
  'Tenang & Minimalis', 'Dramatis', 'Natural / Earthy', 'Modern & Trendy',
]

export const COLOR_PRESETS = [
  { id: 'blush', name: 'Blush & Gold', colors: ['#F4DADB', '#C98A8A', '#B08D57', '#FFFFFF'] },
  { id: 'ivory', name: 'Ivory & Sage', colors: ['#F7F2E9', '#8A9B83', '#D6BE93', '#FFFFFF'] },
  { id: 'dusty', name: 'Dusty Blue', colors: ['#A9BCC6', '#7D9AA8', '#F2EDE4', '#FFFFFF'] },
  { id: 'forest', name: 'Forest & Cream', colors: ['#3F5242', '#C9BDA4', '#F2EDE4', '#FFFFFF'] },
  { id: 'terracotta', name: 'Terracotta', colors: ['#C97B5D', '#E8C39E', '#6B4F3A', '#F7F2E9'] },
  { id: 'royalred', name: 'Royal Red & Gold', colors: ['#8C1F28', '#B08D57', '#2B2622', '#F7F2E9'] },
  { id: 'pastel', name: 'Pastel Dream', colors: ['#F6C6C6', '#F9E2C9', '#C9D8E8', '#E8D5E8'] },
  { id: 'mono', name: 'Black & White', colors: ['#1B1B1B', '#8A8A8A', '#E8E4DE', '#FFFFFF'] },
]

// Warna aksen untuk UI dinamis per nama palet
export const PALETTE_META = {
  'Blush & Gold': '#C98A8A',
  'Ivory & Sage': '#8A9B83',
  'Dusty Blue': '#7D9AA8',
  'Forest & Cream': '#3F5242',
  'Terracotta': '#C97B5D',
  'Royal Red & Gold': '#8C1F28',
  'Pastel Dream': '#E8B4B8',
  'Black & White': '#1B1B1B',
}

export const FLOWERS = [
  'Mawar / Rose', 'Tulip', 'Peony', 'Hydrangea', 'Baby Breath', 'Orchid',
  'Melati / Jasmine', 'Anggrek', 'Eucalyptus', 'Pampas Grass', 'Lily',
  'Calla Lily', 'Daisy', 'Bunga Kering / Dried',
]

export const LIGHTING = [
  'String Light', 'Chandelier', 'Candle / Lilin', 'Uplighting',
  'Fairy Light', 'Lantern / Lentera', 'Lampu Gantung Edison',
]

export const SIGNAGE = [
  'Welcome Sign', 'Guest Book', 'Papan Photo Booth', 'Hiasan Aisle',
  'Hampers Table', 'Backdrop Foto', 'Signage Arah / Peta',
]

export const STAGE_STYLES = [
  'Pelaminan Tradisional', 'Backdrop Bunga Penuh', 'Arch / Gapura Bunga',
  'Minimalis Modern', 'Tirai / Drapery', 'Mix & Match',
]

export const FLOWER_SOURCES = ['Bunga Asli', 'Artificial', 'Campuran', 'Belum Tahu']

export const DRESS_STYLES = [
  'A-Line', 'Mermaid', 'Ball Gown', 'Kebaya Modern',
  'Kebaya Tradisional', 'Slip / Simple', 'Two-Piece', 'Princess / Puteri',
]

export const MAKEUP_STYLES = [
  'Natural / No-Makeup Look', 'Soft Glam', 'Full Glam', 'Bold Lip', 'Korean Style',
]

export const GROOM_STYLES = [
  'Jas Hitam Klasik', 'Jas Putih', 'Tuksedo', 'Setelan Safari',
  'Kemeja + Celana Rapi', 'Beskap Jawa',
]

export const CEREMONY_FORMATS = [
  'Akad + Resepsi', 'Akad Saja', 'Resepsi Saja', 'Adat + Akad + Resepsi',
]

export const TRADITIONS = [
  'Seserahan', 'Siraman', 'Midodareni', 'Panggih', 'Sungkeman',
  'Saweran', 'Hantaran', 'Mapag Pengantin', 'Tepung Tawar', 'Tidak ada adat khusus',
]

export const ENTERTAINMENT = [
  'Band Live', 'Akustik / Solo Singer', 'DJ', 'Gamelan', 'Hadroh / Nasyid',
  'Saxophone', 'Angklung', 'Tari Tradisional', 'Tanpa Hiburan',
]

export const MUSIC_STYLES = [
  'Jazz / Lounge', 'Pop Indonesia', 'Akustik Romantic', 'Slow Rock',
  'Dangdut', 'Campur Sari', 'Classical', 'EDM / Party',
]

export const FOOD_STYLES = [
  'Prasmanan / Buffet', 'Plated / Fine Dining', 'Food Station',
  'Cocktail Party', 'Nasi Kotak / Box',
]

export const CAKE_STYLES = [
  'Classic White', 'Bunga Segar', 'Gold Accent', 'Naked Cake',
  'Modern Sculpture', 'Tanpa Kue Pengantin',
]

export const STATIONERY_TYPES = ['Undangan Fisik', 'E-Invitation / Digital', 'Keduanya']

export const STATIONERY_STYLES = [
  'Minimalis', 'Floral', 'Calligraphy', 'Watercolor', 'Gold Foil', 'Vintage', 'Modern Geometric',
]

export const MONOGRAM_STYLES = [
  'Inisial dalam lingkaran', 'Nama lengkap', 'Logo / simbol custom', 'Tanpa monogram',
]

export const PHOTO_STYLES = [
  'Candid / Natural', 'Editorial / Majalah', 'Traditional / Poses',
  'Documentary', 'Film / Analog Look', 'Golden Hour',
]

export const MUST_SHOTS = [
  'Pertukaran cincin', 'Momen haru / menangis', 'Seserahan', 'Foto keluarga besar',
  'Detail dekorasi', 'Momen party', 'Sungkeman', 'Getting ready', 'First look',
]

export const PRIORITY_ITEMS = [
  { id: 'decor', label: 'Dekorasi', icon: 'leaf' },
  { id: 'food', label: 'Makanan', icon: 'feast' },
  { id: 'photo', label: 'Foto & Video', icon: 'photo' },
  { id: 'outfit', label: 'Busana & Rias', icon: 'look' },
  { id: 'entertainment', label: 'Hiburan', icon: 'guitar' },
]

export const BUDGET_RANGES = [
  '< 50 juta', '50 – 100 juta', '100 – 250 juta', '250 – 500 juta', '> 500 juta', 'Belum tahu / diskusi dulu',
]

export const GUEST_RANGES = ['< 100', '100 – 300', '300 – 500', '500 – 1000', '> 1000', 'Belum pasti']

export const EMPTY_DATA = {
  couple: { brideName: '', groomName: '', wa: '', weddingDate: '', city: '', venue: '', guests: '', budget: '' },
  vibe: { themes: [], keywords: '', vibes: [] },
  colors: { palette: [], paletteName: '', avoid: ['', ''] },
  decor: { stage: '', flowersSource: '', flowersLike: [], lighting: [], tables: '', signage: [], notes: '' },
  look: { dress: '', dressAccent: '', makeup: '', groom: '', accessories: '', notes: '' },
  ceremony: { format: '', time: '', traditions: [], entertainment: [], music: [], notes: '' },
  feast: { style: '', mustHave: '', allergies: '', cake: '', notes: '' },
  stationery: { type: '', style: [], monogram: '', notes: '' },
  photo: { styles: [], mustShots: [], notes: '' },
  priorities: { top3: [], ratings: {}, notes: '' },
  avoid: { colors: ['', ''], themes: '', notes: '' },
  playlist: { songs: [], doNotPlay: '', notes: '' },
  references: { images: [], links: [] },
}
