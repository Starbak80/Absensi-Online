import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { SchoolLogo } from '../components/SchoolLogo';
import {
  Calendar,
  Printer,
  Download,
  Filter,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';

export const WeeklyReportView: React.FC = () => {
  const { classes, students, studentAttendance, schoolProfile } = useAttendance();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  // Sample selected week: Monday 2026-09-21 to Saturday 2026-09-26
  const [weekStart, setWeekStart] = useState<string>('2026-09-21');

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter((s) => s.classId === currentClass?.id);

  // Generate 6 days of the week (Senin - Sabtu)
  const getDaysOfWeek = (start: string) => {
    const days: { dateStr: string; label: string; dayName: string }[] = [];
    const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const base = new Date(start);

    for (let i = 0; i < 6; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      days.push({
        dateStr: iso,
        label: `${d.getDate()}/${d.getMonth() + 1}`,
        dayName: dayNames[i],
      });
    }
    return days;
  };

  const weekDays = getDaysOfWeek(weekStart);

  // Compute table rows
  const reportRows = classStudents.map((std) => {
    const studentRecords = studentAttendance.filter((r) => r.studentId === std.id);

    const dayStatuses = weekDays.map((d) => {
      const found = studentRecords.find((r) => r.date === d.dateStr);
      return found ? found.status : 'H';
    });

    const h = dayStatuses.filter((s) => s === 'H').length;
    const s = dayStatuses.filter((s) => s === 'S').length;
    const i = dayStatuses.filter((s) => s === 'I').length;
    const a = dayStatuses.filter((s) => s === 'A').length;
    const t = dayStatuses.filter((s) => s === 'T').length;
    const pct = Math.round(((h + t) / 6) * 100);

    return {
      student: std,
      dayStatuses,
      h,
      s,
      i,
      a,
      t,
      pct,
    };
  });

  // Class aggregates
  const totalStudents = classStudents.length || 1;
  const avgPct = Math.round(
    reportRows.reduce((acc, r) => acc + r.pct, 0) / totalStudents
  );
  const perfectStudents = reportRows.filter((r) => r.pct === 100).length;
  const atRiskStudents = reportRows.filter((r) => r.a > 0 || r.pct < 80).length;

  // CSV export handler
  const handleExportCSV = () => {
    const headers = [
      'No',
      'NIS',
      'Nama Siswa',
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',
      'H',
      'S',
      'I',
      'A',
      'T',
      'Persentase',
    ];

    const csvRows = [headers.join(',')];

    reportRows.forEach((row, idx) => {
      const line = [
        idx + 1,
        `"${row.student.nis}"`,
        `"${row.student.name}"`,
        ...row.dayStatuses,
        row.h,
        row.s,
        row.i,
        row.a,
        row.t,
        `"${row.pct}%"`,
      ];
      csvRows.push(line.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Laporan_Mingguan_${currentClass?.name}_${weekStart}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Control Ribbon */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
              <span>Laporan Berkala</span>
              <span>·</span>
              <span>Rekapitulasi Mingguan</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Laporan Absensi Mingguan
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Rekap kehadiran 6 hari aktif (Senin s/d Sabtu) per kelas dan per siswa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Kelas {c.name} ({c.major})
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[11px] text-slate-500 font-medium">Mulai:</span>
              <input
                type="date"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
                className="text-xs font-mono text-slate-800 bg-transparent focus:outline-none"
              />
            </div>

            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Ekspor CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Laporan</span>
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-500">Rata-rata Kehadiran:</span>
            <p className="text-lg font-bold text-blue-700 font-mono mt-0.5">
              {avgPct}%
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-500">Siswa 100% Hadir:</span>
            <p className="text-lg font-bold text-emerald-600 font-mono mt-0.5">
              {perfectStudents} Siswa
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-500">Perlu Perhatian (Alpa):</span>
            <p
              className={`text-lg font-bold font-mono mt-0.5 ${
                atRiskStudents > 0 ? 'text-red-600' : 'text-slate-700'
              }`}
            >
              {atRiskStudents} Siswa
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-500">Wali Kelas:</span>
            <p className="text-xs font-semibold text-slate-900 mt-1 truncate">
              {currentClass?.homeroomTeacher}
            </p>
          </div>
        </div>
      </div>

      {/* Official Report Document */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 print:border-none print:shadow-none print:p-0">
        {/* Official Kop Surat (Always visible on print) */}
        <div className="border-b-2 border-slate-900 pb-4 mb-5 flex items-center justify-between gap-4">
          <SchoolLogo size={70} />
          <div className="text-center flex-1">
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              YAYASAN TARUNA BHAKTI KUNINGAN
            </p>
            <h2 className="text-lg font-extrabold text-slate-900 uppercase">
              SMK TARUNA BHAKTI KADUGEDE
            </h2>
            <p className="text-[11px] text-slate-600 font-medium">
              Kompetensi Keahlian: Rekayasa Perangkat Lunak · Teknik Komputer & Jaringan · Teknik Kendaraan Ringan
            </p>
            <p className="text-[10px] text-slate-500">
              {schoolProfile.address}, {schoolProfile.regency} {schoolProfile.postalCode} · Telp: {schoolProfile.phone} · Email: {schoolProfile.email}
            </p>
          </div>
          <div className="w-16 hidden sm:block"></div>
        </div>

        {/* Report Heading */}
        <div className="text-center mb-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            LAPORAN REKAPITULASI ABSENSI MINGGUAN SISWA
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Kelas: <strong>{currentClass?.name}</strong> · Periode: <strong>{weekDays[0].dateStr} s/d {weekDays[5].dateStr}</strong>
          </p>
        </div>

        {/* Attendance Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-300">
              <tr>
                <th className="py-2 px-2.5 w-10 text-center border-r border-slate-300">No</th>
                <th className="py-2 px-3 w-20 border-r border-slate-300">NIS</th>
                <th className="py-2 px-3 border-r border-slate-300">Nama Siswa</th>
                {weekDays.map((d) => (
                  <th
                    key={d.dateStr}
                    className="py-2 px-2 text-center w-14 border-r border-slate-300"
                  >
                    <div>{d.dayName}</div>
                    <div className="text-[10px] font-normal text-slate-500">{d.label}</div>
                  </th>
                ))}
                <th className="py-2 px-2 text-center w-10 border-r border-slate-300 bg-emerald-50">H</th>
                <th className="py-2 px-2 text-center w-10 border-r border-slate-300 bg-amber-50">S</th>
                <th className="py-2 px-2 text-center w-10 border-r border-slate-300 bg-blue-50">I</th>
                <th className="py-2 px-2 text-center w-10 border-r border-slate-300 bg-red-50">A</th>
                <th className="py-2 px-2 text-center w-10 border-r border-slate-300 bg-purple-50">T</th>
                <th className="py-2 px-3 text-center w-16 bg-slate-100">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {reportRows.map((row, idx) => (
                <tr key={row.student.id} className="hover:bg-slate-50 font-mono">
                  <td className="py-2 px-2 text-center border-r border-slate-200 text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 text-slate-700">
                    {row.student.nis}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 font-sans font-medium text-slate-900">
                    {row.student.name}
                  </td>

                  {/* 6 Day columns */}
                  {row.dayStatuses.map((st, sIdx) => (
                    <td
                      key={sIdx}
                      className={`py-2 px-1 text-center font-bold border-r border-slate-200 ${
                        st === 'H'
                          ? 'text-emerald-700'
                          : st === 'S'
                          ? 'text-amber-600 bg-amber-50/50'
                          : st === 'I'
                          ? 'text-blue-600 bg-blue-50/50'
                          : st === 'A'
                          ? 'text-red-600 bg-red-50 font-extrabold'
                          : 'text-purple-600 bg-purple-50/50'
                      }`}
                    >
                      {st}
                    </td>
                  ))}

                  {/* Totals */}
                  <td className="py-2 px-1 text-center font-bold text-emerald-700 border-r border-slate-200 bg-emerald-50/30">
                    {row.h}
                  </td>
                  <td className="py-2 px-1 text-center font-bold text-amber-700 border-r border-slate-200 bg-amber-50/30">
                    {row.s}
                  </td>
                  <td className="py-2 px-1 text-center font-bold text-blue-700 border-r border-slate-200 bg-blue-50/30">
                    {row.i}
                  </td>
                  <td className="py-2 px-1 text-center font-bold text-red-700 border-r border-slate-200 bg-red-50/30">
                    {row.a}
                  </td>
                  <td className="py-2 px-1 text-center font-bold text-purple-700 border-r border-slate-200 bg-purple-50/30">
                    {row.t}
                  </td>
                  <td className="py-2 px-2 text-center font-bold text-slate-900 bg-slate-50 font-mono">
                    {row.pct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-between text-[11px] text-slate-500 border-t border-slate-200 pt-3">
          <div className="flex items-center gap-3">
            <span>Keterangan:</span>
            <span>H = Hadir</span>
            <span>·</span>
            <span>S = Sakit</span>
            <span>·</span>
            <span>I = Izin</span>
            <span>·</span>
            <span>A = Alpa</span>
            <span>·</span>
            <span>T = Terlambat</span>
          </div>
          <div>Dicetak dari Sistem Absensi SMK Taruna Bhakti Kadugede</div>
        </div>

        {/* Official Signatures */}
        <div className="grid grid-cols-2 gap-12 mt-12 text-xs text-slate-800">
          <div className="text-center">
            <p>Mengetahui,</p>
            <p className="font-semibold">Wali Kelas {currentClass?.name}</p>
            <div className="h-20"></div>
            <p className="font-bold underline">{currentClass?.homeroomTeacher}</p>
            <p className="text-slate-500">NIP. Guru Pengampu</p>
          </div>

          <div className="text-center">
            <p>Kadugede, 29 September 2026</p>
            <p className="font-semibold">Kepala SMK Taruna Bhakti Kadugede</p>
            <div className="h-20"></div>
            <p className="font-bold underline">{schoolProfile.principalName}</p>
            <p className="text-slate-500">NIP. {schoolProfile.principalNip}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
