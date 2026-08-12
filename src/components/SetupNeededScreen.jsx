import { useState } from 'react'
import schemaSql from '../../supabase/schema.sql?raw'
import Icon from '../lib/icons'
import { copyText } from '../lib/utils'
import { DB_PREFIX } from '../lib/supabase'

/**
 * Layar "Supabase belum siap" — muncul saat kunci API terisi tapi tabel
 * database belum dibuat (belum menjalankan supabase/schema.sql).
 */
export default function SetupNeededScreen({ detail = '' }) {
  const [copied, setCopied] = useState(false)
  const [showSql, setShowSql] = useState(false)

  const copy = () => {
    copyText(schemaSql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const download = () => {
    const blob = new Blob([schemaSql], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'schema.sql'
    a.click()
    URL.revokeObjectURL(url)
  }

  const expected = [
    `Tabel ${DB_PREFIX}projects`,
    `Tabel ${DB_PREFIX}moodboards`,
    `Bucket ${DB_PREFIX}references`,
  ]

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-gold/25 bg-white p-8 shadow-soft">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-goldlight/30 text-gold">
          <Icon name="info" className="h-6 w-6" />
        </span>
        <h1 className="mt-4 font-display text-3xl text-ink">Supabase Belum Siap</h1>
        <p className="mt-2 text-sm leading-relaxed text-stone">
          Kunci API Supabase sudah terisi dan login berhasil, tapi <b>tabel database belum ada</b> di proyek
          Supabase kamu. Aplikasi ini mencari:
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {expected.map((t) => (
            <span key={t} className="rounded-full border border-gold/30 bg-goldlight/10 px-3 py-1 font-mono text-xs text-[#7a5c30]">
              {t}
            </span>
          ))}
        </div>

        <ol className="mt-5 space-y-3">
          {[
            ['1', 'Klik "Download schema.sql" di bawah — simpan file-nya.'],
            ['2', 'Buka supabase.com → pilih proyek kamu → menu SQL Editor.'],
            ['3', 'Buka isi file schema.sql, salin semua, tempel ke editor, klik Run.'],
            ['4', 'Kembali ke aplikasi ini, klik "Cek Lagi".'],
          ].map(([n, t]) => (
            <li key={n} className="flex items-start gap-3 text-sm text-ink">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs text-ivory">{n}</span>
              <span>{t}</span>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={download}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm text-ivory transition hover:bg-gold"
          >
            <Icon name="download" className="h-3.5 w-3.5" /> Download schema.sql
          </button>
          <button
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm text-stone transition hover:border-gold hover:text-gold"
          >
            <Icon name={copied ? 'check' : 'copy'} className="h-3.5 w-3.5" /> {copied ? 'SQL Tersalin!' : 'Salin SQL'}
          </button>
          <button
            onClick={() => setShowSql(!showSql)}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm text-stone transition hover:border-gold hover:text-gold"
          >
            <Icon name="eye" className="h-3.5 w-3.5" /> {showSql ? 'Sembunyikan' : 'Lihat SQL'}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm text-stone transition hover:border-gold hover:text-gold"
          >
            <Icon name="rotate" className="h-3.5 w-3.5" /> Cek Lagi
          </button>
        </div>

        {/* SQL dalam textarea — disalin apa adanya, tidak bisa berubah format */}
        {showSql && (
          <textarea
            readOnly
            value={schemaSql}
            rows={14}
            onFocus={(e) => e.target.select()}
            className="mt-4 w-full resize-y rounded-xl border border-ink/10 bg-cream/70 p-4 font-mono text-[11px] leading-relaxed text-ink focus:outline-none"
          />
        )}

        <div className="mt-6 space-y-2 rounded-2xl border border-ink/10 bg-cream/50 px-4 py-3 text-xs leading-relaxed text-stone">
          <p className="inline-flex items-center gap-1.5 font-medium text-ink">
            <Icon name="info" className="h-3.5 w-3.5 text-gold" /> SQL-nya berubah format saat ditempel?
          </p>
          <p>
            Kalau yang kamu lihat berbentuk <code className="rounded bg-white px-1">[public.mw](http://public.mw)_projects</code> atau{' '}
            <code className="rounded bg-white px-1">&gt;&gt;</code>, berarti SQL-nya disalin dari chat/email dan rusak.
            Gunakan tombol <b>Download schema.sql</b> lalu buka file-nya — itu versi asli yang pasti benar.
          </p>
          <p className="inline-flex items-center gap-1.5 font-medium text-ink">
            <Icon name="lightbulb" className="h-3.5 w-3.5 text-gold" /> Pernah menjalankan skema versi lama?
          </p>
          <p>
            Versi lama memakai tabel <code className="rounded bg-white px-1">projects</code> (tanpa prefix) — versi
            terbaru memakai <code className="rounded bg-white px-1">{DB_PREFIX}projects</code>. Cukup jalankan skema
            terbaru; tabel lama tidak dipakai lagi dan boleh dibiarkan.
          </p>
          <p className="inline-flex items-center gap-1.5 font-medium text-ink">
            <Icon name="lightbulb" className="h-3.5 w-3.5 text-gold" /> Tidak mau setup sekarang?
          </p>
          <p>
            Kosongkan <code className="rounded bg-white px-1">VITE_SUPABASE_URL</code> dan{' '}
            <code className="rounded bg-white px-1">VITE_SUPABASE_ANON_KEY</code> di <code className="rounded bg-white px-1">.env</code>,
            restart server — aplikasi kembali ke <b>Mode Demo</b>.
          </p>
        </div>

        {detail && (
          <div className="mt-4 rounded-2xl border border-rose/20 bg-rose/5 px-4 py-3">
            <p className="text-[11px] font-medium text-rose">Detail dari server:</p>
            <pre className="mt-1 whitespace-pre-wrap font-mono text-[10px] leading-relaxed text-rose/80">{detail}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
