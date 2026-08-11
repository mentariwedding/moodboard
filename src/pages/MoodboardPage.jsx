import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import {
  getProjectByToken,
  loadMoodboard,
  saveMoodboard,
  saveCouplePart,
  uploadReferenceImage,
  publicUrl,
  isSetupError,
  addMoodboardComment,
} from '../lib/api'
import { EMPTY_DATA, SECTIONS } from '../lib/constants'
import { isSupabaseConfigured } from '../lib/supabase'
import { filledSections } from '../lib/utils'
import WizardShell from '../components/WizardShell'
import SubmittedScreen from '../components/SubmittedScreen'
import SaveTheDate from '../components/SaveTheDate'
import AccessGate from '../components/AccessGate'
import ClosedScreen from '../components/ClosedScreen'
import Icon from '../lib/icons'
import { Skeleton } from '../components/ui'
import { logger } from '../lib/debug'

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-ivory">
      <header className="sticky top-0 z-40 border-b border-ink/5 bg-ivory/90">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-2 h-3 w-24" />
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <Skeleton className="mt-3 h-1.5 w-full rounded-full" />
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 pt-6">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-2 h-9 w-64" />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  )
}

export default function MoodboardPage() {
  const { token } = useParams()
  const [params] = useSearchParams()
  const who = params.get('who') === 'two' ? 'two' : 'one'

  const [project, setProject] = useState(null)
  const [mb, setMb] = useState(null) // row moodboard yang tersimpan (untuk envelope coupleData)
  const [data, setData] = useState(EMPTY_DATA)
  const [comments, setComments] = useState({})
  const [status, setStatus] = useState('loading')
  const [submitted, setSubmitted] = useState(false)
  const [splash, setSplash] = useState(false) // Save-the-Date Card saat mulai dari nol
  const [saving, setSaving] = useState(false)
  const [locked, setLocked] = useState(false) // terkunci kode akses (PIN)
  const [closed, setClosed] = useState(false) // diproses WO — isian terkunci total
  const [autoSaveState, setAutoSaveState] = useState('idle')

  // Pelacak perubahan yang belum disimpan (untuk peringatan sebelum keluar)
  const dirtyRef = useRef(false)
  const submittedRef = useRef(false)
  submittedRef.current = submitted
  const statusRef = useRef(status)
  statusRef.current = status
  const dataRef = useRef(data)
  dataRef.current = data
  const autosaveTimer = useRef(null)

  const setDataSafe = (updater) => {
    dirtyRef.current = true
    setData(updater)
  }

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const p = await getProjectByToken(token)
        if (!alive) return
        if (!p) {
          setStatus('missing')
          return
        }
        setProject(p)
        const row = await loadMoodboard(token)
        if (!alive) return
        setMb(row)
        if (p.couple_mode) {
          const myPart = row?.data?.coupleData?.[who]
          setData(JSON.parse(JSON.stringify(myPart || EMPTY_DATA)))
          // Submit bersifat per-mempelai: hanya tampil layar terkirim
          // jika mempelai ini sudah submit, bukan karena pasangannya submit.
          setSubmitted(myPart?._submitted === true)
          setSplash(!myPart) // belum mulai sama sekali → sambut dengan Save-the-Date
        } else {
          setData(JSON.parse(JSON.stringify(row?.data || EMPTY_DATA)))
          setSubmitted(row?.is_draft === false)
          setSplash(!row?.data || filledSections(row.data) === 0)
        }
        setComments(row?.comments || {})
        setLocked(Boolean(p.pin) && !(localStorage.getItem(`mw_unlock_${token}`) === '1'))
        setClosed(p.status === 'done')
        dirtyRef.current = false
        setStatus('ready')
      } catch (e) {
        if (alive) {
          if (isSetupError(e)) setStatus('setup')
          else setStatus('missing')
        }
      }
    })()
    return () => {
      alive = false
    }
  }, [token, who])

  const persist = async (payload, isDraft) => {
    if (project?.couple_mode) {
      return saveCouplePart(token, mb, who, payload, isDraft)
    }
    return saveMoodboard(token, payload, isDraft)
  }

  // ============ AUTO-SAVE ============
  useEffect(() => {
    if (statusRef.current !== 'ready' || submittedRef.current) return
    dirtyRef.current = true
    setAutoSaveState('dirty')
    clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(async () => {
      setAutoSaveState('saving')
      try {
        await persist(dataRef.current, true)
        dirtyRef.current = false
        setAutoSaveState('saved')
        logger.info('Auto-save berhasil', { token, seksi_terisi: filledSections(dataRef.current) })
      } catch (e) {
        logger.error('Auto-save gagal:', e)
        setAutoSaveState('idle')
      }
    }, 2500)
    return () => clearTimeout(autosaveTimer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  // Peringatan saat meninggalkan halaman dengan perubahan belum disimpan
  useEffect(() => {
    const handler = (e) => {
      if (dirtyRef.current && !submittedRef.current) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [])

  const autoSaveLabel =
    autoSaveState === 'saving' ? 'Menyimpan…' : autoSaveState === 'saved' ? 'Tersimpan otomatis' : 'Belum tersimpan'

  const handleSubmit = async () => {
    const missing = SECTIONS.length - filledSections(data)
    if (missing > 0 && !confirm(`Masih ada ${missing} seksi yang belum diisi. Kirim moodboard tetap? (Kamu bisa kembali lagi nanti)`)) return
    setSaving(true)
    try {
      clearTimeout(autosaveTimer.current)
      await persist(data, false)
      logger.info('Moodboard disubmit', { token, who, seksi_terisi: filledSections(data) })
      dirtyRef.current = false
      setAutoSaveState('idle')
      // Setelah submit, moodboard terkunci lagi — revisi butuh kode akses
      try {
        localStorage.removeItem(`mw_unlock_${token}`)
      } catch {}
      setSubmitted(true)
    } catch (e) {
      alert('Gagal mengirim: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveDraft = async (d) => {
    setSaving(true)
    try {
      clearTimeout(autosaveTimer.current)
      await persist(d, true)
      dirtyRef.current = false
      setAutoSaveState('saved')
    } catch (e) {
      alert('Gagal menyimpan draft: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleAddComment = async (sectionId, text) => {
    const next = await addMoodboardComment(token, sectionId, text, 'client')
    setComments(next)
  }

  const uploadRef = async (dataUrl) => {
    const ref = await uploadReferenceImage(token, dataUrl)
    if (!isSupabaseConfigured) return { demo: true, dataUrl }
    const url = await publicUrl(ref)
    return { path: ref, publicUrl: url }
  }

  if (status === 'loading') {
    return <LoadingSkeleton />
  }

  if (status === 'setup') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-soft">
          <Icon name="info" className="mx-auto h-10 w-10 text-gold" />
          <h1 className="mt-3 font-display text-2xl text-ink">Belum bisa dibuka</h1>
          <p className="mt-2 text-sm text-stone">
            Sistem masih dalam pengaturan oleh Wedding Organizer. Coba lagi nanti ya.
          </p>
        </div>
      </div>
    )
  }

  if (status === 'missing') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-soft">
          <Icon name="brokenHeart" className="mx-auto h-10 w-10 text-rose" />
          <h1 className="mt-3 font-display text-2xl text-ink">Link tidak ditemukan</h1>
          <p className="mt-2 text-sm text-stone">
            Pastikan link yang kamu buka sudah benar, atau minta link baru dari Wedding Organizer kamu.
          </p>
        </div>
      </div>
    )
  }

  if (closed) {
    return <ClosedScreen project={project} token={token} />
  }

  if (submitted) {
    return (
      <SubmittedScreen
        data={data}
        project={project}
        onBack={() => {
          setSubmitted(false)
          // Revisi setelah submit = buka kunci lagi
          setLocked(Boolean(project?.pin))
        }}
      />
    )
  }

  if (locked) {
    return (
      <AccessGate
        project={project}
        onUnlock={() => {
          try {
            localStorage.setItem(`mw_unlock_${token}`, '1')
          } catch {}
          setLocked(false)
        }}
      />
    )
  }

  if (splash) {
    return <SaveTheDate project={project} who={who} onStart={() => setSplash(false)} />
  }

  return (
    <WizardShell
      project={project}
      data={data}
      setData={setDataSafe}
      onSubmit={handleSubmit}
      onSaveDraft={handleSaveDraft}
      onRestart={() => {
        if (confirm('Reset semua jawaban? Tindakan ini tidak bisa dibatalkan.')) {
          setDataSafe(JSON.parse(JSON.stringify(EMPTY_DATA)))
        }
      }}
      saving={saving}
      justSubmitted={submitted}
      uploadRef={uploadRef}
      who={who}
      comments={comments}
      onAddComment={handleAddComment}
      autoSave={{ state: autoSaveState, label: autoSaveLabel }}
    />
  )
}
