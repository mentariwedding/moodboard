import { useEffect, useMemo, useState } from 'react'
import { createProject, listProjects, deleteProject, updateProjectStatus, updateProject, subscribeProject, updateStaffNotes, isSetupError, addMoodboardComment, duplicateProject } from '../lib/api'
import { SECTIONS, THEMES, PRIORITY_ITEMS, FONT_STYLES, INSPIRATION_GALLERY } from '../lib/constants'
import {
  computeProgress, copyText, formatDate, isSectionFilled, shareUrl, coupleUrl, waShareUrl, waReminderUrl, waNumber, linkType, timeAgo, todayISO, toCsv, downloadCsv, makeIcs, downloadIcs,
  mergeMoodboards, generateConcept, daysUntil,
} from '../lib/utils'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { Btn, Badge, Card, EmptyState, Field, Spinner, Skeleton, TextArea, TextInput, useToast, Toast } from '../components/ui'
import Icon from '../lib/icons'
import { logger, findOverflowing } from '../lib/debug'
import AuthPage from './AuthPage'
import DemoAuth, { demoAuthed, lockDemo } from '../components/DemoAuth'
import SetupNeededScreen from '../components/SetupNeededScreen'
import Poster, { downloadPoster } from '../components/Poster'
import QrModal from '../components/QrModal'
import PrintSummary from '../components/PrintSummary'
import Lightbox from '../components/Lightbox'
import CommentsBlock from '../components/CommentsBlock'
import MediaPlayer from '../components/MediaPlayer'

const STATUS_META = {
  invited: { label: 'Menunggu isian', color: 'gray', icon: 'clock' },
  partial: { label: 'Diisi client', color: 'gold', icon: 'pen' },
  submitted: { label: 'Selesai', color: 'green', icon: 'checkCircle' },
  done: { label: 'Sudah diproses', color: 'gold', icon: 'clipboardCheck' },
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.invited
  return (
    <Badge color={m.color}>
      <Icon name={m.icon} className="h-3 w-3" /> {m.label}
    </Badge>
  )
}

/** Status efektif — diturunkan dari moodboard (real-time), kecuali 'done' yang di-set WO. */
function effStatus(p) {
  if (p.status === 'done') return 'done'
  const mb = p.mb
  if (!mb || !mb.data) return 'invited'
  if (p.couple_mode) {
    const cd = mb.data.coupleData || {}
    const oneDone = cd.one?._submitted === true
    const twoDone = cd.two?._submitted === true
    if (oneDone && twoDone) return 'submitted'
    if (oneDone || twoDone || cd.one || cd.two) return 'partial'
    return 'invited'
  }
  return mb.is_draft ? 'partial' : 'submitted'
}

/** Data gabungan: mode bareng → merge dua mempelai. */
function mergedData(p) {
  if (p.couple_mode && p.mb?.data?.coupleData) {
    return mergeMoodboards(p.mb.data.coupleData.one, p.mb.data.coupleData.two)
  }
  return p.mb?.data || {}
}

