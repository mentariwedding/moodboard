import { useState, useRef } from 'react'
import { SECTIONS, WIZARD_CHAPTERS, CHAPTER_OF_SECTION } from '../lib/constants'
import { daysUntil, filledSections } from '../lib/utils'
import { ProgressBar, Spinner } from './ui'
import Icon from '../lib/icons'
import useAccent from '../lib/useAccent'
import useCountUp from '../lib/useCountUp'
import ConceptCard from './ConceptCard'
import MoodboardCanvas from './MoodboardCanvas'
import Monogram from './Monogram'
import CoupleSection from './sections/CoupleSection'
import VibeSection from './sections/VibeSection'
import ColorsSection from './sections/ColorsSection'
import DecorSection from './sections/DecorSection'
import LookSection from './sections/LookSection'
import CeremonySection from './sections/CeremonySection'
import PlaylistSection from './sections/PlaylistSection'
import FeastSection from './sections/FeastSection'
import StationerySection from './sections/StationerySection'
import PhotoSection from './sections/PhotoSection'
import PrioritiesSection from './sections/PrioritiesSection'
import AvoidSection from './sections/AvoidSection'
import ReferencesSection from './sections/ReferencesSection'

function stepLabel(idx) {
  return String(idx + 1).padStart(2, '0')
}

// Bab aktif untuk seksi tertentu
function chapterOf(idx) {
  return CHAPTER_OF_SECTION[SECTIONS[idx].id] ?? 0
}

