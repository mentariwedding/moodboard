import { daysUntil, formatDate } from '../lib/utils'
import Icon from '../lib/icons'
import Flourish from './Flourish'
import Petals from './Petals'

/**
 * Save-the-Date Card — layar penyambutan sebelum client masuk form.
 * Muncul saat moodboard masih kosong; client yang sudah mulai langsung dilewati.
 */
export default function SaveTheDate({ project, who, onStart }) {
  const date = formatDate(project?.date)
  const days = daysUntil(project?.date)
  const names = project?.couple || 'Kalian Berdua'

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ivory px-4 py-10">
      {/* dekorasi latar */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-goldlight/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blush/20 blur-3xl" />
      <Petals count={12} />

      <div className="relative z-10 w-full max-w-lg">
        <div className="rounded-[2rem] border border-gold/25 bg-white/85 px-6 py-10 text-center shadow-soft backdrop-blur sm:px-10">
          <p className="inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 px-2 text-[10px] uppercase tracking-[0.18em] text-gold sm:text-[11px] sm:tracking-[0.35em]">
            <Icon name="brand" className="h-4 w-4 shrink-0" /> Mentari Wedding · The Wedding Moodboard
          </p>

          <div className="mt-5">
            <Flourish />
          </div>

          <p className="mx-auto mt-5 max-w-md break-words pb-1 font-script text-5xl leading-[1.25] text-ink sm:text-6xl">{names}</p>

          <p className="mt-5 text-xs uppercase tracking-[0.4em] text-gold">Save the Date</p>
          <p className="mt-2 font-display text-3xl text-ink">{date || project?.date ? formatDate(project.date) : 'Tanggal menyusul'}</p>

          {(project?.venue || project?.city) && (
            <p className="mt-2 text-sm text-stone">
              {project?.venue}
              {project?.venue && project?.city ? ' · ' : ''}
              {project?.city}
            </p>
          )}

          {days !== null && days >= 0 && (
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-goldlight/25 px-4 py-1.5 text-xs font-medium text-[#7a5c30]">
              <Icon name="heart" className="h-3 w-3" /> {days} hari menuju hari bahagia
            </p>
          )}

          <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-stone">
            Sebelum kami mulai merancang, kami ingin tahu <i>semua impian kalian</i> — pilih tema, warna, dan ceritakan
            detail pernikahan impian lewat moodboard ini.
          </p>

          <button
            onClick={onStart}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-medium text-white shadow-soft transition hover:opacity-90 active:scale-[0.98]"
            style={{ background: 'var(--accent, #B08D57)' }}
          >
            <Icon name="heart" className="h-4 w-4" /> Mulai Isi Moodboard
          </button>

          {who && (
            <p className="mt-3 inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-stone/70">
              {who === 'two' ? 'Mempelai 2' : 'Mempelai 1'} — isi bagianmu, nanti digabung otomatis
              <Icon name="heart" className="h-3 w-3 text-rose" />
            </p>
          )}
        </div>

        <p className="mt-4 inline-flex w-full items-center justify-center gap-1.5 text-center text-xs text-stone/70">
          Jawabanmu aman & hanya dilihat tim Mentari Wedding
          <Icon name="heart" className="h-3 w-3 text-gold" />
        </p>
      </div>
    </div>
  )
}
