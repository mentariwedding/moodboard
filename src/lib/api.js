import { supabase, isSupabaseConfigured, clientSupabaseWithToken, TABLE, BUCKET } from './supabase'
import { logger } from './debug'
import { makeToken, uid } from './utils'
import { EMPTY_DATA } from './constants'

// ============================================================
// MODE DEMO — tanpa Supabase terpasang, data disimpan di localStorage
// supaya aplikasi tetap bisa dicoba langsung di preview browser.
// ============================================================

/** Deteksi error 'tabel belum ada di Supabase' (belum menjalankan schema.sql). */
export function isSetupError(err) {
  const msg = err?.message || ''
  const code = err?.code || ''
  return code === '42P01' || msg.includes('Could not find the table') || msg.includes('does not exist') || msg.includes('relation') || msg.includes('schema cache')
}

const demoProjects = () =>
  JSON.parse(localStorage.getItem('mw_demo_projects') || '{}')

function demoSave(p) {
  const all = demoProjects()
  all[p.token] = p
  localStorage.setItem('mw_demo_projects', JSON.stringify(all))
}

// ============================================================
// PROYEK (diisi oleh WO)
// ============================================================

export async function createProject({ couple, venue, date, note, coupleMode, clientWa }) {
  const token = makeToken()
  if (isSupabaseConfigured) {
    const { error } = await supabase.from(TABLE('projects')).insert({
      token,
      couple,
      venue: venue || '',
      date: date || null,
      note: note || '',
      status: 'invited',
      couple_mode: Boolean(coupleMode),
      client_wa: clientWa || '',
    })
    if (error) { logger.error('API error', error); throw new Error(error.message) }
    return token
  }
  demoSave({
    token,
    couple,
    venue: venue || '',
    date: date || null,
    note: note || '',
    status: 'invited',
    couple_mode: Boolean(coupleMode),
    client_wa: clientWa || '',
    created: new Date().toISOString(),
  })
  return token
}

export async function listProjects() {
  if (isSupabaseConfigured) {
    const mbKey = TABLE('moodboards')
    // 1) Ambil semua proyek
    let projects = []
    try {
      const { data, error } = await supabase
        .from(TABLE('projects'))
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      projects = data || []
    } catch (e) {
      logger.error('listProjects gagal:', e)
      throw new Error(e.message)
    }

    // 2) Ambil SEMUA moodboard dalam satu query (tanpa join — tidak bergantung relasi PostgREST)
    const mbByToken = {}
    try {
      const { data: mbs, error: mbErr } = await supabase
        .from(TABLE('moodboards'))
        .select('project_id, is_draft, data, comments, submitted_at, updated_at')
      if (mbErr) throw mbErr
      ;(mbs || []).forEach((r) => { mbByToken[r.project_id] = r })
    } catch (e) {
      logger.warn('Muat semua moodboard gagal:', e?.message || e)
    }

    // 3) Gabungkan
    const out = projects.map((p) => ({ ...p, mb: mbByToken[p.token] || null }))
    logger.info('listProjects OK', { jumlah: out.length, dengan_mb: out.filter((p) => p.mb).length })
    return out
  }
  return Object.values(demoProjects())
    .map((p) => ({ ...p, mb: p.data ? { data: p.data, is_draft: p.is_draft ?? true, comments: p.comments || {} } : null }))
    .sort((a, b) => (b.created || '').localeCompare(a.created || ''))
}

export async function getProjectByToken(token) {
  if (isSupabaseConfigured) {
    // Pakai client ber-header token supaya RLS client (anon) berfungsi.
    const client = clientSupabaseWithToken(token)
    const { data, error } = await client
      .from(TABLE('projects'))
      .select('*')
      .eq('token', token)
      .maybeSingle()
    if (error) { logger.error('API error', error); throw new Error(error.message) }
    return data
  }
  return demoProjects()[token] || null
}

export async function deleteProject(token) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from(TABLE('projects')).delete().eq('token', token)
    if (error) { logger.error('API error', error); throw new Error(error.message) }
    return
  }
  const all = demoProjects()
  delete all[token]
  localStorage.setItem('mw_demo_projects', JSON.stringify(all))
}

export async function updateProject(token, patch) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from(TABLE('projects')).update(patch).eq('token', token)
    if (error) { logger.error('API error', error); throw new Error(error.message) }
    return
  }
  const p = demoProjects()[token]
  if (p) {
    Object.assign(p, patch)
    demoSave(p)
  }
}

export async function updateStaffNotes(token, notes) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from(TABLE('projects')).update({ staff_notes: notes }).eq('token', token)
    if (error) { logger.error('API error', error); throw new Error(error.message) }
    return
  }
  const p = demoProjects()[token]
  if (p) {
    p.staff_notes = notes
    demoSave(p)
  }
  try { localStorage.setItem(`mw_notes_${token}`, JSON.stringify(notes)) } catch {}
}

export async function duplicateProject(token) {
  const p = await getProjectByToken(token)
  if (!p) throw new Error('Proyek tidak ditemukan')
  const newToken = await createProject({
    couple: p.couple,
    venue: p.venue,
    date: p.date,
    note: p.note,
    coupleMode: p.couple_mode,
    clientWa: p.client_wa,
  })
  // Salin catatan WO (staff notes) ke proyek baru — isian client TIDAK disalin
  if (p.staff_notes && Object.keys(p.staff_notes).length) {
    await updateStaffNotes(newToken, p.staff_notes)
  }
  return newToken
}

export async function updateProjectStatus(token, status) {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from(TABLE('projects'))
      .update({ status })
      .eq('token', token)
    if (error) { logger.error('API error', error); throw new Error(error.message) }
    return
  }
  const p = demoProjects()[token]
  if (p) {
    p.status = status
    demoSave(p)
  }
}

