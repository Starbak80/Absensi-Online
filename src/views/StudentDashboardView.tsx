import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import {
  GraduationCap,
  Search,
  Calendar,
  MessageCircle,
  Printer,
  User,
  Phone,
  MapPin,
  Clock,
  TrendingUp,
  Award,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { SchoolLogo } from '../components/SchoolLogo';

export const StudentDashboardView: React.FC = () => {
  const { students, classes, studentAttendance, schoolProfile } = useAttendance();

  // Selected student
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClassId, setFilterClassId] = useState<string>('all');

  const selectedStudent =
    students.find((s) => s.id === selectedStudentId) || students[0];
  const studentClass = classes.find((c) => c.id === selectedStudent?.classId);

  // Student's complete attendance records
  const records = studentAttendance
    .filter((r) => r.studentId === selectedStudent?.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Compute metrics
  const totalDays = records.length || 1;
  const countH = records.filter((r) => r.status === 'H').length;
  const countS = records.filter((r) => r.status === 'S').length;
  const countI = records.filter((r) => r.status === 'I').length;
  const countA = records.filter((r) => r.status === 'A').length;
  const countT = records.filter((r) => r.status === 'T').length;

  const attendancePercentage = Math.round(((countH + countT) / totalDays) * 100);

  // Discipline tier
  const getDisciplineStatus = (rate: number, alpa: number) => {
    if (alpa === 0 && rate >= 95) {
      return {
        label: 'Sangat Disiplin (Teladan)',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        note: 'Kehadiran konsisten dan memenuhi standar ketuntasan disiplin.',
      };
    } else if (alpa <= 1 && rate >= 85) {
      return {
        label: 'Disiplin Baik',
        color: 'text-blue-700 bg-blue-50 border-blue-200',
        note: 'Tingkat kehadiran baik, pertahankan kedisiplinan belajar.',
      };
    } else {
      return {
        label: 'Perlu Perhatian Kesiswaan',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        note: 'Terdapat catatan ketidakhadiran/alpa, perlu koordinasi wali kelas.',
      };
    }
  };

  const discipline = getDisciplineStatus(attendancePercentage, countA);

  // Filter students for search/select
  const filteredStudents = students.filter((s) => {
    const matchesClass = filterClassId === 'all' || s.classId === filterClassId;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.includes(searchQuery);
    return matchesClass && matchesSearch;
  });

  // Share report to parent via WhatsApp
  const handleSendReportWA = () => {
    if (!selectedStudent || !studentClass) return;

    let phone = selectedStudent.parentPhone.replace(/[^0-9]/g, '');
    if (phone.startsWith('0')) {
      phone = '62' + phone.slice(1);
    }

    const message = `*LAPORAN KEHADIRAN SISWA*\n*SMK TARUNA BHAKTI KADUGEDE*\n============================\nYth. Bapak/Ibu ${selectedStudent.parentName}\nWali dari ananda:\nNama: *${selectedStudent.name}*\nNIS: *${selectedStudent.nis}*\nKelas: *${studentClass.name}*\n\n*Rekapitulasi Presensi Periode Berjalan:*\n- Total Hari Efektif: ${totalDays} Hari\n- Hadir: ${countH} Hari\n- Sakit: ${countS} Hari\n- Izin: ${countI} Hari\n- Terlambat: ${countT} Hari\n- Alpa (Tanpa Keterangan): ${countA} Hari\n\n*Persentase Kehadiran: ${attendancePercentage}%*\n*Status Kedisiplinan: ${discipline.label}*\n\nTerima kasih atas kerja sama Bapak/Ibu dalam mendukung kedisiplinan ananda.\n\n_Pusat Kesiswaan SMK Taruna Bhakti Kadugede_\n_Wali Kelas: ${studentClass.homeroomTeacher}_`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Student Finder */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
              <span>Menu Portal Kesiswaan</span>
              <span>·</span>
              <span>Dashboard Siswa</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Profil & Kartu Presensi Siswa
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Lihat riwayat kehadiran individual, catatan kedisiplinan, dan rekap untuk wali murid.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterClassId}
              onChange={(e) => setFilterClassId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
            >
              <option value="all">Semua Kelas</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="relative w-48 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari siswa atau NIS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Quick Student Horizontal Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-slate-100 pb-1 scrollbar-none">
          {filteredStudents.slice(0, 15).map((std) => {
            const isSelected = std.id === selectedStudent?.id;
            return (
              <button
                key={std.id}
                onClick={() => setSelectedStudentId(std.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{std.name}</span>
                <span
                  className={`text-[10px] font-mono px-1 rounded ${
                    isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {std.nis}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Student Card (Printable Area) */}
      {selectedStudent && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden print:border-none print:shadow-none">
          {/* Header Card Profile */}
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-blue-50/30">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-xl shrink-0 border-2 border-white shadow-sm font-mono">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-slate-900">
                      {selectedStudent.name}
                    </h2>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold font-mono">
                      NIS: {selectedStudent.nis}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                      NISN: {selectedStudent.nisn}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">
                      Kelas: {studentClass?.name} ({studentClass?.major})
                    </span>
                    <span>·</span>
                    <span>Wali Kelas: {studentClass?.homeroomTeacher}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Wali: {selectedStudent.parentName} ({selectedStudent.parentPhone})
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{selectedStudent.parentAddress}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-start print:hidden">
                <button
                  onClick={handleSendReportWA}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim Rekap WA Wali</span>
                </button>
                <button
                  onClick={handlePrintCard}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Cetak Kartu</span>
                </button>
              </div>
            </div>
          </div>

          {/* Student KPI Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-slate-100 border-b border-slate-200">
            {/* Kehadiran */}
            <div className="p-4 text-center">
              <span className="text-xs font-medium text-slate-500">Persentase Kehadiran</span>
              <p className="mt-1 text-2xl font-extrabold text-blue-700 font-mono tabular-nums">
                {attendancePercentage}%
              </p>
              <span className="text-[11px] text-slate-400">Total {totalDays} Hari</span>
            </div>

            {/* Hadir */}
            <div className="p-4 text-center">
              <span className="text-xs font-medium text-slate-500">Hadir (H)</span>
              <p className="mt-1 text-2xl font-bold text-emerald-600 font-mono tabular-nums">
                {countH}
              </p>
              <span className="text-[11px] text-slate-400">Tepat Waktu</span>
            </div>

            {/* Sakit */}
            <div className="p-4 text-center">
              <span className="text-xs font-medium text-slate-500">Sakit (S)</span>
              <p className="mt-1 text-2xl font-bold text-amber-600 font-mono tabular-nums">
                {countS}
              </p>
              <span className="text-[11px] text-slate-400">Surat Dokter</span>
            </div>

            {/* Izin */}
            <div className="p-4 text-center">
              <span className="text-xs font-medium text-slate-500">Izin (I)</span>
              <p className="mt-1 text-2xl font-bold text-blue-600 font-mono tabular-nums">
                {countI}
              </p>
              <span className="text-[11px] text-slate-400">Dispensasi</span>
            </div>

            {/* Alpa */}
            <div className="p-4 text-center">
              <span className="text-xs font-medium text-slate-500">Alpa (A)</span>
              <p className="mt-1 text-2xl font-bold text-red-600 font-mono tabular-nums">
                {countA}
              </p>
              <span className="text-[11px] text-slate-400">Tanpa Berita</span>
            </div>

            {/* Terlambat */}
            <div className="p-4 text-center">
              <span className="text-xs font-medium text-slate-500">Terlambat (T)</span>
              <p className="mt-1 text-2xl font-bold text-purple-600 font-mono tabular-nums">
                {countT}
              </p>
              <span className="text-[11px] text-slate-400">Tercatat Gerbang</span>
            </div>
          </div>

          {/* Discipline Banner */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <span className="text-xs font-medium text-slate-500">
                  Status Evaluasi Kedisiplinan:
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded border ${discipline.color}`}
                  >
                    {discipline.label}
                  </span>
                  <span className="text-xs text-slate-600">{discipline.note}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance History Table */}
          <div className="p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Riwayat Presensi Harian Siswa</span>
            </h3>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4 w-12 text-center">No</th>
                    <th className="py-2.5 px-4 w-32">Tanggal</th>
                    <th className="py-2.5 px-4 w-28 text-center">Status</th>
                    <th className="py-2.5 px-4 w-28 text-center">Jam Hadir</th>
                    <th className="py-2.5 px-4">Keterangan / Alasan</th>
                    <th className="py-2.5 px-4 w-32 text-center">Status Notifikasi WA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400">
                        Belum ada catatan absensi untuk siswa ini.
                      </td>
                    </tr>
                  ) : (
                    records.map((rec, idx) => (
                      <tr key={rec.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-4 text-center text-slate-400 font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-4 font-mono font-medium text-slate-800">
                          {rec.date}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                              rec.status === 'H'
                                ? 'bg-emerald-100 text-emerald-800'
                                : rec.status === 'S'
                                ? 'bg-amber-100 text-amber-800'
                                : rec.status === 'I'
                                ? 'bg-blue-100 text-blue-800'
                                : rec.status === 'A'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {rec.status === 'H'
                              ? 'HADIR'
                              : rec.status === 'S'
                              ? 'SAKIT'
                              : rec.status === 'I'
                              ? 'IZIN'
                              : rec.status === 'A'
                              ? 'ALPA'
                              : 'TERLAMBAT'}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono text-slate-600">
                          {rec.checkInTime}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">
                          {rec.notes || '-'}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Terkirim ke Wali
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* School Signature Verification for Print */}
            <div className="hidden print:grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-slate-300 text-xs">
              <div className="text-center">
                <p>Mengetahui,</p>
                <p className="font-semibold">Wali Kelas {studentClass?.name}</p>
                <div className="h-20"></div>
                <p className="font-bold underline">{studentClass?.homeroomTeacher}</p>
                <p className="text-slate-500">NIP. Guru Pengampu</p>
              </div>

              <div className="text-center">
                <p>Kadugede, 29 September 2026</p>
                <p className="font-semibold">Waka Bidang Kesiswaan</p>
                <div className="h-20"></div>
                <p className="font-bold underline">{schoolProfile.vicePrincipalName}</p>
                <p className="text-slate-500">NIP. {schoolProfile.vicePrincipalNip}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
