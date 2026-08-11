import { useRef, useState } from 'react'
import { SECTIONS, THEMES } from '../lib/constants'
import { formatDate, isSectionFilled, daysUntil, makeIcs, downloadIcs, slugify } from '../lib/utils'
import { captureElement } from '../lib/capture'
import Icon from '../lib/icons'
import useAccent from '../lib/useAccent'
import Confetti from './Confetti'
import Petals from './Petals'
import Flourish from './Flourish'
import Monogram from './Monogram'
import FinalSummary from './FinalSummary'

function SummaryTile({ icon, label, value }) {
  if (!value) return null
  return (
    <div className="rounded-xl border border-ink/5 bg-cream/40 px-3 py-2.5 text-center">
      <Icon name={icon} className="mx-auto mb-1 h-3.5 w-3.5 text-gold" />
      <p className="text-[10px] uppercase tracking-wider text-stone">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-ink">{value}</p>
    </div>
  )
}

export default function SubmittedScreen({ data, project, onBack }) {
  const [viewFull, setViewFull] = useState(false)
  const couple = data.couple || {}
  const name = [couple.brideName, couple.groomName].filter(Boolean).join(' & ')
  const date = formatDate(couple.weddingDate)
  const days = daysUntil(couple.weddingDate)
  const accent = useAccent(data)
  const themeImgs = (data.vibe?.themes || []).map((t) => THEMES.find((x) => x.id === t)).filter(Boolean)
  const cardRef = useRef(null)

  const saveCalendar = () => {
    const wDate = couple.weddingDate
    if (!wDate) { alert('Tanggal pernikahan belum diisi — isi dulu di seksi Data Pasangan ya.'); return }
    downloadIcs(
      `undangan-${slugify(name || 'pernikahan')}.ics`,
      makeIcs({
        summary: `${name || project?.couple} — Hari Pernikahan`,
        date: wDate,
        time: data.ceremony?.time || '',
        location: couple.venue || '',
        description: `Moodboard pernikahan kami bersama Mentari Wedding.`,
      }),
    )
  }

  const downloadCard = async () => {
    try {
      const el = cardRef.current
      if (!el) return
      await captureElement(el, { filename: 'moodboard-saya.png', backgroundColor: '#FBF8F4', scale: 2 })
    } catch (e) {
      alert('Gagal membuat gambar: ' + e.message)
    }
  }

  return (
    <div className="relative min-h-screen bg-ivory">
      <Confetti />
      <Petals count={12} />
      <div className="relative z-10 mx-auto max-w-2xl px-4 py-14 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-gold/20 bg-white/80 shadow-soft">
          <Monogram data={data} size={80} />
        </div>
        <div className="mt-4 flex justify-center">
          <Flourish />
        </div>
        <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">Moodboard Terkirim ✨</h1>
          <p className="mx-auto mt-2 max-w-md break-words pb-1 font-script text-3xl leading-[1.25] text-gold sm:text-4xl">{name || 'Kalian Berdua'}</p>
        <p className="mt-2 text-stone">
          Terima kasih sudah berbagi impian kalian
          {date && <> — moodboard untuk <b className="text-ink">{date}</b></>} sudah diterima tim Mentari Wedding.
        </p>
        {days !== null && days >= 0 && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium" style={{ background: 'var(--accent-light)', color: 'var(--accent-text)' }}>
            <Icon name="heart" className="h-3.5 w-3.5" /> {days} hari menuju hari bahagia
          </p>
        )}

        {/* Kartu ringkasan — bisa di-download */}
        <div ref={cardRef} className="mt-8 rounded-3xl border border-ink/5 bg-white p-6 text-left shadow-soft sm:p-8">
          <p className="text-center text-xs uppercase tracking-[0.35em]" style={{ color: 'var(--accent)' }}>
            Our Wedding Moodboard
          </p>
          <p className="mt-2 text-center font-script text-4xl text-ink">{name || project?.couple}</p>
          <p className="mt-1 text-center text-sm text-stone">{date}{couple.city ? ` · ${couple.city}` : ''}</p>

          {themeImgs.length > 0 && (
            <div className="mt-5 grid grid-cols-3 gap-2.5">
              {themeImgs.slice(0, 3).map((t) => (
                <img key={t.id} src={t.img} alt={t.label} className="h-24 w-full rounded-xl object-cover sm:h-32" />
              ))}
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <SummaryTile icon="colors" label="Palet" value={data.colors?.paletteName} />
            <SummaryTile icon="sprout" label="Bunga" value={data.decor?.flowersSource} />
            <SummaryTile icon="look" label="Gaun" value={data.look?.dress} />
            <SummaryTile icon="feast" label="Penyajian" value={data.feast?.style} />
          </div>

          {(data.references?._concept || data.vibe?.keywords) && (
            <div className="mt-5 rounded-2xl border border-ink/5 bg-ivory p-4">
              <p className="text-xs uppercase tracking-wider text-stone">Konsep kami</p>
              <p className="mt-1 font-serif text-[15px] leading-relaxed text-ink">
                {data.references?._concept || data.vibe?.keywords}
              </p>
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {SECTIONS.map((s) => (
              <div key={s.id} className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs ${isSectionFilled(data[s.id]) ? 'border-gold/30 text-ink' : 'border-ink/5 text-stone/60'}`}>
                <Icon name={s.icon} className="h-3 w-3" />
                <span className="truncate">{s.en}</span>
                {isSectionFilled(data[s.id]) && <Icon name="check" className="h-3 w-3 text-gold" />}
              </div>
            ))}
          </div>

          <p className="mt-5 inline-flex w-full items-center justify-center gap-1.5 text-center text-xs text-stone/70">
            Dibuat dengan <Icon name="brand" className="h-3 w-3 text-gold" /> Mentari Wedding — The Wedding Moodboard
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            onClick={downloadCard}
            className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            <Icon name="download" className="h-4 w-4" /> Simpan sebagai gambar (buat story WA!)
          </button>
          <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-2.5 text-sm text-ink transition hover:border-[var(--accent)]">
            <Icon name="arrowLeft" className="h-3.5 w-3.5" /> Kembali mengisi / mengubah jawaban
          </button>
          <button
            onClick={saveCalendar}
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white px-6 py-2.5 text-sm font-medium text-[#8a6a3a] transition hover:bg-goldlight/20"
            title="Simpan tanggal pernikahan ke kalender HP/Google"
          >
            <Icon name="calendar" className="h-4 w-4" /> Simpan ke Kalender
          </button>
          <button
            onClick={() => setViewFull(!viewFull)}
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white px-6 py-2.5 text-sm font-medium text-[#8a6a3a] transition hover:bg-goldlight/20"
          >
            <Icon name={viewFull ? 'xmark' : 'clipboardCheck'} className="h-4 w-4" />
            {viewFull ? 'Tutup ringkasan' : 'Lihat ringkasan lengkap'}
          </button>
        </div>

        {/* Ringkasan lengkap — muncul saat tombol diklik */}
        {viewFull && (
          <div className="mt-10 animate-[fadeIn_.3s_ease] border-t border-ink/10 pt-8 text-left">
            <FinalSummary data={data} project={project} />
          </div>
        )}
      </div>
    </div>
  )
}
