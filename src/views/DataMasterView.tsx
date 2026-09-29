import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { Student, Teacher } from '../types';
import {
  School,
  Users,
  GraduationCap,
  Plus,
  Trash2,
  Edit,
  Save,
  RotateCcw,
  Search,
  Check,
  Shield,
  Phone,
  Database,
  UploadCloud,
  CheckCircle2,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { SchoolLogo } from '../components/SchoolLogo';
import { SUPABASE_CONFIG, SUPABASE_SQL_SCHEMA } from '../lib/supabase';
import { pushAllDataToSupabase, testSupabaseConnection } from '../services/supabaseService';

export const DataMasterView: React.FC = () => {
  const {
    schoolProfile,
    updateSchoolProfile,
    classes,
    students,
    teachers,
    studentAttendance,
    teacherAttendance,
    notificationLogs,
    addStudent,
    updateStudent,
    deleteStudent,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    resetToDefaultData,
  } = useAttendance();

  const [activeTab, setActiveTab] = useState<'sekolah' | 'siswa' | 'guru' | 'kelas' | 'database'>('sekolah');
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [supabaseMessage, setSupabaseMessage] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [searchStudent, setSearchStudent] = useState('');
  const [searchTeacher, setSearchTeacher] = useState('');

  // Edit/Add modal states
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [saveAlert, setSaveAlert] = useState<string | null>(null);

  // New Student Form
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({
    nis: '',
    nisn: '',
    name: '',
    gender: 'L',
    classId: classes[0]?.id || '',
    parentName: '',
    parentPhone: '',
    parentAddress: '',
  });

  // New Teacher Form
  const [newTeacher, setNewTeacher] = useState<Omit<Teacher, 'id'>>({
    nip: '',
    name: '',
    gender: 'L',
    subject: '',
    phone: '',
    email: '',
    isPiketToday: false,
  });

  // Local school profile state
  const [localProfile, setLocalProfile] = useState(schoolProfile);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolProfile(localProfile);
    setSaveAlert('Profil sekolah berhasil disimpan!');
    setTimeout(() => setSaveAlert(null), 3000);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.nis) return;
    addStudent(newStudent);
    setShowAddStudentModal(false);
    setNewStudent({
      nis: '',
      nisn: '',
      name: '',
      gender: 'L',
      classId: classes[0]?.id || '',
      parentName: '',
      parentPhone: '',
      parentAddress: '',
    });
    setSaveAlert('Data siswa berhasil ditambahkan!');
    setTimeout(() => setSaveAlert(null), 3000);
  };

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.nip) return;
    addTeacher(newTeacher);
    setShowAddTeacherModal(false);
    setNewTeacher({
      nip: '',
      name: '',
      gender: 'L',
      subject: '',
      phone: '',
      email: '',
      isPiketToday: false,
    });
    setSaveAlert('Data guru berhasil ditambahkan!');
    setTimeout(() => setSaveAlert(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
              <span>Pengaturan & Basis Data</span>
              <span>·</span>
              <span>SMK Taruna Bhakti Kadugede</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Data Master & Profil Institusi
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola data identitas sekolah, informasi kepala sekolah, data induk siswa, dan guru pengajar.
            </p>
          </div>

          <button
            onClick={() => {
              if (confirm('Kembalikan semua data ke pengaturan awal SMK Taruna Bhakti Kadugede?')) {
                resetToDefaultData();
                setSaveAlert('Data berhasil di-reset ke nilai default.');
                setTimeout(() => setSaveAlert(null), 3000);
              }
            }}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Data Default</span>
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-4 mt-4 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'sekolah', label: 'Profil Sekolah & Pejabat', icon: School },
            { id: 'siswa', label: `Data Siswa (${students.length})`, icon: GraduationCap },
            { id: 'guru', label: `Data Guru (${teachers.length})`, icon: Users },
            { id: 'kelas', label: `Data Kelas (${classes.length})`, icon: Shield },
            { id: 'database', label: 'Database Supabase Cloud', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {saveAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{saveAlert}</span>
        </div>
      )}

      {/* Tab: Profil Sekolah */}
      {activeTab === 'sekolah' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
            <SchoolLogo size={56} />
            <div>
              <h2 className="text-base font-bold text-slate-900">{localProfile.name}</h2>
              <p className="text-xs text-slate-500">
                NPSN: {localProfile.npsn} · Kabupaten Kuningan, Jawa Barat
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Resmi Sekolah</label>
              <input
                type="text"
                value={localProfile.name}
                onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NPSN</label>
              <input
                type="text"
                value={localProfile.npsn}
                onChange={(e) => setLocalProfile({ ...localProfile, npsn: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
              <input
                type="text"
                value={localProfile.address}
                onChange={(e) => setLocalProfile({ ...localProfile, address: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Resmi</label>
              <input
                type="email"
                value={localProfile.email}
                onChange={(e) => setLocalProfile({ ...localProfile, email: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon / WA Sekolah</label>
              <input
                type="text"
                value={localProfile.phone}
                onChange={(e) => setLocalProfile({ ...localProfile, phone: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            {/* Pejabat Penandatangan */}
            <div className="pt-4 md:col-span-2 border-t border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 mb-3">
                Pejabat Penandatangan Laporan Resmi
              </h3>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Kepala Sekolah</label>
              <input
                type="text"
                value={localProfile.principalName}
                onChange={(e) => setLocalProfile({ ...localProfile, principalName: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={localProfile.principalNip}
                onChange={(e) => setLocalProfile({ ...localProfile, principalNip: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Waka Kesiswaan</label>
              <input
                type="text"
                value={localProfile.vicePrincipalName}
                onChange={(e) => setLocalProfile({ ...localProfile, vicePrincipalName: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIP Waka Kesiswaan</label>
              <input
                type="text"
                value={localProfile.vicePrincipalNip}
                onChange={(e) => setLocalProfile({ ...localProfile, vicePrincipalNip: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Profil</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Data Siswa */}
      {activeTab === 'siswa' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari siswa atau NIS..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Siswa Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 w-12 text-center">No</th>
                  <th className="py-2.5 px-4 w-24">NIS</th>
                  <th className="py-2.5 px-4">Nama Siswa</th>
                  <th className="py-2.5 px-4 w-28">Kelas</th>
                  <th className="py-2.5 px-4">Wali Murid</th>
                  <th className="py-2.5 px-4 w-32">No WhatsApp</th>
                  <th className="py-2.5 px-4 w-20 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students
                  .filter(
                    (s) =>
                      s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
                      s.nis.includes(searchStudent)
                  )
                  .map((std, idx) => {
                    const cls = classes.find((c) => c.id === std.classId);
                    return (
                      <tr key={std.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-4 text-center text-slate-400 font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-4 font-mono font-medium text-slate-700">
                          {std.nis}
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">
                          {std.name}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">
                          {cls?.name || '-'}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">
                          {std.parentName}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-emerald-700">
                          {std.parentPhone}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <button
                            onClick={() => {
                              if (confirm(`Hapus siswa ${std.name}?`)) {
                                deleteStudent(std.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Data Guru */}
      {activeTab === 'guru' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama guru atau NIP..."
                value={searchTeacher}
                onChange={(e) => setSearchTeacher(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <button
              onClick={() => setShowAddTeacherModal(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Guru Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 w-12 text-center">No</th>
                  <th className="py-2.5 px-4">Nama Guru & NIP</th>
                  <th className="py-2.5 px-4">Mata Pelajaran</th>
                  <th className="py-2.5 px-4 w-32 font-mono">No HP</th>
                  <th className="py-2.5 px-4 w-28 text-center">Status Piket</th>
                  <th className="py-2.5 px-4 w-20 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers
                  .filter((t) => t.name.toLowerCase().includes(searchTeacher.toLowerCase()))
                  .map((t, idx) => (
                    <tr key={t.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-4 text-center text-slate-400 font-mono">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="font-semibold text-slate-900">{t.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">NIP: {t.nip}</div>
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">{t.subject}</td>
                      <td className="py-2.5 px-4 font-mono text-slate-700">{t.phone}</td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={() => updateTeacher(t.id, { isPiketToday: !t.isPiketToday })}
                          className={`px-2 py-0.5 rounded text-[11px] font-medium border cursor-pointer ${
                            t.isPiketToday
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {t.isPiketToday ? 'Piket Aktif' : 'Bukan Piket'}
                        </button>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={() => {
                            if (confirm(`Hapus data guru ${t.name}?`)) {
                              deleteTeacher(t.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                          title="Hapus Guru"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Data Kelas */}
      {activeTab === 'kelas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => {
            const count = students.filter((s) => s.classId === cls.id).length;
            return (
              <div
                key={cls.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 font-bold text-sm flex items-center justify-center font-mono">
                    {cls.grade}
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                    {count} Siswa
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Kelas {cls.name}</h3>
                  <p className="text-xs text-slate-500">
                    Jurusan: {cls.major} · Tahun Ajaran {cls.academicYear}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <span className="text-slate-400">Wali Kelas:</span>
                  <p className="font-medium text-slate-800 truncate">{cls.homeroomTeacher}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Database Supabase Cloud */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-300 flex items-center justify-center shrink-0">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">
                      Supabase Cloud Database
                    </h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
                      ONLINE
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Proyek: {SUPABASE_CONFIG.projectName} · ID: {SUPABASE_CONFIG.projectId}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const res = await testSupabaseConnection();
                    setSupabaseMessage(res.message);
                    setTimeout(() => setSupabaseMessage(null), 5000);
                  }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                >
                  Uji Koneksi Supabase
                </button>

                <button
                  type="button"
                  disabled={isSyncingSupabase}
                  onClick={async () => {
                    setIsSyncingSupabase(true);
                    setSupabaseMessage(null);
                    const res = await pushAllDataToSupabase({
                      schoolProfile,
                      classes,
                      students,
                      teachers,
                      studentAttendance,
                      teacherAttendance,
                      notificationLogs,
                    });
                    setIsSyncingSupabase(false);
                    setSupabaseMessage(res.message);
                    setTimeout(() => setSupabaseMessage(null), 6000);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>
                    {isSyncingSupabase
                      ? 'Menyinkronkan...'
                      : 'Sinkronkan Data ke Supabase'}
                  </span>
                </button>
              </div>
            </div>

            {supabaseMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{supabaseMessage}</span>
              </div>
            )}

            {/* Connection Credentials Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Detail Konfigurasi Proyek
                </span>
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
                  <span className="text-slate-500">Project Name</span>
                  <span className="font-semibold text-slate-900">{SUPABASE_CONFIG.projectName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
                  <span className="text-slate-500">Project ID</span>
                  <span className="font-mono font-semibold text-slate-800">{SUPABASE_CONFIG.projectId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Project URL</span>
                  <span className="font-mono text-blue-700 text-[11px] truncate max-w-[220px]">
                    {SUPABASE_CONFIG.url}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Kredensial API Key
                </span>
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
                  <span className="text-slate-500">Key Type</span>
                  <span className="font-semibold text-emerald-700">Publishable / Anon</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
                  <span className="text-slate-500">Kunci API</span>
                  <span className="font-mono text-slate-700 text-[11px] truncate max-w-[220px]">
                    {SUPABASE_CONFIG.anonKey.slice(0, 18)}••••••••
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Status Gateway</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Aktif & Siap Query
                  </span>
                </div>
              </div>
            </div>

            {/* SQL Migration Script Box */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Script SQL Supabase DDL & RLS Policies
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Gunakan script ini di menu SQL Editor pada Dashboard Supabase Anda:
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 2000);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      <span>Salin Script SQL</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed border border-slate-800">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tambah Siswa Baru */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Tambah Siswa Baru
            </h3>

            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">NIS *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 260111"
                    value={newStudent.nis}
                    onChange={(e) => setNewStudent({ ...newStudent, nis: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">NISN</label>
                  <input
                    type="text"
                    placeholder="0087654399"
                    value={newStudent.nisn}
                    onChange={(e) => setNewStudent({ ...newStudent, nisn: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Nama Lengkap Siswa *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama lengkap siswa"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Jenis Kelamin</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, gender: e.target.value as 'L' | 'P' })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Kelas</label>
                  <select
                    value={newStudent.classId}
                    onChange={(e) => setNewStudent({ ...newStudent, classId: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    placeholder="Bpk / Ibu..."
                    value={newStudent.parentName}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, parentName: e.target.value })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">No WhatsApp Wali *</label>
                  <input
                    type="text"
                    required
                    placeholder="08123456789"
                    value={newStudent.parentPhone}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, parentPhone: e.target.value })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Alamat Tempat Tinggal</label>
                <input
                  type="text"
                  placeholder="Desa Kadugede, Kuningan..."
                  value={newStudent.parentAddress}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, parentAddress: e.target.value })
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tambah Guru Baru */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Tambah Guru / Tenaga Kependidikan
            </h3>

            <form onSubmit={handleCreateTeacher} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">NIP / NUPTK *</label>
                <input
                  type="text"
                  required
                  placeholder="19850101 201001 1 001"
                  value={newTeacher.nip}
                  onChange={(e) => setNewTeacher({ ...newTeacher, nip: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bambang Sudrajat, S.Kom"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Mata Pelajaran yang Diampu</label>
                <input
                  type="text"
                  placeholder="Contoh: Produktif RPL / Pemrograman Dasar"
                  value={newTeacher.subject}
                  onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Nomor HP/WA</label>
                  <input
                    type="text"
                    placeholder="08123456789"
                    value={newTeacher.phone}
                    onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="guru@kadugede.sch.id"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Simpan Data Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
