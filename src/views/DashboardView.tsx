import React from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { NavTab } from '../components/Sidebar';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  Send,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  MessageSquare,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab }) => {
  const {
    students,
    classes,
    teachers,
    studentAttendance,
    teacherAttendance,
    notificationLogs,
    selectedDate,
    setSelectedClassId,
  } = useAttendance();

  // Calculate statistics for today (selectedDate)
  const todayStudentRecords = studentAttendance.filter((r) => r.date === selectedDate);
  const totalStudents = students.length;

  const countHadir = todayStudentRecords.filter((r) => r.status === 'H').length;
  const countSakit = todayStudentRecords.filter((r) => r.status === 'S').length;
  const countIzin = todayStudentRecords.filter((r) => r.status === 'I').length;
  const countAlpa = todayStudentRecords.filter((r) => r.status === 'A').length;
  const countTerlambat = todayStudentRecords.filter((r) => r.status === 'T').length;

  // Percentage of presence
  const recordedStudents = todayStudentRecords.length || 1;
  const attendanceRate = Math.round(((countHadir + countTerlambat) / recordedStudents) * 100);

  // Teachers statistics
  const todayTeacherRecords = teacherAttendance.filter((r) => r.date === selectedDate);
  const teachersPresent = todayTeacherRecords.filter(
    (t) => t.status === 'H' || t.status === 'Dinas'
  ).length;
  const teachersTotal = teachers.length;
  const teacherRate = Math.round((teachersPresent / (teachersTotal || 1)) * 100);

  // Notifications
  const todayNotifs = notificationLogs.filter((n) => n.date === selectedDate);

  // Attendance by class for selectedDate
  const classBreakdown = classes.map((cls) => {
    const classStudents = students.filter((s) => s.classId === cls.id);
    const classStudentIds = classStudents.map((s) => s.id);
    const classRecords = todayStudentRecords.filter((r) =>
      classStudentIds.includes(r.studentId)
    );

    const hadir = classRecords.filter((r) => r.status === 'H' || r.status === 'T').length;
    const total = classStudents.length;
    const rate = total > 0 ? Math.round((hadir / total) * 100) : 0;
    const alpa = classRecords.filter((r) => r.status === 'A').length;

    return {
      class: cls,
      hadir,
      total,
      rate,
      alpa,
      recorded: classRecords.length,
    };
  });

  // Recent parent notification alerts
  const recentAlerts = notificationLogs
    .filter((n) => n.status !== 'H')
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 bg-[radial-gradient(#60a5fa_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              <span>Sistem Absensi Terpadu</span>
              <span>·</span>
              <span>SMK Taruna Bhakti Kadugede</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Rekapitulasi Kehadiran Harian
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Pantau absensi real-time siswa dan guru, kirim notifikasi WhatsApp ke orang tua,
              serta cetak laporan mingguan dan bulanan resmi.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('absensi-siswa')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Input Absensi Siswa</span>
            </button>
            <button
              onClick={() => onNavigateTab('notifikasi-ortu')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-emerald-400" />
              <span>Broadcast Orang Tua</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tingkat Kehadiran Siswa */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Kehadiran Siswa</span>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {attendanceRate}%
            </span>
            <span className="text-xs text-slate-500">
              ({countHadir} dari {totalStudents} siswa)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-mono tabular-nums">
            <span>S: {countSakit}</span>
            <span>·</span>
            <span>I: {countIzin}</span>
            <span>·</span>
            <span className={countAlpa > 0 ? 'text-red-600 font-bold' : ''}>A: {countAlpa}</span>
            <span>·</span>
            <span>T: {countTerlambat}</span>
          </div>
        </div>

        {/* Card 2: Kehadiran Guru & Staf */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Kehadiran Guru</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CalendarCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {teacherRate}%
            </span>
            <span className="text-xs text-slate-500">
              ({teachersPresent} dari {teachersTotal} guru)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Piket Aktif: 3 Guru</span>
            <span className="text-emerald-700 font-medium">Kegiatan Belajar Normal</span>
          </div>
        </div>

        {/* Card 3: Notifikasi WhatsApp ke Orang Tua */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Notifikasi Real-time</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Send className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {todayNotifs.length}
            </span>
            <span className="text-xs text-emerald-600 font-medium">Terkirim ke Wali</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Via WhatsApp API</span>
            <button
              onClick={() => onNavigateTab('notifikasi-ortu')}
              className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
            >
              Lihat Log
            </button>
          </div>
        </div>

        {/* Card 4: Siswa Perlu Perhatian (Alpa / Terlambat) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Perlu Perhatian</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600 font-mono tabular-nums">
              {countAlpa + countTerlambat}
            </span>
            <span className="text-xs text-slate-500">Siswa (Alpa & Terlambat)</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Alpa: {countAlpa}</span>
            <span>·</span>
            <span>Terlambat: {countTerlambat}</span>
            <button
              onClick={() => onNavigateTab('absensi-siswa')}
              className="text-amber-700 hover:text-amber-900 font-medium cursor-pointer"
            >
              Detail
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Class Attendance Progress & Recent Parent Alert Dispatches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Rekap Kehadiran Siswa Per Kelas */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Rekap Kehadiran Siswa Per Kelas
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Status absensi kelas hari ini ({selectedDate})
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('absensi-siswa')}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Kelola Semua Kelas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {classBreakdown.map((item) => (
              <div
                key={item.class.id}
                className="p-3 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 font-bold text-xs flex items-center justify-center font-mono">
                    {item.class.grade}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {item.class.name}
                      </span>
                      <span className="text-[11px] text-slate-400">·</span>
                      <span className="text-[11px] text-slate-500">
                        Wali: {item.class.homeroomTeacher}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 font-mono tabular-nums">
                      <span>Total: {item.total} Siswa</span>
                      <span>Hadir: {item.hadir}</span>
                      {item.alpa > 0 && (
                        <span className="text-red-600 font-semibold">Alpa: {item.alpa}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                      {item.rate}%
                    </span>
                    <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full ${
                          item.rate >= 90
                            ? 'bg-emerald-500'
                            : item.rate >= 75
                            ? 'bg-blue-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${item.rate}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedClassId(item.class.id);
                      onNavigateTab('absensi-siswa');
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-md text-xs font-medium transition-colors cursor-pointer"
                  >
                    Buka Absensi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Feed Notifikasi WhatsApp Orang Tua & Guru Piket */}
        <div className="space-y-6">
          {/* Recent Notification Dispatches */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Notifikasi Real-time Wali</span>
              </h2>
              <button
                onClick={() => onNavigateTab('notifikasi-ortu')}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                Pusat Pesan
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Kirim kabar kehadiran otomatis saat presensi tersimpan.
            </p>

            <div className="space-y-2.5">
              {recentAlerts.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  Belum ada notifikasi tercatat hari ini.
                </p>
              ) : (
                recentAlerts.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 truncate max-w-[140px]">
                        {notif.studentName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          notif.status === 'A'
                            ? 'bg-red-100 text-red-700'
                            : notif.status === 'S'
                            ? 'bg-amber-100 text-amber-700'
                            : notif.status === 'T'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {notif.status === 'A'
                          ? 'Alpa'
                          : notif.status === 'S'
                          ? 'Sakit'
                          : notif.status === 'T'
                          ? 'Terlambat'
                          : 'Izin'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Wali: {notif.parentName} ({notif.parentPhone})
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200/60 text-[10px] text-slate-400 font-mono">
                      <span>{notif.time} WIB · WhatsApp</span>
                      <a
                        href={`https://wa.me/${notif.parentPhone.replace(/^0/, '62')}?text=${encodeURIComponent(
                          notif.message
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Kirim WA</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Guru Piket Hari Ini */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <h2 className="text-sm font-bold text-slate-900 mb-1">
              Petugas Piket Kesiswaan
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Guru piket yang bertugas mengawasi presensi gerbang.
            </p>

            <div className="space-y-2">
              {teachers
                .filter((t) => t.isPiketToday)
                .map((guru) => (
                  <div
                    key={guru.id}
                    className="p-2.5 rounded-lg border border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{guru.name}</p>
                      <p className="text-[11px] text-slate-500">{guru.subject}</p>
                    </div>
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Bertugas
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
