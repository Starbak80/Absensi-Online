import { createClient } from '@supabase/supabase-js';

// User's provided Supabase Credentials
export const SUPABASE_CONFIG = {
  projectName: 'Rekap-Absensi-Online',
  projectId: 'cbzbqlszvwpvmlpldfwd',
  url:
    import.meta.env.VITE_SUPABASE_URL ||
    'https://cbzbqlszvwpvmlpldfwd.supabase.co',
  anonKey:
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    'sb_publishable_qddSGMdGewYDDn9JlTGzXA_s0YcWYx_',
};

// Normalize URL (strip trailing /rest/v1 if passed by user)
export const cleanSupabaseUrl = (rawUrl: string) => {
  return rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
};

const finalUrl = cleanSupabaseUrl(SUPABASE_CONFIG.url);

export const supabase = createClient(finalUrl, SUPABASE_CONFIG.anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// SQL Schema for the user to run in Supabase SQL Editor
export const SUPABASE_SQL_SCHEMA = `-- SKEMA DATABASE SUPABASE SMK TARUNA BHAKTI KADUGEDE
-- Silakan jalankan script ini di menu "SQL Editor" pada Supabase Dashboard Anda.

-- 1. Tabel Profil Sekolah
CREATE TABLE IF NOT EXISTS public.school_profile (
  id TEXT PRIMARY KEY DEFAULT 'profile-1',
  name TEXT NOT NULL,
  npsn TEXT NOT NULL,
  address TEXT NOT NULL,
  village TEXT,
  district TEXT,
  regency TEXT,
  province TEXT,
  postal_code TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  principal_name TEXT,
  principal_nip TEXT,
  vice_principal_name TEXT,
  vice_principal_nip TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel Kelas
CREATE TABLE IF NOT EXISTS public.classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  major TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  homeroom_teacher TEXT NOT NULL,
  total_students INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabel Siswa
CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY,
  nis TEXT NOT NULL UNIQUE,
  nisn TEXT,
  name TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('L', 'P')),
  class_id TEXT REFERENCES public.classes(id) ON DELETE SET NULL,
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  parent_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabel Guru & Tenaga Kependidikan
CREATE TABLE IF NOT EXISTS public.teachers (
  id TEXT PRIMARY KEY,
  nip TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('L', 'P')),
  subject TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  is_piket_today BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabel Presensi Siswa
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('H', 'S', 'I', 'A', 'T')),
  check_in_time TEXT DEFAULT '06:45',
  notes TEXT,
  notified_parent BOOLEAN DEFAULT true,
  notification_status TEXT DEFAULT 'sent',
  notified_at TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabel Presensi Guru
CREATE TABLE IF NOT EXISTS public.teacher_attendance_records (
  id TEXT PRIMARY KEY,
  teacher_id TEXT REFERENCES public.teachers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('H', 'S', 'I', 'A', 'Dinas', 'Cuti')),
  check_in_time TEXT DEFAULT '06:30',
  check_out_time TEXT DEFAULT '15:30',
  teaching_journal TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tabel Log Notifikasi WhatsApp Orang Tua
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id TEXT PRIMARY KEY,
  student_id TEXT,
  student_name TEXT NOT NULL,
  class_name TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  status TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_via TEXT DEFAULT 'WhatsApp',
  delivery_status TEXT DEFAULT 'delivered',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) & Public Policies (Memudahkan Integrasi Admin)
ALTER TABLE public.school_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Allow anon read/write policies for admin application access
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public access to school_profile" ON public.school_profile;
  CREATE POLICY "Public access to school_profile" ON public.school_profile FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Public access to classes" ON public.classes;
  CREATE POLICY "Public access to classes" ON public.classes FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Public access to students" ON public.students;
  CREATE POLICY "Public access to students" ON public.students FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Public access to teachers" ON public.teachers;
  CREATE POLICY "Public access to teachers" ON public.teachers FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Public access to attendance_records" ON public.attendance_records;
  CREATE POLICY "Public access to attendance_records" ON public.attendance_records FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Public access to teacher_attendance_records" ON public.teacher_attendance_records;
  CREATE POLICY "Public access to teacher_attendance_records" ON public.teacher_attendance_records FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Public access to notification_logs" ON public.notification_logs;
  CREATE POLICY "Public access to notification_logs" ON public.notification_logs FOR ALL USING (true) WITH CHECK (true);
END $$;
`;