function SectionSummary({ id, s }) {
  if (!s || !isSectionFilled(s)) {
    return <p className="text-sm text-stone/70 italic">Belum diisi.</p>
  }
  const show = []
  const add = (label, val) => {
    if (val == null) return
    if (Array.isArray(val) && val.length) show.push(`${label}: ${val.join(', ')}`)
    else if (String(val).trim()) show.push(`${label}: ${val}`)
  }
  if (id === 'couple') {
    add('Mempelai', [s.brideName, s.groomName].filter(Boolean).join(' & '))
    add('Tanggal', formatDate(s.weddingDate))
    add('Kota', s.city)
    add('Venue', s.venue)
    add('Tamu', s.guests)
    add('Budget', s.budget)
    add('WA', s.wa)
  } else if (id === 'vibe') {
    const themes = (s.themes || []).map((t) => THEMES.find((x) => x.id === t)?.label || t)
    add('Tema', themes)
    add('Suasana', s.vibes)
    add('Kata kunci', s.keywords)
  } else if (id === 'colors') {
    return (
      <div className="space-y-1 text-sm">
        <p className="flex flex-wrap items-center gap-1.5">
          <span>Palet: <b>{s.paletteName || 'Custom'}</b></span>
          <span className="flex flex-wrap items-center gap-1">
            {(s.palette || []).map((c) => (
              <span key={c} className="inline-block h-3 w-3 rounded-full border border-ink/10" style={{ background: c }} />
            ))}
          </span>
        </p>
        {s.avoid?.filter(Boolean).length > 0 && (
          <p className="inline-flex max-w-full items-center gap-1">
            <Icon name="avoid" className="h-3 w-3 shrink-0 text-rose" /> <span className="break-words">Hindari: {s.avoid.filter(Boolean).join(', ')}</span>
          </p>
        )}
      </div>
    )
  } else if (id === 'decor') {
    add('Pelaminan', s.stage)
    add('Bunga', s.flowersSource)
    add('Bunga favorit', s.flowersLike)
    add('Lighting', s.lighting)
    add('Meja', s.tables)
    add('Signage', s.signage)
    add('Catatan', s.notes)
  } else if (id === 'look') {
    add('Gaun', s.dress)
    add('Aksen', s.dressAccent)
    add('Rias', s.makeup)
    add('Pria', s.groom)
    add('Catatan', s.notes)
    if (s.outfitPhoto) {
      return (
        <div className="space-y-1.5 text-sm">
          {show.length ? <ul className="space-y-1">{show.map((x, i) => <li key={i}>{x}</li>)}</ul> : null}
          <div>
            <p className="mb-1 inline-flex items-center gap-1 text-[12px] text-stone"><Icon name="look" className="h-3 w-3 text-gold" /> Foto referensi gaun</p>
            <img src={s.outfitPhoto} alt="Referensi gaun" className="max-h-48 w-full max-w-full rounded-xl border border-ink/10 object-contain bg-cream/40" loading="lazy" />
          </div>
        </div>
      )
    }
  } else if (id === 'ceremony') {
    add('Format', s.format)
    add('Jam mulai', s.time)
    add('Adat', s.traditions)
    add('Hiburan', s.entertainment)
    add('Musik', s.music)
    add('Catatan', s.notes)
  } else if (id === 'feast') {
    add('Penyajian', s.style)
    add('Menu wajib', s.mustHave)
    add('Alergi', s.allergies)
    add('Kue', s.cake)
    add('Catatan', s.notes)
  } else if (id === 'stationery') {
    add('Jenis', s.type)
    add('Gaya', s.style)
    add('Font', s.fontStyle ? (FONT_STYLES.find((f) => f.id === s.fontStyle)?.label || s.fontStyle) : '')
    add('Monogram', s.monogram)
    add('Catatan', s.notes)
  } else if (id === 'photo') {
    add('Gaya', s.styles)
    add('Momen wajib', s.mustShots)
    add('Catatan', s.notes)
  } else if (id === 'priorities') {
    const top = (s.top3 || []).map((t) => PRIORITY_ITEMS.find((p) => p.id === t)?.label || t)
    const stars = PRIORITY_ITEMS.filter((p) => (s.ratings?.[p.id] || 3) >= 4).map((p) => p.label)
    add('TOP 3', top)
    if (stars.length) add('Prioritas tinggi', stars)
    add('Catatan', s.notes)
  } else if (id === 'avoid') {
    add('Tema dihindari', s.themes)
    add('Warna dihindari', (s.colors || []).filter(Boolean))
    add('Catatan', s.notes)
  } else if (id === 'playlist') {
    const songs = s.songs || []
    return (
      <div className="space-y-1.5 text-sm">
        {songs.length ? (
          <ul className="space-y-1">
            {songs.slice(0, 6).map((x, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="shrink-0 rounded-full bg-cream px-2 py-0.5 text-[10px] text-stone">{x.moment}</span>
                <span className="min-w-0 flex-1 truncate">{x.title || x.url}</span>
                {x.url && (
                  <span className="shrink-0">
                    <MediaPlayer url={x.url} title={x.title} variant="modal" size="sm" />
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-stone/70 italic">Belum diisi.</p>
        )}
        {s.doNotPlay?.trim() && <p className="inline-flex max-w-full items-center gap-1"><Icon name="avoid" className="h-3 w-3 shrink-0 text-rose" /> <span className="break-words">Jangan diputar: {s.doNotPlay}</span></p>}
        {s.notes?.trim() && <p className="inline-flex max-w-full items-center gap-1"><Icon name="music" className="h-3 w-3 shrink-0 text-gold" /> <span className="break-words">{s.notes}</span></p>}
      </div>
    )
  } else if (id === 'references') {
    const nImg = (s.images || []).length
    const nLink = (s.links || []).length
    const nLike = (s.liked || []).length
    return (
      <div className="space-y-2 text-sm">
        <p className="inline-flex items-center gap-1.5"><Icon name="images" className="h-3.5 w-3.5 text-gold" /> Foto referensi: <b>{nImg} foto</b>{nImg > 0 && <span className="text-stone/60">(lihat tab Referensi)</span>}</p>
        <p className="inline-flex items-center gap-1.5"><Icon name="link" className="h-3.5 w-3.5 text-gold" /> Link: <b>{nLink} link</b>{nLink > 0 && <span className="text-stone/60">(lihat tab Referensi)</span>}</p>
        {nLike > 0 && <p className="inline-flex items-center gap-1.5"><Icon name="heart" className="h-3.5 w-3.5 text-rose" /> Galeri disukai: <b>{nLike} gaya</b></p>}
      </div>
    )
  }
  return show.length ? <ul className="space-y-1 text-sm">{show.map((x, i) => <li key={i}>{x}</li>)}</ul> : <p className="text-sm text-stone/70 italic">Belum diisi.</p>
}

/** Target pengingat: dalam mode bareng, arahkan ke mempelai yang BELUM submit. */
function reminderInfo(p, fallback) {
  const cd = p.couple_mode ? p.mb?.data?.coupleData : null
  if (!cd) return { number: fallback, label: '' }
  const oneDone = cd.one?._submitted === true
  const twoDone = cd.two?._submitted === true
  if (oneDone && !twoDone) return { number: cd.two?.couple?.wa || fallback, label: 'Mempelai 2' }
  if (!oneDone && twoDone) return { number: cd.one?.couple?.wa || fallback, label: 'Mempelai 1' }
  return { number: fallback || cd.one?.couple?.wa || cd.two?.couple?.wa || '', label: '' }
}

/** Catatan/keputusan WO per seksi — tersimpan di localStorage per proyek. */
function useStaffNotes(project) {
  const token = project.token
  const migrate = () => {
    try { return JSON.parse(localStorage.getItem(`mw_notes_${token}`) || '{}') } catch { return {} }
  }
  const [notes, setNotes] = useState(() => project.staff_notes || migrate() || {})
  useEffect(() => {
    setNotes(project.staff_notes || migrate() || {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, project.staff_notes])
  const setNote = (sectionId, text) => {
    setNotes((prev) => {
      const next = { ...prev, [sectionId]: text }
      updateStaffNotes(token, next)
      return next
    })
  }
  return [notes, setNote]
}

function ProjectDetail({ project, refresh, toastAdd }) {
  const [viewMode, setViewMode] = useState('gabungan') // gabungan | one | two
  const cdRaw = project.couple_mode ? project.mb?.data?.coupleData || {} : null
  const data = viewMode === 'gabungan' || !cdRaw ? mergedData(project) : cdRaw[viewMode] || {}
  const progOne = cdRaw ? computeProgress(cdRaw.one) : null
  const progTwo = cdRaw ? computeProgress(cdRaw.two) : null
  const token = project.token
  const waTarget = project.client_wa || data.couple?.wa || ''
  const url = shareUrl(token, undefined, project.couple)
  const [tab, setTab] = useState('ringkasan')
  const [notes, setNote] = useStaffNotes(project)
  const [posterBusy, setPosterBusy] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [lightbox, setLightbox] = useState(null) // index foto yang dibuka
  const [dupBusy, setDupBusy] = useState(false)

  const refs = data.references || {}
  const themeIds = data.vibe?.themes || []
  const themeImgs = themeIds.map((t) => THEMES.find((x) => x.id === t)).filter(Boolean)
  const status = effStatus(project)
  const days = daysUntil(data.couple?.weddingDate)
  const hasAnySection = SECTIONS.some((sec) => isSectionFilled(data[sec.id]))
  const concept = hasAnySection ? data.references?._concept || generateConcept(data) : ''

  const comments = project.mb?.comments || {}
  const cd = project.couple_mode ? project.mb?.data?.coupleData || {} : null

  const doPoster = async () => {
    setPosterBusy(true)
    try {
      await downloadPoster(document.getElementById(`poster-${token}`))
      toastAdd('Poster diunduh', 'image')
    } catch (e) {
      toastAdd('Gagal membuat poster: ' + e.message)
    } finally {
      setPosterBusy(false)
    }
  }

  const doSaveCalendar = () => {
    const wDate = data.couple?.weddingDate || project.date
    if (!wDate) { toastAdd('Tanggal pernikahan belum diisi', 'info'); return }
    const venue = data.couple?.venue || project.venue || ''
    const time = data.ceremony?.time || ''
    downloadIcs(
      `undangan-${(project.couple || 'pernikahan').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`,
      makeIcs({
        summary: `${project.couple} — Hari Pernikahan`,
        date: wDate,
        time,
        location: venue,
        description: `Moodboard pernikahan: ${url}`,
      }),
    )
    toastAdd('File kalender diunduh — buka untuk menambah ke kalender', 'calendar')
  }

  const doExportCsv = () => {
    const c = data.couple || {}
    const v = data.vibe || {}
    const col = data.colors || {}
    const dec = data.decor || {}
    const lk = data.look || {}
    const cer = data.ceremony || {}
    const pl = data.playlist || {}
    const fe = data.feast || {}
    const st = data.stationery || {}
    const ph = data.photo || {}
    const pr = data.priorities || {}
    const av = data.avoid || {}
    const ref = data.references || {}
    const row = {
      'Nama Pasangan': project.couple,
      'Mempelai Wanita': c.brideName,
      'Mempelai Pria': c.groomName,
      'Tanggal': c.weddingDate || project.date || '',
      'Kota': c.city,
      'Venue': c.venue || project.venue || '',
      'Jumlah Tamu': c.guests,
      'Budget': c.budget,
      'No WA': c.wa,
      'Tema': (v.themes || []).map((t) => THEMES.find((x) => x.id === t)?.label || t).join('; '),
      'Suasana': (v.vibes || []).join('; '),
      'Kata Kunci': v.keywords,
      'Palet': col.paletteName || '',
      'Warna': (col.palette || []).join('; '),
      'Warna Dihindari': (col.avoid || []).filter(Boolean).join('; '),
      'Pelaminan': dec.stage,
      'Bunga': dec.flowersSource,
      'Bunga Favorit': (dec.flowersLike || []).join('; '),
      'Lighting': (dec.lighting || []).join('; '),
      'Meja': dec.tables,
      'Signage': (dec.signage || []).join('; '),
      'Gaun': lk.dress,
      'Rias': lk.makeup,
      'Busana Pria': lk.groom,
      'Format Acara': cer.format,
      'Jam Mulai': cer.time,
      'Adat': (cer.traditions || []).join('; '),
      'Hiburan': (cer.entertainment || []).join('; '),
      'Musik': (cer.music || []).join('; '),
      'Playlist': (pl.songs || []).map((x) => `[${x.moment}] ${x.title || x.url}`).join(' | '),
      'Lagu Jangan Diputar': pl.doNotPlay,
      'Penyajian': fe.style,
      'Menu Wajib': fe.mustHave,
      'Alergi': fe.allergies,
      'Kue': fe.cake,
      'Jenis Undangan': st.type,
      'Gaya Undangan': (st.style || []).join('; '),
      'Monogram': st.monogram,
      'Gaya Foto': (ph.styles || []).join('; '),
      'Momen Wajib': (ph.mustShots || []).join('; '),
      'Prioritas TOP3': (pr.top3 || []).map((t) => PRIORITY_ITEMS.find((p) => p.id === t)?.label || t).join('; '),
      'Rating Dekor': pr.ratings?.decor || '',
      'Rating Makanan': pr.ratings?.food || '',
      'Rating Foto': pr.ratings?.photo || '',
      'Rating Busana': pr.ratings?.outfit || '',
      'Rating Hiburan': pr.ratings?.entertainment || '',
      'Tema Dihindari': av.themes,
      'Catatan Hindari': av.notes,
      'Jumlah Foto': (ref.images || []).length,
      'Link Inspirasi': (ref.links || []).join(' | '),
    }
    downloadCsv(`moodboard-${(project.couple || 'proyek').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.csv`, toCsv([row]))
    toastAdd('CSV diunduh!', 'download')
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      {project.couple_mode && cd && (
        <div className="flex flex-wrap items-center gap-1.5">
          {[['gabungan', 'Gabungan'], ['one', 'Mempelai 1'], ['two', 'Mempelai 2']].map(([v, label]) => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              className={`rounded-full border px-3.5 py-1.5 text-xs transition ${viewMode === v ? 'border-ink bg-ink text-ivory' : 'border-ink/15 bg-white text-stone hover:border-gold'}`}
            >
              {label}
              {v === 'one' ? ` ${progOne ?? 0}%` : v === 'two' ? ` ${progTwo ?? 0}%` : ''}
            </button>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 max-w-full flex-1">
          <p className="break-words pr-2 font-display text-2xl text-ink sm:text-3xl">{project.couple || 'Tanpa nama'}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-stone">
            <StatusBadge status={status} />
            {project.date && <span className="inline-flex max-w-full items-center gap-1"><Icon name="calendar" className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{formatDate(project.date)}</span></span>}
            {days !== null && days >= 0 && <span className="inline-flex shrink-0 items-center gap-1"><Icon name="heart" className="h-3.5 w-3.5" /> H-{days}</span>}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone">
            {project.venue && <span className="inline-flex max-w-full items-center gap-1"><Icon name="location" className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{project.venue}</span></span>}
            {project.client_wa && <span className="inline-flex max-w-full items-center gap-1"><Icon name="phone" className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{project.client_wa}</span></span>}
            {(project.mb?.updated_at || project.updated_at) && (
              <span className="inline-flex max-w-full items-center gap-1 text-stone/70"><Icon name="clock" className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">diperbarui {timeAgo(project.mb?.updated_at || project.updated_at)}</span></span>
            )}
          </div>
          {project.couple_mode && cd && (
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-goldlight/25 px-3 py-1 text-[#7a5c30]"><Icon name="users" className="h-3 w-3" /> Mode isi bareng</span>
              <span className="rounded-full bg-cream px-3 py-1 text-stone">Mempelai 1: {progOne}%</span>
              <span className="rounded-full bg-cream px-3 py-1 text-stone">Mempelai 2: {progTwo}%</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <Btn kind="outline" size="sm" className="sm:flex-none" onClick={() => { copyText(url); toastAdd('Link disalin!', 'copy') }}><Icon name="copy" className="h-3.5 w-3.5" /> Copy link</Btn>
          <Btn kind="gold" size="sm" className="sm:flex-none" onClick={() => {
            if (!waNumber(waTarget)) { toastAdd('Tidak ada nomor WA client — isi di menu Edit dulu ya', 'info'); return }
            window.open(waShareUrl(token, project.couple, undefined, waTarget), '_blank')
          }}><Icon name="wa" className="h-3.5 w-3.5" /> Kirim via WA</Btn>
          {status !== 'submitted' && status !== 'done' && (
            <Btn kind="outline" size="sm" className="sm:flex-none" onClick={() => {
            const rem = reminderInfo(project, waTarget)
            if (!waNumber(rem.number)) { toastAdd('Tidak ada nomor WA — isi di menu Edit dulu ya', 'info'); return }
            window.open(waReminderUrl(token, project.couple, rem.number, rem.label), '_blank')
          }}><Icon name="bell" className="h-3.5 w-3.5" /> Kirim Pengingat</Btn>
          )}
          <Btn kind="white" size="sm" className="sm:flex-none" onClick={doPoster} disabled={posterBusy}><Icon name="image" className="h-3.5 w-3.5" /> {posterBusy ? 'Membuat…' : 'Unduh Poster'}</Btn>
          <Btn kind="white" size="sm" className="sm:flex-none" onClick={() => window.print()} title="Ringkasan A4 siap cetak / Save as PDF"><Icon name="print" className="h-3.5 w-3.5" /> Cetak / PDF</Btn>
          <Btn kind="white" size="sm" className="sm:flex-none" onClick={doExportCsv} title="Unduh semua jawaban sebagai spreadsheet"><Icon name="sheet" className="h-3.5 w-3.5" /> Export CSV</Btn>
          <Btn kind="white" size="sm" className="sm:flex-none" onClick={() => setQrOpen(true)}><Icon name="qrcode" className="h-3.5 w-3.5" /> QR Code</Btn>
          <Btn kind="white" size="sm" className="sm:flex-none" onClick={doSaveCalendar} title="Simpan tanggal pernikahan ke kalender (ICS)"><Icon name="calendar" className="h-3.5 w-3.5" /> Simpan Kalender</Btn>
          <Btn kind="outline" size="sm" className="sm:flex-none" onClick={() => window.open(coupleUrl(token, project.couple), '_blank')}><Icon name="heart" className="h-3.5 w-3.5" /> Halaman pasangan</Btn>
          <Btn kind="white" size="sm" className="sm:flex-none" onClick={() => setEditOpen(true)}><Icon name="pen" className="h-3.5 w-3.5" /> Edit</Btn>
          <Btn kind="white" size="sm" className="sm:flex-none" disabled={dupBusy} onClick={async () => {
            if (!confirm('Duplikat proyek ini? Isian client TIDAK disalin — hanya data proyek & catatan WO.')) return
            setDupBusy(true)
            try {
              const newToken = await duplicateProject(token)
              await refresh()
              toastAdd('Proyek duplikat dibuat!', 'copy')
              setSelected((await listProjects()).find((x) => x.token === newToken) || null)
            } catch (e) {
              toastAdd('Gagal duplikat: ' + e.message, 'info')
            } finally {
              setDupBusy(false)
            }
          }}><Icon name="copy" className="h-3.5 w-3.5" /> {dupBusy ? 'Menduplikat…' : 'Duplikat'}</Btn>
          <Btn kind="ghost" size="sm" className="text-rose sm:flex-none" onClick={() => { if (confirm('Hapus proyek ini?')) deleteProject(token).then(refresh) }}><Icon name="trash" className="h-3.5 w-3.5" /> Hapus</Btn>
        </div>
      </div>

      {/* Link per mempelai (mode bareng) */}
      {project.couple_mode && (
        <Card className="bg-goldlight/10">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-ink"><Icon name="link" className="h-4 w-4 text-gold" /> Dua link untuk dua mempelai</p>
          <div className="mt-3 space-y-2.5">
            {[
              ['one', 'Mempelai 1', shareUrl(token, 'one', project.couple)],
              ['two', 'Mempelai 2', shareUrl(token, 'two', project.couple)],
            ].map(([w, label, u]) => (
              <div key={w} className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 shadow-card">
                <span className="shrink-0 rounded-full bg-ink px-2.5 py-0.5 text-[11px] text-ivory">{label}</span>
                <span className="min-w-0 flex-1 truncate text-xs text-stone">{u}</span>
                <button onClick={() => { copyText(u); toastAdd(`Link ${label} disalin!`) }} className="text-xs text-gold hover:underline">Salin</button>
                <button onClick={() => {
                  const num = w === 'one' ? cd?.one?.couple?.wa || waTarget : cd?.two?.couple?.wa || waTarget
                  if (!waNumber(num)) { toastAdd('Tidak ada nomor WA mempelai ini', 'info'); return }
                  window.open(waShareUrl(token, `${project.couple} (${label})`, w, num), '_blank')
                }} className="text-xs text-gold hover:underline">WA</button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Progress */}
      <Card>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-ink">Kemajuan pengisian</span>
          <span className="font-semibold text-gold">{computeProgress(data)}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-cream">
          <div className="h-full rounded-full bg-gradient-to-r from-gold to-goldlight transition-all" style={{ width: `${computeProgress(data)}%` }} />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {SECTIONS.map((s) => {
            const done = isSectionFilled(data[s.id])
            return (
              <span key={s.id} title={s.en} className={`flex h-7 w-7 items-center justify-center rounded-full ${done ? 'bg-goldlight/40 text-[#7a5c30]' : 'bg-cream text-stone/60'}`}>
                {done ? <Icon name="check" className="h-3 w-3" /> : <Icon name={s.icon} className="h-3 w-3" />}
              </span>
            )
          })}
        </div>
      </Card>

      {/* Konsep otomatis */}
      {concept && (
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-goldlight/20 to-transparent" />
          <div className="relative">
            <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-gold"><Icon name="magic" className="h-3.5 w-3.5" /> Konsep otomatis</p>
            <p className="mt-2 font-serif text-lg leading-relaxed text-ink">{concept}</p>
            <button onClick={() => { copyText(concept); toastAdd('Konsep disalin!', 'copy') }} className="mt-2 inline-flex items-center gap-1 text-xs text-gold hover:underline">
              <Icon name="copy" className="h-3 w-3" /> Salin teks
            </button>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-ink/10 pb-px">
        {[
          ['ringkasan', 'clipboardCheck', 'Ringkasan'],
          ['referensi', 'images', 'Referensi'],
          ['mentah', 'sheet', 'Data mentah'],
        ].map(([id, icon, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`-mb-px inline-flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm transition ${tab === id ? 'border-gold text-gold font-medium' : 'border-transparent text-stone hover:text-ink'}`}
          >
            <Icon name={icon} className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>

      {tab === 'ringkasan' && (
        <div className="grid gap-4 sm:grid-cols-2 [&>*]:min-w-0">
          {SECTIONS.map((s) => (
            <Card key={s.id} className={s.id === 'priorities' || s.id === 'avoid' ? 'sm:col-span-2' : ''}>
              <div className="mb-2 flex items-center justify-between">
                <p className="inline-flex items-center gap-2 font-medium text-ink">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cream text-gold">
                    <Icon name={s.icon} className="h-3.5 w-3.5" />
                  </span>
                  {s.en}
                  {(comments[s.id] || []).length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-goldlight/30 px-2 py-0.5 text-[10px] font-semibold text-[#7a5c30]">
                      <Icon name="comment" className="h-2.5 w-2.5" /> {(comments[s.id] || []).length}
                    </span>
                  )}
                </p>
                <span className="text-[11px] uppercase tracking-wider text-stone/60">{s.idn}</span>
              </div>
              <SectionSummary id={s.id} s={data[s.id]} />
              {/* Catatan WO */}
              <div className="mt-3 border-t border-dashed border-ink/10 pt-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone">
                  <Icon name="pen" className="h-3 w-3" /> Catatan WO {notes[s.id] ? <span className="text-gold">· ada catatan</span> : null}
                </div>
                <TextArea
                  rows={2}
                  value={notes[s.id] || ''}
                  onChange={(e) => setNote(s.id, e.target.value)}
                  placeholder="Tulis keputusan, budget, atau saran desain di sini…"
                  className="mt-1.5 !text-xs"
                />
              </div>
              <CommentsBlock
                comments={comments[s.id] || []}
                author="wo"
                onAdd={async (t) => {
                  await addMoodboardComment(token, s.id, t, 'wo')
                  refresh()
                }}
                placeholder="Balas client / beri arahan…"
              />
            </Card>
          ))}
        </div>
      )}

      {tab === 'referensi' && (
        <div className="space-y-5">
          <Card>
            <p className="mb-3 inline-flex items-center gap-2 font-medium text-ink"><Icon name="images" className="h-4 w-4 text-gold" /> Foto referensi ({refs.images?.length || 0})</p>
            {refs.images?.length ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {refs.images.map((img, i) => {
                  const src = img.demo ? img.dataUrl : img.publicUrl
                  return (
                    <button
                      key={i}
                      onClick={() => setLightbox(i)}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-ink/10"
                      title="Perbesar foto"
                    >
                      <img src={src} alt={`ref ${i + 1}`} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/25 group-hover:opacity-100">
                        <Icon name="search" className="h-5 w-5 text-white" />
                      </span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-stone/70 italic">Belum ada foto.</p>
            )}
          </Card>
          <Card>
            <p className="mb-3 inline-flex items-center gap-2 font-medium text-ink"><Icon name="link" className="h-4 w-4 text-gold" /> Link inspirasi ({refs.links?.length || 0})</p>
            {refs.links?.length ? (
              <ul className="space-y-2">
                {refs.links.map((l, i) => (
                  <li key={i}>
                    <a href={l} target="_blank" rel="noreferrer" className="break-all text-sm text-gold underline-offset-2 hover:underline">{l}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-stone/70 italic">Belum ada link.</p>
            )}
          </Card>
        </div>
      )}

      {tab === 'mentah' && (
        <Card>
          <pre className="max-h-[480px] overflow-auto rounded-xl bg-cream/60 p-4 text-xs text-ink whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-stone"><Icon name="lightbulb" className="h-3.5 w-3.5 text-gold" /> Salin JSON ini kalau mau impor ke alat lain (misal Notion, spreadsheet).</p>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2">
        {status !== 'done' && (
          <Btn kind="gold" size="sm" className="sm:flex-none" onClick={() => { window.open(url, '_blank'); toastAdd('Link dibuka di tab baru', 'external') }}><Icon name="external" className="h-3.5 w-3.5" /> Buka isian client</Btn>
        )}
        {status === 'submitted' && (
          <Btn kind="outline" size="sm" className="sm:flex-none" onClick={async () => { await updateProjectStatus(token, 'done'); refresh(); toastAdd('Ditandai sudah diproses', 'checkCircle') }}>
            <Icon name="checkCircle" className="h-3.5 w-3.5" /> Tandai sudah diproses
          </Btn>
        )}
        {status === 'done' && (
          <Btn kind="ghost" size="sm" className="sm:flex-none" onClick={async () => { await updateProjectStatus(token, 'submitted'); refresh(); toastAdd('Status dikembalikan ke selesai', 'rotate') }}>
            <Icon name="rotate" className="h-3.5 w-3.5" /> Kembalikan status
          </Btn>
        )}
        <Btn kind="ghost" size="sm" className="sm:flex-none" onClick={async () => { await updateProjectStatus(token, 'invited'); refresh(); toastAdd('Status direset ke menunggu isian', 'rotate') }}>
          <Icon name="rotate" className="h-3.5 w-3.5" /> Reset status
        </Btn>
      </div>

      <Poster project={project} data={data} id={`poster-${token}`} />
      <PrintSummary project={project} data={data} />
      {qrOpen && <QrModal url={url} couple={project.couple} data={data} onClose={() => setQrOpen(false)} />}
      {lightbox !== null && refs.images?.length > 0 && (
        <Lightbox
          images={refs.images}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNavigate={setLightbox}
        />
      )}
      {editOpen && (
        <EditModal
          project={project}
          onClose={() => setEditOpen(false)}
          onSaved={() => {
            setEditOpen(false)
            refresh()
            toastAdd('Proyek diperbarui', 'checkCircle')
          }}
        />
      )}
    </div>
  )
}

function EditModal({ project, onClose, onSaved }) {
  const [couple, setCouple] = useState(project.couple || '')
  const [venue, setVenue] = useState(project.venue || '')
  const [date, setDate] = useState(project.date || '')
  const [note, setNote] = useState(project.note || '')
  const [clientWa, setClientWa] = useState(project.client_wa || '')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    if (!couple.trim()) return alert('Nama pasangan wajib diisi.')
    if (clientWa.trim() && !waNumber(clientWa)) return alert('Nomor WA client tampak kurang lengkap — periksa kembali.')
    setBusy(true)
    try {
      await updateProject(project.token, {
        couple: couple.trim(),
        venue: venue.trim(),
        date: date || null,
        note: note.trim(),
        client_wa: clientWa.trim(),
      })
      onSaved()
    } catch (e) {
      alert('Gagal menyimpan: ' + e.message)
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div className="flex max-h-[92dvh] w-full max-w-md flex-col rounded-t-3xl bg-white shadow-soft sm:rounded-3xl" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} onClick={(e) => e.stopPropagation()}>
        <div className="shrink-0 px-6 pt-6">
          <p className="font-display text-2xl text-ink">Edit Proyek</p>
          <p className="mt-1 text-sm text-stone">Perbarui data pasangan — link client tidak berubah.</p>
        </div>
        <div className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto px-6 pb-2">
          <Field label="Nama pasangan *">
            <TextInput value={couple} onChange={(e) => setCouple(e.target.value)} />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Tanggal">
              <TextInput type="date" min={todayISO()} value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Venue">
              <TextInput value={venue} onChange={(e) => setVenue(e.target.value)} />
            </Field>
          </div>
          <Field label="Catatan internal">
            <TextArea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
          <Field label="No. WA client" hint="Kosongkan untuk otomatis memakai nomor yang diisi client di Data Pasangan">
            <TextInput type="tel" value={clientWa} onChange={(e) => setClientWa(e.target.value)} placeholder="cth: 081234567890" />
            {clientWa.trim() && !waNumber(clientWa) && <p className="mt-1 text-[11px] text-rose">Nomor tampak kurang lengkap — periksa kembali.</p>}
          </Field>
        </div>
        <div className="mt-auto shrink-0 border-t border-ink/5 px-6 py-4" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}>
          <div className="flex gap-3">
            <Btn kind="outline" onClick={onClose} className="flex-1">Batal</Btn>
            <Btn kind="gold" onClick={submit} disabled={busy} className="flex-1">
              {busy ? <Spinner /> : 'Simpan'}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  )
}

function CreateModal({ onClose, onCreated }) {
  const [couple, setCouple] = useState('')
  const [venue, setVenue] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')
  const [clientWa, setClientWa] = useState('')
  const [coupleMode, setCoupleMode] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    if (!couple.trim()) return alert('Nama pasangan wajib diisi.')
    if (clientWa.trim() && !waNumber(clientWa)) return alert('Nomor WA client tampak kurang lengkap — periksa kembali (cth: 081234567890).')
    setBusy(true)
    try {
      const token = await createProject({ couple: couple.trim(), venue, date: date || null, note, coupleMode, clientWa: clientWa.trim() })
      onCreated(token)
    } catch (e) {
      alert('Gagal membuat proyek: ' + e.message)
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div className="flex max-h-[92dvh] w-full max-w-md flex-col rounded-t-3xl bg-white shadow-soft sm:rounded-3xl" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} onClick={(e) => e.stopPropagation()}>
        <div className="shrink-0 px-6 pt-6">
          <p className="font-display text-2xl text-ink">Proyek Moodboard Baru</p>
          <p className="mt-1 text-sm text-stone">Isi data pasangan — link otomatis dibuat setelah ini.</p>
        </div>
        <div className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto px-6 pb-2">
          <Field label="Nama pasangan *" hint="cth: Salsabila & Raka">
            <TextInput value={couple} onChange={(e) => setCouple(e.target.value)} placeholder="Nama mempelai" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tanggal">
              <TextInput type="date" min={todayISO()} value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Venue">
              <TextInput value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="cth: The Lodge" />
            </Field>
          </div>
          <Field label="Catatan internal" hint="Catatan khusus yang hanya dilihat kamu">
            <TextArea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="cth: client kenalan dari IG, budget agak ketat" />
          </Field>
          <Field label="No. WA client" hint="Nomor tujuan tombol Kirim via WA. Kosongkan? Nanti otomatis pakai nomor yang diisi client di seksi Data Pasangan.">
            <TextInput type="tel" value={clientWa} onChange={(e) => setClientWa(e.target.value)} placeholder="cth: 081234567890" />
            {clientWa.trim() && !waNumber(clientWa) && <p className="mt-1 text-[11px] text-rose">Nomor tampak kurang lengkap — periksa kembali.</p>}
          </Field>
          <button
            type="button"
            onClick={() => setCoupleMode(!coupleMode)}
            className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${coupleMode ? 'border-gold bg-goldlight/15' : 'border-ink/10 hover:border-gold/40'}`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream text-gold">
              <Icon name="users" className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-medium text-ink">Mode isi bareng pasangan</span>
              <span className="block text-xs text-stone">Buat 2 link terpisah (mempelai 1 & 2) — jawaban digabung otomatis di dashboard</span>
            </span>
            <span className={`flex h-5 w-10 items-center rounded-full p-0.5 transition ${coupleMode ? 'bg-gold justify-end' : 'bg-ink/15 justify-start'}`}>
              <span className="h-4 w-4 rounded-full bg-white shadow" />
            </span>
          </button>
        </div>
        <div className="mt-auto shrink-0 border-t border-ink/5 px-6 py-4" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}>
          <div className="flex gap-3">
            <Btn kind="outline" onClick={onClose} className="flex-1">Batal</Btn>
            <Btn kind="gold" onClick={submit} disabled={busy} className="flex-1">
              {busy ? <Spinner /> : 'Buat & dapatkan link'}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [projects, setProjects] = useState(null)
  const [selected, setSelected] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [session, setSession] = useState(isSupabaseConfigured ? undefined : 'demo')
  const [demoAuthedState, setDemoAuthedState] = useState(() => (isSupabaseConfigured ? true : demoAuthed()))
  const [layoutIssues, setLayoutIssues] = useState(null)
  const [setupNeeded, setSetupNeeded] = useState(false)
  const [setupDetail, setSetupDetail] = useState('')
  const { toasts, add, remove } = useToast()

  useEffect(() => {
    if (!isSupabaseConfigured) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_ev, s) => setSession(s))
    return () => sub?.subscription?.unsubscribe()
  }, [])

  const refresh = async () => {
    try {
      const list = await listProjects()
      setProjects(list)
      setSelected((cur) => {
        if (!cur) return null
        return list.find((p) => p.token === cur.token) || null
      })
      return list
    } catch (e) {
      if (isSetupError(e)) {
        setSetupNeeded(true)
        setSetupDetail(e.message || '')
      } else {
        logger.error('Gagal memuat proyek:', e)
        setProjects([])
      }
      return []
    }
  }

  useEffect(() => {
    if (session) refresh()
  }, [session])

  // Mode demo: live refresh antar-tab (client isi di tab lain → dashboard ter-update)
  useEffect(() => {
    if (isSupabaseConfigured || !session) return
    const onStorage = (e) => {
      if (e.key === 'mw_demo_projects' && e.newValue) refresh()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  // Live update: begitu client menyimpan/submit, dashboard langsung ter-refresh
  useEffect(() => {
    if (!isSupabaseConfigured) return
    const unsubs = []
    projects?.forEach((p) => {
      unsubs.push(subscribeProject(p.token, () => refresh()))
    })
    return () => unsubs.forEach((u) => { try { if (typeof u === 'function') u() } catch {} })
  }, [projects?.length])

  // Polling 30 detik — jaring pengaman kalau realtime Supabase belum diaktifkan
  useEffect(() => {
    if (!isSupabaseConfigured || !session) return
    const id = setInterval(() => { refresh() }, 30000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const filtered = useMemo(() => {
    if (!projects) return []
    const withStatus = projects.map((p) => ({ ...p, _status: effStatus(p) }))
    let list = filter === 'all' ? withStatus : withStatus.filter((p) => p._status === filter)
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter((p) => (p.couple || '').toLowerCase().includes(q) || (p.venue || '').toLowerCase().includes(q) || (p.note || '').toLowerCase().includes(q))
    }
    return list
  }, [projects, filter, search])

  const counts = useMemo(() => {
    const c = { all: projects?.length || 0, invited: 0, partial: 0, submitted: 0, done: 0 }
    projects?.forEach((p) => {
      const s = effStatus(p)
      if (c[s] != null) c[s]++
    })
    return c
  }, [projects])

  if (isSupabaseConfigured && session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (isSupabaseConfigured && !session) {
    return <AuthPage onAuthed={() => setSession({ ok: true })} />
  }

  if (!isSupabaseConfigured && !demoAuthedState) {
    return <DemoAuth onUnlock={() => setDemoAuthedState(true)} />
  }

  if (setupNeeded) {
    return <SetupNeededScreen detail={setupDetail} />
  }

  if (projects === null) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-wedding-pattern bg-ivory">
        <header className="border-b border-ink/5 bg-ivory/90">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Skeleton className="h-9 w-44" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </header>
        <main className="mx-auto w-full min-w-0 max-w-6xl px-4 py-8">
          <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="min-w-0 space-y-3">
              <Skeleton className="h-9 w-full" />
              <div className="flex gap-1.5">
                {[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-7 w-16 rounded-full" />)}
              </div>
              {[0, 1, 2].map((i) => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
            </aside>
            <div className="space-y-4">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
              <div className="grid gap-4 sm:grid-cols-2">
                {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-ivory">
      <header className="sticky top-0 z-40 border-b border-ink/5 bg-ivory/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:py-4">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gold text-white shadow-soft sm:flex">
              <Icon name="brand" className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-xl leading-none text-ink sm:text-2xl">Mentari Wedding</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-gold sm:text-[11px]">Dashboard Moodboard</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {isSupabaseConfigured ? (
              <Btn kind="ghost" size="sm" onClick={() => supabase.auth.signOut()}>Keluar</Btn>
            ) : (
              <Btn kind="ghost" size="sm" onClick={() => { lockDemo(); setDemoAuthedState(false) }} title="Kunci ulang dashboard"><Icon name="lock" className="h-3 w-3" /> Kunci</Btn>
            )}
            <Btn kind="gold" onClick={() => setShowCreate(true)}><Icon name="plus" className="h-3.5 w-3.5" /> Proyek Baru</Btn>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {!isSupabaseConfigured && (
          <div className="mb-6 rounded-2xl border border-gold/40 bg-goldlight/20 px-5 py-3.5 text-[13px] leading-relaxed text-[#7a5c30]">
            <b>Mode Demo</b> — data tersimpan di browser ini saja. Isi <code className="rounded bg-white/70 px-1.5 py-0.5">.env</code> untuk simpan di cloud.
          </div>
        )}

        {projects.length === 0 ? (
          <EmptyState
            icon={<Icon name="gem" className="h-10 w-10 text-gold" />}
            title="Belum ada proyek moodboard"
            desc="Buat proyek pertama — kamu langsung dapat link khusus untuk dikirim ke client via WhatsApp."
            action={<Btn kind="gold" onClick={() => setShowCreate(true)}><Icon name="plus" className="h-3.5 w-3.5" /> Buat Proyek Pertama</Btn>}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
            {/* Sidebar */}
            <aside className="min-w-0 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">Daftar Proyek</p>
                <button
                  onClick={() => setLayoutIssues(findOverflowing())}
                  className="inline-flex items-center gap-1 rounded-full border border-ink/15 px-2.5 py-1 text-[10px] text-stone transition hover:border-gold hover:text-gold"
                  title="Deteksi elemen yang kepotong di kanan layar"
                >
                  <Icon name="search" className="h-2.5 w-2.5" /> Cek Layout
                </button>
              </div>
              <div className="relative">
                <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari pasangan / venue…" className="!py-2 pl-9 text-xs" />
                <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone/60" />
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap">
                {[['all', 'Semua'], ['invited', 'Menunggu'], ['partial', 'Diisi'], ['submitted', 'Selesai'], ['done', 'Diproses']].map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => setFilter(k)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${filter === k ? 'border-ink bg-ink text-ivory' : 'border-ink/15 bg-white text-stone hover:border-gold'}`}
                  >
                    {label} {counts[k] || ''}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                {filtered.map((p) => {
                  const active = selected?.token === p.token
                  const d = mergedData(p)
                  return (
                    <button
                      key={p.token}
                      onClick={() => setSelected(p)}
                      className={`w-full min-w-0 rounded-2xl border p-4 text-left transition ${active ? 'border-gold bg-white shadow-soft' : 'border-ink/5 bg-white/70 hover:border-gold/40'}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-ink">{p.couple || 'Tanpa nama'}</p>
                        <Icon name={STATUS_META[p._status]?.icon} className="h-3.5 w-3.5 text-stone" />
                      </div>
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <span className="truncate text-xs text-stone">{p.date ? formatDate(p.date) : '— tanggal belum diisi'}</span>
                        {d && <span className="shrink-0 text-xs font-semibold text-gold">{computeProgress(d)}%</span>}
                      </div>
                      {d && (
                        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-cream">
                          <div className="h-full rounded-full bg-gradient-to-r from-gold to-goldlight" style={{ width: `${computeProgress(d)}%` }} />
                        </div>
                      )}
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        {p.couple_mode ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-gold"><Icon name="users" className="h-2.5 w-2.5" /> isi bareng</span>
                        ) : <span />}
                        {(p.mb?.updated_at || p.updated_at) && <span className="truncate text-[10px] text-stone/60">diperbarui {timeAgo(p.mb?.updated_at || p.updated_at)}</span>}
                      </div>
                    </button>
                  )
                })}
                {filtered.length === 0 && <p className="py-6 text-center text-sm text-stone">Tidak ada proyek di filter ini.</p>}
              </div>
            </aside>

            {/* Detail */}
            <section className="min-w-0">
              {selected ? (
                <ProjectDetail project={selected} refresh={refresh} toastAdd={add} />
              ) : (
                <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-ink/15 bg-white/40">
                  <p className="text-stone">Pilih proyek di sebelah kiri untuk melihat detail.</p>
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreated={async (token) => {
            setShowCreate(false)
            const list = await refresh()
            const p = list.find((x) => x.token === token)
            setSelected(p || null)
            add('Proyek dibuat! Link sudah siap dibagikan', 'magic')
          }}
        />
      )}
      <Toast toasts={toasts} remove={remove} />

      {/* Hasil Cek Layout */}
      {layoutIssues !== null && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/50 p-4" onClick={() => setLayoutIssues(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-soft" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="font-display text-xl text-ink">Hasil Cek Layout</p>
              <button onClick={() => setLayoutIssues(null)} className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/10" aria-label="Tutup">
                <Icon name="xmark" className="h-3 w-3" />
              </button>
            </div>
            {layoutIssues.length === 0 ? (
              <p className="mt-4 text-sm text-emerald-700">✓ Tidak ada elemen yang meluber — layout aman.</p>
            ) : (
              <>
                <p className="mt-2 text-xs text-stone">Elemen yang melebihi lebar layar ({layoutIssues.length}):</p>
                <div className="mt-2 max-h-72 space-y-1.5 overflow-y-auto">
                  {layoutIssues.map((o, i) => (
                    <div key={i} className="rounded-lg bg-cream/60 px-3 py-2 font-mono text-[10px] leading-relaxed text-ink">
                      <b>&lt;{o.tag}&gt;</b> kanan:{o.right}px lebar:{o.width}px
                      {o.cls && <div className="text-stone">{o.cls}</div>}
                      {o.txt && <div className="text-stone/70 truncate">"{o.txt}"</div>}
                    </div>
                  ))}
                </div>
              </>
            )}
            <button onClick={() => setLayoutIssues(null)} className="mt-4 w-full rounded-full bg-ink py-2.5 text-sm text-ivory">Tutup</button>
          </div>
        </div>
      )}
    </div>
  )
}
