import { Link } from 'react-router-dom'
import { Btn } from '../components/ui'
import { SECTIONS } from '../lib/constants'
import Icon from '../lib/icons'
import Flourish from '../components/Flourish'
import Petals from '../components/Petals'

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-wedding-pattern bg-ivory">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <Petals count={12} />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-goldlight/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-40 h-80 w-80 rounded-full bg-blush/20 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-14 sm:py-20">
          <p className="text-center text-xs uppercase tracking-[0.35em] text-gold">Mentari Wedding</p>
          <h1 className="mt-3 text-center font-display text-5xl leading-[1.05] text-ink sm:text-7xl">
            The Wedding<br />Moodboard
          </h1>
          <div className="mt-4 flex justify-center">
            <Flourish />
          </div>
          <p className="mx-auto mt-2 max-w-xl text-center font-script text-3xl text-gold sm:text-4xl">
            every love story deserves a beautiful beginning
          </p>
          <p className="mx-auto mt-5 max-w-xl text-center text-stone sm:text-lg">
            Satu link untuk tahu <i>semua</i> keinginan pasangan — tanpa bolak-balik chat.
            Client isi sendiri, kamu tinggal lihat hasilnya yang rapi.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/dashboard"><Btn kind="gold" size="lg"><Icon name="clipboardCheck" className="h-4 w-4" /> Buka Dashboard WO</Btn></Link>
            <Link to="/mb/demo?who=one"><Btn kind="outline" size="lg"><Icon name="eye" className="h-4 w-4" /> Coba isi moodboard contoh</Btn></Link>
          </div>
          {/* hero collage */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {['garden', 'royal', 'minimalist', 'bohemian'].map((t, i) => (
              <div key={t} className={`overflow-hidden rounded-2xl shadow-soft ${i === 1 || i === 2 ? 'translate-y-4' : ''}`}>
                <img src={`/themes/${t}.jpg`} alt={t} className="aspect-[3/4] w-full object-cover transition duration-500 hover:scale-105" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Cara kerja */}
      <section id="cara" className="scroll-mt-6 border-t border-ink/5 bg-white/60 py-14">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center font-display text-3xl text-ink">Cara kerjanya, 3 langkah</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              ['1', 'circlePlus', 'Buat proyek', 'Masukkan nama pasangan & tanggal — sistem langsung membuat link khusus untuk mereka.'],
              ['2', 'wa', 'Kirim link ke client', 'Sekali kirim via WhatsApp. Client membuka link di HP-nya, tanpa perlu daftar akun.'],
              ['3', 'clipboardCheck', 'Terima hasil rapi', 'Begitu client submit, hasilnya tersusun rapi per kategori di dashboard — lengkap dengan foto referensi.'],
            ].map(([n, icon, title, desc]) => (
              <div key={n} className="relative rounded-2xl border border-ink/5 bg-ivory p-6 text-center shadow-card">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-ink px-3 py-0.5 text-xs text-ivory">{n}</span>
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-goldlight/30 text-gold">
                  <Icon name={icon} className="h-5 w-5" />
                </span>
                <p className="mt-3 font-display text-xl text-ink">{title}</p>
                <p className="mt-1.5 text-sm text-stone">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fitur */}
      <section id="fitur" className="scroll-mt-6 py-14">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center font-display text-3xl text-ink">Isi moodboard yang lengkap</h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-sm text-stone">
            Client tidak perlu menulis esai — cukup klik pilihan, geser prioritas, dan upload foto.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {SECTIONS.map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-2xl border border-ink/5 bg-white px-4 py-3.5 shadow-card">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream text-gold">
                  <Icon name={s.icon} className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{s.en}</p>
                  <p className="truncate text-xs text-stone">{s.idn}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/dashboard"><Btn kind="gold" size="lg">Mulai Sekarang <Icon name="arrowRight" className="h-4 w-4" /></Btn></Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink/5 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-stone transition hover:text-gold"><Icon name="clipboardCheck" className="h-3.5 w-3.5" /> Dashboard WO</Link>
            <Link to="/mb/demo?who=one" className="inline-flex items-center gap-1.5 text-stone transition hover:text-gold"><Icon name="eye" className="h-3.5 w-3.5" /> Coba contoh client</Link>
            <a href="#fitur" className="inline-flex items-center gap-1.5 text-stone transition hover:text-gold"><Icon name="gem" className="h-3.5 w-3.5" /> Fitur</a>
            <a href="#cara" className="inline-flex items-center gap-1.5 text-stone transition hover:text-gold"><Icon name="info" className="h-3.5 w-3.5" /> Cara kerja</a>
          </div>
          <p className="inline-flex items-center justify-center gap-1.5 text-xs text-stone/70">
            <Icon name="brand" className="h-3.5 w-3.5 text-gold" /> Mentari Wedding — The Wedding Moodboard · {new Date().getFullYear()} · dibangun untuk mempermudah komunikasi WO & client
          </p>
        </div>
      </footer>
    </div>
  )
}