export default function WizardShell({
  project,
  data,
  setData,
  onSubmit,
  onSaveDraft,
  onRestart,
  saving,
  justSubmitted,
  uploadRef,
  who,
  autoSave = null,
}) {
  const [step, setStep] = useState(0)
  const scrollRef = useRef(null)
  const total = SECTIONS.length
  const current = SECTIONS[step]
  const filled = filledSections(data)
  const accent = useAccent(data)
  const days = daysUntil(data?.couple?.weddingDate)

  const scrollTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const update = (patch) => setData((d) => ({ ...d, [stepId()]: { ...d[stepId()], ...patch } }))
  const stepId = () => SECTIONS[step].id

  const go = (n) => {
    if (n > 0 && current.id === 'couple' && !(data.couple?.brideName?.trim() && data.couple?.groomName?.trim())) {
      if (!confirm('Nama kedua mempelai belum diisi — lanjut dulu? (Bisa diisi kembali nanti)')) return
    }
    setStep((s) => {
      const next = Math.min(total - 1, Math.max(0, s + n))
      return next
    })
    setTimeout(scrollTop, 30)
  }

  const sectionProps = { data: data[current.id] || {}, update: (patch) => setData((d) => ({ ...d, [current.id]: { ...d[current.id], ...patch } })) }

  const renderSection = () => {
    switch (current.id) {
      case 'couple':
        return <CoupleSection {...sectionProps} />
      case 'vibe':
        return <VibeSection {...sectionProps} />
      case 'colors':
        return <ColorsSection {...sectionProps} />
      case 'decor':
        return <DecorSection {...sectionProps} />
      case 'look':
        return <LookSection {...sectionProps} />
      case 'ceremony':
        return <CeremonySection {...sectionProps} />
      case 'playlist':
        return <PlaylistSection {...sectionProps} />
      case 'feast':
        return <FeastSection {...sectionProps} />
      case 'stationery':
        return <StationerySection {...sectionProps} />
      case 'photo':
        return <PhotoSection {...sectionProps} />
      case 'priorities':
        return <PrioritiesSection {...sectionProps} />
      case 'avoid':
        return <AvoidSection {...sectionProps} />
      case 'references':
        return <ReferencesSection {...sectionProps} uploadRef={uploadRef} />
      default:
        return null
    }
  }

  const last = step === total - 1
  const pct = Math.round((filled / total) * 100)
  const pctAnim = useCountUp(pct)

  return (
    <div ref={scrollRef} className="min-h-screen overflow-x-hidden bg-wedding-pattern bg-ivory">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-ink/5 bg-ivory/90 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <Monogram data={data} size={38} className="shrink-0" />
                <p className="truncate font-script text-[24px] leading-tight text-ink">
                  {project?.couple || 'Wedding Moodboard'}
                  {project?.couple_mode && (
                    <span className="ml-2 align-middle rounded-full border border-ink/15 px-2 py-0.5 font-sans text-[10px] font-normal tracking-normal text-stone">
                      {who === 'two' ? 'Mempelai 2' : 'Mempelai 1'}
                    </span>
                  )}
                </p>
              </div>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-stone">
                {WIZARD_CHAPTERS[chapterOf(step)].label} · {stepLabel(step)} of {stepLabel(total)} · {pctAnim}%
              </p>
            </div>
            <div className="flex items-center gap-2">
              {days !== null && days >= 0 && (
                <span
                  className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium sm:inline-flex"
                  style={{ background: 'var(--accent-light)', color: 'var(--accent-text)' }}
                >
                  <Icon name="heart" className="h-3 w-3" /> {days} hari lagi
                </span>
              )}
              {autoSave && autoSave.state !== 'idle' && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white/70 px-2.5 py-1.5 text-[10px] text-stone sm:text-[11px]"
                  title={autoSave.label}
                >
                  {autoSave.state === 'saving' ? (
                    <Spinner className="h-3 w-3" />
                  ) : autoSave.state === 'saved' ? (
                    <Icon name="checkCircle" className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                  )}
                  <span className="hidden sm:inline">{autoSave.label}</span>
                </span>
              )}
              {!justSubmitted && (
                <button
                  onClick={() => onSaveDraft(data)}
                  disabled={saving}
                  className="whitespace-nowrap rounded-full border border-ink/15 px-3 py-2 text-[11px] text-stone hover:border-gold hover:text-gold transition disabled:opacity-50 sm:px-4 sm:text-xs"
                >
                  {saving ? 'Menyimpan…' : 'Save Draft'}
                </button>
              )}
              <button
                onClick={onRestart}
                className="hidden items-center gap-1 rounded-full px-3 py-2 text-xs text-stone hover:text-rose transition sm:inline-flex"
                title="Reset semua jawaban"
              >
                <Icon name="rotate" className="h-3 w-3" /> Mulai ulang
              </button>
            </div>
          </div>
          {/* Stepper 4 bab — perjalanan yang indah */}
          <div className="mt-4">
            <div className="flex items-center">
              {WIZARD_CHAPTERS.map((ch, i) => {
                const chDone = chapterOf(step) > i
                const chActive = chapterOf(step) === i
                const firstSectionOfChapter = SECTIONS.findIndex((s) => CHAPTER_OF_SECTION[s.id] === i)
                return (
                  <div key={ch.id} className="flex flex-1 items-center">
                    {i > 0 && (
                      <div className={`mx-1 h-0.5 flex-1 rounded-full transition-all duration-500 sm:mx-2 ${chDone ? 'bg-gradient-to-r from-gold to-goldlight' : 'bg-ink/10'}`} />
                    )}
                    <button
                      onClick={() => { setStep(firstSectionOfChapter); setTimeout(scrollTop, 30) }}
                      title={ch.label}
                      className="group flex flex-col items-center gap-1.5"
                    >
                      <span
                        className={[
                          'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 sm:h-12 sm:w-12',
                          chActive
                            ? 'scale-110 border-gold bg-gradient-to-br from-gold to-goldlight text-white shadow-lg shadow-gold/30'
                            : chDone
                              ? 'border-gold/50 bg-goldlight/25 text-[#8a6a3a] group-hover:border-gold'
                              : 'border-ink/15 bg-white text-stone/50 group-hover:border-gold/50 group-hover:text-gold',
                        ].join(' ')}
                      >
                        {chDone ? (
                          <Icon name="check" className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                          <Icon name={ch.icon} className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                      </span>
                      <span
                        className={[
                          'whitespace-nowrap text-[10px] font-medium transition-colors sm:text-xs',
                          chActive ? 'text-gold' : chDone ? 'text-[#8a6a3a]' : 'text-stone/50',
                        ].join(' ')}
                      >
                        {ch.label}
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Stepper + Content + Canvas */}
      <div className="mx-auto max-w-6xl px-4 xl:grid xl:grid-cols-[minmax(0,1fr)_310px] xl:gap-8">
        <div className="min-w-0">
          {/* Content — key=step memicu animasi transisi tiap pindah seksi */}
          <main key={step} className="mx-auto max-w-3xl animate-[sectionIn_.35s_ease] pb-40 pt-6">
            <div className="mb-6 flex items-center gap-4">
              <Monogram data={data} size={52} className="shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>{current.idn}</p>
                <h2 className="font-display text-3xl sm:text-4xl text-ink mt-0.5 leading-tight">
                  {current.en}
                </h2>
              </div>
            </div>
        {renderSection()}
        {current.id === 'references' && (
          <div className="mt-8">
            <ConceptCard data={data} onSaveConcept={(t) => setData((d) => ({ ...d, references: { ...d.references, _concept: t } }))} />
          </div>
        )}
          </main>
        </div>
        <MoodboardCanvas data={data} project={project} />
      </div>

      {/* Bottom nav */}
      <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/5 bg-white/90 backdrop-blur" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3.5">
          <button
            onClick={() => go(-1)}
            disabled={step === 0}
            className="flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm text-stone transition disabled:opacity-30 hover:border-gold hover:text-gold"
          >
            <Icon name="arrowLeft" className="h-3.5 w-3.5" /> Back
          </button>
          {!last ? (
            <button
              onClick={() => go(1)}
              className="flex items-center gap-2 rounded-full bg-ink px-7 py-2.5 text-sm text-ivory transition hover:opacity-85 shadow-soft"
              style={accent ? { background: accent, color: 'var(--accent-text)' } : undefined}
            >
              Next <Icon name="arrowRight" className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={onSubmit}
              disabled={saving}
              className="flex items-center gap-2 rounded-full px-7 py-2.5 text-sm text-white transition hover:opacity-85 shadow-soft disabled:opacity-60"
              style={accent ? { background: accent, color: 'var(--accent-text)' } : { background: '#B08D57' }}
            >
              <Icon name="magic" className="h-3.5 w-3.5" />
              {saving ? 'Mengirim…' : 'Submit Moodboard'}
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}

