-- ============================================================
-- DIAGNOSA & MIGRASI — "data client tidak muncul di dashboard"
-- Jalankan di supabase.com → SQL Editor → New query → Run
-- ============================================================

-- 1) TABEL APA SAJA YANG ADA di schema public
--    (cari: mw_projects, mw_moodboards, moodboards, projects)
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2) DATA DI TABEL BARU (mw_moodboards) — yang dipakai aplikasi SEKARANG
SELECT project_id, is_draft, submitted_at, updated_at
FROM mw_moodboards
ORDER BY updated_at DESC;

-- 4) PROYEK YANG ADA
SELECT token, couple, created_at
FROM mw_projects
ORDER BY created_at DESC;

-- ============================================================
-- CATATAN: versi aplikasi terbaru TIDAK lagi bergantung pada relasi
-- PostgREST (join). Dashboard membaca tabel mw_moodboards langsung
-- per proyek — jadi meskipun relasi antar tabel belum terdeteksi,
-- data tetap muncul.
-- ============================================================
