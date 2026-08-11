-- ============================================================
-- MENTARI WEDDING — THE WEDDING MOODBOARD
-- Skema Supabase (jalankan di SQL Editor: Dashboard > SQL Editor)
-- AMAN dijalankan ulang berkali-kali (idempotent).
-- Semua tabel & bucket memakai prefix mw_ supaya tidak bentrok
-- dengan aplikasi lain di proyek Supabase yang sama.
--
-- PENTING: jangan salin SQL ini dari chat/email/WhatsApp — format
-- teks bisa berubah (misal: nama tabel berubah jadi tautan aneh)
-- dan SQL jadi error.
-- Gunakan tombol "Download schema.sql" atau "Salin SQL Skema"
-- di aplikasi, lalu tempel ke SQL Editor.
-- ============================================================

-- ---------- TABEL ----------

create table if not exists mw_projects (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,              -- token link client (cth: a1b2c3d4)
  couple text not null,                    -- nama pasangan (cth: Salsabila & Raka)
  venue text not null default '',
  date date,
  note text not null default '',           -- catatan internal WO
  status text not null default 'invited'
    check (status in ('invited', 'partial', 'submitted', 'done')),
  couple_mode boolean not null default false, -- mode isi bareng: 2 link (mempelai 1 & 2)
  pin text not null default '',               -- kode akses client (4-6 digit, opsional)
  client_wa text not null default '',          -- nomor WA client (tujuan tombol Kirim via WA)
  staff_notes jsonb not null default '{}'::jsonb, -- catatan/keputusan WO per seksi
  created_at timestamptz not null default now()
);

create table if not exists mw_moodboards (
  id uuid primary key default gen_random_uuid(),
  project_id text not null unique
    references mw_projects (token) on delete cascade,
  data jsonb not null default '{}'::jsonb, -- semua jawaban client
  is_draft boolean not null default true,
  submitted_at timestamptz,
  comments jsonb not null default '{}'::jsonb, -- komentar per seksi (WO <-> client)
  updated_at timestamptz not null default now()
);

-- ---------- ROW LEVEL SECURITY ----------

alter table mw_projects enable row level security;
alter table mw_moodboards enable row level security;

-- WO (sudah login): akses penuh ke proyek & moodboard
drop policy if exists "wo manage projects" on mw_projects;
create policy "wo manage projects" on mw_projects
  for all to authenticated using (true) with check (true);

drop policy if exists "wo read moodboards" on mw_moodboards;
create policy "wo read moodboards" on mw_moodboards
  for all to authenticated using (true) with check (true);

-- Client (tanpa login, lewat link): hanya bisa baca proyek yang
-- token-nya cocok dengan header x-project-token yang dikirim aplikasi.
drop policy if exists "client read own project" on mw_projects;
create policy "client read own project" on mw_projects
  for select to anon
  using (token = current_setting('request.headers', true)::json->>'x-project-token');

-- Client: simpan/edit moodboard miliknya sendiri (draft maupun submit)
drop policy if exists "client upsert own moodboard" on mw_moodboards;
create policy "client upsert own moodboard" on mw_moodboards
  for all to anon
  using (project_id = current_setting('request.headers', true)::json->>'x-project-token')
  with check (project_id = current_setting('request.headers', true)::json->>'x-project-token');

-- ---------- STORAGE (foto referensi) ----------

insert into storage.buckets (id, name, public)
values ('mw_references', 'mw_references', true)
on conflict (id) do nothing;

-- WO: akses penuh ke semua foto
drop policy if exists "wo all references" on storage.objects;
create policy "wo all references" on storage.objects
  for all to authenticated
  using (bucket_id = 'mw_references');

-- Client: hanya bisa upload/baca/hapus foto di folder token-nya sendiri
drop policy if exists "client upload own references" on storage.objects;
create policy "client upload own references" on storage.objects
  for insert to anon
  with check (
    bucket_id = 'mw_references'
    and (storage.foldername(name))[1] = current_setting('request.headers', true)::json->>'x-project-token'
  );

drop policy if exists "client read own references" on storage.objects;
create policy "client read own references" on storage.objects
  for select to anon
  using (
    bucket_id = 'mw_references'
    and (storage.foldername(name))[1] = current_setting('request.headers', true)::json->>'x-project-token'
  );

drop policy if exists "client delete own references" on storage.objects;
create policy "client delete own references" on storage.objects
  for delete to anon
  using (
    bucket_id = 'mw_references'
    and (storage.foldername(name))[1] = current_setting('request.headers', true)::json->>'x-project-token'
  );

-- Komentar per seksi (WO <-> client) — untuk database yang sudah dibuat sebelumnya
ALTER TABLE mw_moodboards ADD COLUMN IF NOT EXISTS comments jsonb NOT NULL DEFAULT '{}'::jsonb;