// ============================================================
// MOODBOARD DATA (diisi oleh CLIENT)
// ============================================================

export async function saveMoodboard(token, data, isDraft) {
  if (isSupabaseConfigured) {
    const client = clientSupabaseWithToken(token)
    const { error } = await client.from(TABLE('moodboards')).upsert(
      {
        project_id: token,
        data,
        is_draft: isDraft === false ? false : true,
        submitted_at: isDraft === false ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'project_id' },
    )
    if (error) {
      logger.error('saveMoodboard gagal:', error)
      throw new Error(error.message)
    }
    return
  }
  const p = demoProjects()[token]
  if (p) {
    p.data = data
    p.is_draft = isDraft === false ? false : true
    p.submitted_at = isDraft === false ? new Date().toISOString() : p.submitted_at || null
    p.updated_at = new Date().toISOString()
    demoSave(p)
  }
}

/** Ambil data moodboard milik satu mempelai dalam mode isi bareng. */
export function couplePartData(mbData, who) {
  return mbData?.coupleData?.[who] || null
}

/** Simpan data satu mempelai ke envelope coupleData (menggabung dengan milik pasangan). */
export async function saveCouplePart(token, mbData, who, partData, isDraft) {
  const myPart = isDraft === false ? { ...partData, _submitted: true } : partData
  const existing = mbData?.data?.coupleData || mbData?.coupleData || {}
  const envelope = {
    coupleData: {
      ...existing,
      [who]: myPart,
    },
  }
  return saveMoodboard(token, envelope, isDraft)
}

export async function loadMoodboard(token) {
  if (isSupabaseConfigured) {
    const client = clientSupabaseWithToken(token)
    // Tabel baru (prefix mw_)
    try {
      const { data, error } = await client
        .from(TABLE('moodboards'))
        .select('*')
        .eq('project_id', token)
        .maybeSingle()
      if (error) throw error
      if (data) return data
    } catch (e) {
      logger.warn('loadMoodboard (mw_) gagal:', e?.message || e)
    }
    return null
  }
  const p = demoProjects()[token]
  if (p && p.data) {
    return {
      data: p.data,
      is_draft: p.is_draft,
      submitted_at: p.submitted_at,
      updated_at: p.updated_at,
      comments: p.comments || {},
    }
  }
  return null
}

/** Tambah komentar WO/client pada satu seksi moodboard. */
export async function addMoodboardComment(token, sectionId, text, author) {
  const row = await loadMoodboard(token)
  const comments = row?.comments || {}
  const list = comments[sectionId] || []
  const next = {
    ...comments,
    [sectionId]: [...list, { id: uid(), author, text, at: new Date().toISOString() }],
  }
  if (isSupabaseConfigured) {
    const client = clientSupabaseWithToken(token)
    const { error } = await client.from(TABLE('moodboards')).update({ comments: next }).eq('project_id', token)
    if (error) { logger.error('API error', error); throw new Error(error.message) }
  } else {
    const p = demoProjects()[token]
    if (p) {
      p.comments = next
      demoSave(p)
    }
  }
  return next
}

// Cache channel per token — cegah dobel subscribe & error "cannot add callbacks after subscribe()"
const subscribeCache = new Map()

export async function subscribeProject(token, cb) {
  if (!isSupabaseConfigured || !supabase) return () => {}

  // Kalau sudah ada channel untuk token ini, cukup tambahkan callback (tanpa subscribe ulang)
  const existing = subscribeCache.get(token)
  if (existing) {
    existing.cbs.push(cb)
    return () => {
      existing.cbs = existing.cbs.filter((f) => f !== cb)
    }
  }

  try {
    // Nama channel unik + status subscribe — hindari konflik nama channel
    const channelName = 'mb-' + token + '-' + Date.now()
    const entry = { cbs: [cb], channel: null, status: 'pending' }
    subscribeCache.set(token, entry)

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE('moodboards'), filter: `project_id=eq.${token}` },
        (payload) => entry.cbs.forEach((f) => { try { f(payload) } catch {} }),
      )
      .subscribe((status) => {
        entry.status = status
      })
    entry.channel = channel

    return () => {
      // Hapus callback; kalau tidak ada callback tersisa, tutup channel
      entry.cbs = entry.cbs.filter((f) => f !== cb)
      if (entry.cbs.length === 0) {
        subscribeCache.delete(token)
        try {
          supabase.removeChannel(channel)
        } catch {}
      }
    }
  } catch (e) {
    logger.warn('Gagal subscribe:', e?.message || e)
    return () => {}
  }
}

// ============================================================
// UPLOAD FOTO (client) & DELETE (wo)
// ============================================================

export async function uploadReferenceImage(token, dataUrl) {
  if (isSupabaseConfigured) {
    const client = clientSupabaseWithToken(token)
    const filePath = `${token}/${uid()}.jpg`
    const { error } = await client.storage
      .from(BUCKET)
      .upload(filePath, dataURLtoBlob(dataUrl), {
        contentType: 'image/jpeg',
        upsert: true,
      })
    if (error) { logger.error('API error', error); throw new Error(error.message) }
    return filePath
  }
  // Demo: pemanggil (MoodboardPage) yang menyimpan dataURL-nya sendiri
  return { demo: true, dataUrl }
}

export async function publicUrl(filePath) {
  if (isSupabaseConfigured) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath)
    return data.publicUrl
  }
  return filePath
}

export function dataURLtoBlob(dataUrl) {
  const [head, body] = dataUrl.split(',')
  const mime = head.match(/:(.*?);/)[1]
  const bin = atob(body)
  const arr = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
  return new Blob([arr], { type: mime })
}
