import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { SchoolLogo } from '../components/SchoolLogo';
import {
  Calendar,
  Printer,
  Download,
  FileSpreadsheet,
  Award,
  AlertCircle,
} from 'lucide-react';

export const MonthlyReportView: React.FC = () => {
  const { classes, students, studentAttendance, schoolProfile } = useAttendance();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // September
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter((s) => s.classId === currentClass?.id);

  // Number of days in chosen month (September = 30)
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

  // Generate array of day numbers: [1, 2, ..., 30]
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateObj = new Date(selectedYear, selectedMonth - 1, dayNum);
    const dayOfWeek = dateObj.getDay(); // 0 is Sunday
    const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(
      dayNum
    ).padStart(2, '0')}`;
    return {
      dayNum,
      dateStr,
      isSunday: dayOfWeek === 0,
      isSaturday: dayOfWeek === 6,
    };
  });

  const effectiveDays = monthDays.filter((d) => !d.isSunday).length;

  // Build matrix rows for each student
  const rows = classStudents.map((std) => {
    const studentRecords = studentAttendance.filter((r) => r.studentId === std.id);

    const dayRecords = monthDays.map((d) => {
      if (d.isSunday) return { status: '-', isSunday: true };
      const rec = studentRecords.find((r) => r.date === d.dateStr);
      return {
        status: rec ? rec.status : 'H',
        isSunday: false,
      };
    });

    const activeDays = dayRecords.filter((d) => !d.isSunday);
    const h = activeDays.filter((d) => d.status === 'H').length;
    const s = activeDays.filter((d) => d.status === 'S').length;
    const i = activeDays.filter((d) => d.status === 'I').length;
    const a = activeDays.filter((d) => d.status === 'A').length;
    const t = activeDays.filter((d) => d.status === 'T').length;

    const totalPresent = h + t;
    const percentage = effectiveDays > 0 ? Math.round((totalPresent / effectiveDays) * 100) : 0;

    return {
      student: std,
      dayRecords,
      h,
      s,
      i,
      a,
      t,
      percentage,
    };
  });

  // Aggregates
  const totalStudents = classStudents.length || 1;
  const classAvgAttendance = Math.round(
    rows.reduce((sum, r) => sum + r.percentage, 0) / totalStudents
  );
  const totalAlpa = rows.reduce((sum, r) => sum + r.a, 0);

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const handleExportCSV = () => {
    const dayHeaders = monthDays.map((d) => `Tgl_${d.dayNum}`);
    const headers = [
      'No',
      'NIS',
      'Nama Siswa',
      ...dayHeaders,
      'Total_Hadir',
      'Total_Sakit',
      'Total_Izin',
      'Total_Alpa',
      'Total_Telat',
      'Persentase',
    ];

    const csvLines = [headers.join(',')];

    rows.forEach((row, idx) => {
      const dayValues = row.dayRecords.map((d) => (d.isSunday ? 'LIBUR' : d.status));
      const line = [
        idx + 1,
        `"${row.student.nis}"`,
        `"${row.student.name}"`,
        ...dayValues,
        row.h,
        row.s,
        row.i,
        row.a,
        row.t,
        `"${row.percentage}%"`,
      ];
      csvLines.push(line.join(','));
    });

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Rekap_Bulanan_${currentClass?.name}_${monthNames[selectedMonth - 1]}_${selectedYear}.csv`
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
      {/* Control Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
              <span>Laporan Arsip Bulanan</span>
              <span>·</span>
              <span>Rekapitulasi 1 Bulan Penuh</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Laporan Absensi Bulanan
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Matriks kalender harian, akumulasi ketidakhadiran, dan persentase standar dinas.
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

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none"
            >
              {monthNames.map((m, idx) => (
                <option key={idx} value={idx + 1}>
                  Bulan {m}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none font-mono"
            >
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Unduh Excel</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Kop Resmi</span>
            </button>
          </div>
        </div>

        {/* Quick Month Metrics */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-500">Hari Belajar Efektif:</span>
            <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">
              {effectiveDays} Hari
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-500">Rata-rata Kehadiran:</span>
            <p className="text-lg font-bold text-blue-700 font-mono mt-0.5">
              {classAvgAttendance}%
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-500">Total Kasus Alpa:</span>
            <p
              className={`text-lg font-bold font-mono mt-0.5 ${
                totalAlpa > 0 ? 'text-red-600' : 'text-slate-800'
              }`}
            >
              {totalAlpa} Kasus
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-500">Status Standar Disiplin:</span>
            <p className="text-xs font-bold text-emerald-700 mt-1">
              Memenuhi Standar Kurikulum
            </p>
          </div>
        </div>
      </div>

      {/* Official Printable Sheet */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 print:border-none print:shadow-none print:p-0">
        {/* Kop Surat Sekolah */}
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

        {/* Title */}
        <div className="text-center mb-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            REKAPITULASI ABSENSI BULANAN SISWA
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Bulan: <strong>{monthNames[selectedMonth - 1]} {selectedYear}</strong> · Kelas: <strong>{currentClass?.name}</strong> · Wali Kelas: <strong>{currentClass?.homeroomTeacher}</strong>
          </p>
        </div>

        {/* Full Month Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border border-slate-300">
            <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-300">
              <tr>
                <th className="py-2 px-1.5 w-8 text-center border-r border-slate-300">No</th>
                <th className="py-2 px-2 w-16 border-r border-slate-300">NIS</th>
                <th className="py-2 px-2 w-36 border-r border-slate-300">Nama Siswa</th>
                
                {/* 1..30 day columns */}
                {monthDays.map((d) => (
                  <th
                    key={d.dayNum}
                    className={`py-2 px-0.5 text-center w-6 border-r border-slate-300 text-[10px] ${
                      d.isSunday ? 'bg-red-100 text-red-700 font-bold' : ''
                    }`}
                    title={d.isSunday ? 'Hari Minggu (Libur)' : `Tanggal ${d.dayNum}`}
                  >
                    {d.dayNum}
                  </th>
                ))}

                {/* Recap Columns */}
                <th className="py-2 px-1 text-center w-7 border-r border-slate-300 bg-emerald-50">H</th>
                <th className="py-2 px-1 text-center w-7 border-r border-slate-300 bg-amber-50">S</th>
                <th className="py-2 px-1 text-center w-7 border-r border-slate-300 bg-blue-50">I</th>
                <th className="py-2 px-1 text-center w-7 border-r border-slate-300 bg-red-50">A</th>
                <th className="py-2 px-1 text-center w-7 border-r border-slate-300 bg-purple-50">T</th>
                <th className="py-2 px-1.5 text-center w-12 bg-slate-100">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rows.map((row, idx) => (
                <tr key={row.student.id} className="hover:bg-slate-50 font-mono">
                  <td className="py-1.5 px-1 text-center border-r border-slate-200 text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="py-1.5 px-2 border-r border-slate-200 text-slate-700">
                    {row.student.nis}
                  </td>
                  <td className="py-1.5 px-2 border-r border-slate-200 font-sans font-medium text-slate-900 truncate max-w-[140px]">
                    {row.student.name}
                  </td>

                  {/* Day cells */}
                  {row.dayRecords.map((d, dIdx) => (
                    <td
                      key={dIdx}
                      className={`py-1.5 px-0.5 text-center font-bold border-r border-slate-200 text-[10px] ${
                        d.isSunday
                          ? 'bg-red-50 text-red-300'
                          : d.status === 'H'
                          ? 'text-emerald-700'
                          : d.status === 'S'
                          ? 'text-amber-600 bg-amber-50'
                          : d.status === 'I'
                          ? 'text-blue-600 bg-blue-50'
                          : d.status === 'A'
                          ? 'text-red-700 bg-red-100 font-extrabold'
                          : 'text-purple-600 bg-purple-50'
                      }`}
                    >
                      {d.isSunday ? '•' : d.status}
                    </td>
                  ))}

                  {/* Totals */}
                  <td className="py-1.5 px-0.5 text-center font-bold text-emerald-700 border-r border-slate-200 bg-emerald-50/30">
                    {row.h}
                  </td>
                  <td className="py-1.5 px-0.5 text-center font-bold text-amber-700 border-r border-slate-200 bg-amber-50/30">
                    {row.s}
                  </td>
                  <td className="py-1.5 px-0.5 text-center font-bold text-blue-700 border-r border-slate-200 bg-blue-50/30">
                    {row.i}
                  </td>
                  <td className="py-1.5 px-0.5 text-center font-bold text-red-700 border-r border-slate-200 bg-red-50/30">
                    {row.a}
                  </td>
                  <td className="py-1.5 px-0.5 text-center font-bold text-purple-700 border-r border-slate-200 bg-purple-50/30">
                    {row.t}
                  </td>
                  <td className="py-1.5 px-1 text-center font-bold text-slate-900 bg-slate-50 font-mono">
                    {row.percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-between text-[11px] text-slate-500 border-t border-slate-200 pt-3">
          <div className="flex items-center gap-3">
            <span>Keterangan Status:</span>
            <span>H = Hadir</span>
            <span>·</span>
            <span>S = Sakit</span>
            <span>·</span>
            <span>I = Izin</span>
            <span>·</span>
            <span>A = Alpa (Tanpa Keterangan)</span>
            <span>·</span>
            <span>T = Terlambat</span>
            <span>·</span>
            <span className="text-red-500 font-semibold">• = Hari Libur</span>
          </div>
          <div>Dokumen Sah Arsip Presensi SMK Taruna Bhakti Kadugede</div>
        </div>

        {/* Official Signatures (Wali Kelas, Waka Kesiswaan, Kepala Sekolah) */}
        <div className="grid grid-cols-3 gap-6 mt-12 text-xs text-slate-800">
          <div className="text-center">
            <p>Mengetahui,</p>
            <p className="font-semibold">Wali Kelas {currentClass?.name}</p>
            <div className="h-20"></div>
            <p className="font-bold underline">{currentClass?.homeroomTeacher}</p>
            <p className="text-slate-500">NIP. Guru Pengampu</p>
          </div>

          <div className="text-center">
            <p>Memeriksa,</p>
            <p className="font-semibold">Waka Bidang Kesiswaan</p>
            <div className="h-20"></div>
            <p className="font-bold underline">{schoolProfile.vicePrincipalName}</p>
            <p className="text-slate-500">NIP. {schoolProfile.vicePrincipalNip}</p>
          </div>

          <div className="text-center">
            <p>Kadugede, 30 September 2026</p>
            <p className="font-semibold">Kepala Sekolah</p>
            <div className="h-20"></div>
            <p className="font-bold underline">{schoolProfile.principalName}</p>
            <p className="text-slate-500">NIP. {schoolProfile.principalNip}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
