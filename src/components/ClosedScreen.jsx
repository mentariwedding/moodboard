import { Link } from 'react-router-dom'
import Icon from '../lib/icons'
import Flourish from './Flourish'
import Petals from './Petals'

/**
 * Layar "moodboard sudah diproses" — muncul saat WO menandai proyek selesai.
 * Client tidak bisa mengubah isian lagi (harus hubungi WO untuk revisi).
 */
export default function ClosedScreen({ project, token }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ivory px-4 py-10">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-goldlight/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blush/20 blur-3xl" />
      <Petals count={10} />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-[2rem] border border-gold/25 bg-white/90 px-6 py-10 text-center shadow-soft backdrop-blur sm:px-10">
          <span
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: 'var(--accent-light, #D6BE93)', color: 'var(--accent-text, #7a5c30)' }}
          >
            <Icon name="clipboardCheck" className="h-7 w-7" />
          </span>

          <h1 className="mt-4 font-display text-3xl text-ink">Moodboard Sudah Diproses</h1>
          <p className="mt-1 font-script text-2xl text-gold">{project?.couple || 'Wedding Moodboard'}</p>

          <div className="mt-4 flex justify-center">
            <Flourish />
          </div>

          <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-stone">
            Terima kasih! Moodboard kalian sudah diterima dan sedang diproses oleh tim Mentari Wedding.
            Isian sudah terkunci — kalau ada perubahan, hubungi Wedding Organizer kalian ya.
          </p>

          <Link
            to={`/couple/${token}`}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/15 px-8 py-3.5 text-sm font-medium text-ink transition hover:border-gold hover:text-gold"
          >
            <Icon name="heart" className="h-4 w-4 text-rose" /> Lihat halaman pasangan
          </Link>

          <p className="mt-4 inline-flex items-center justify-center gap-1.5 text-xs text-stone/70">
            Butuh bantuan? Hubungi tim Mentari Wedding.
            <Icon name="heart" className="h-3 w-3 text-gold" />
          </p>
        </div>
      </div>
    </div>
  )
}
