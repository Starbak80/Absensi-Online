import React, { useState, useEffect } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { AttendanceStatus } from '../types';
import {
  CheckCheck,
  Save,
  Send,
  Calendar,
  AlertCircle,
  Clock,
  MessageCircle,
  Check,
  Search,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

export const StudentAttendanceView: React.FC = () => {
  const {
    classes,
    students,
    studentAttendance,
    selectedClassId,
    setSelectedClassId,
    selectedDate,
    setSelectedDate,
    saveClassAttendance,
    sendWhatsAppNotification,
    blastClassNotifications,
  } = useAttendance();

  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [autoNotify, setAutoNotify] = useState(true);

  // Active class info
  const activeClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter((s) => s.classId === activeClass.id);

  // Local state for the editable attendance sheet
  const [attendanceRows, setAttendanceRows] = useState<
    {
      studentId: string;
      status: AttendanceStatus;
      checkInTime: string;
      notes: string;
    }[]
  >([]);

  // Load attendance data whenever class or date changes
  useEffect(() => {
    const existingRecords = studentAttendance.filter((r) => r.date === selectedDate);
    const initialRows = classStudents.map((std) => {
      const found = existingRecords.find((r) => r.studentId === std.id);
      return {
        studentId: std.id,
        status: found ? found.status : 'H',
        checkInTime: found ? found.checkInTime : '06:45',
        notes: found?.notes || '',
      };
    });
    setAttendanceRows(initialRows);
  }, [selectedClassId, selectedDate, students, studentAttendance]);

  // Handle single status change
  const handleStatusChange = (studentId: string, newStatus: AttendanceStatus) => {
    setAttendanceRows((prev) =>
      prev.map((row) => {
        if (row.studentId === studentId) {
          let time = row.checkInTime;
          if (newStatus === 'A' || newStatus === 'S' || newStatus === 'I') {
            time = '-';
          } else if (time === '-') {
            time = '06:45';
          }
          return {
            ...row,
            status: newStatus,
            checkInTime: time,
          };
        }
        return row;
      })
    );
  };

  // Handle check in time change
  const handleTimeChange = (studentId: string, time: string) => {
    setAttendanceRows((prev) =>
      prev.map((row) => (row.studentId === studentId ? { ...row, checkInTime: time } : row))
    );
  };

  // Handle notes change
  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendanceRows((prev) =>
      prev.map((row) => (row.studentId === studentId ? { ...row, notes } : row))
    );
  };

  // Mark all students present
  const handleMarkAllPresent = () => {
    setAttendanceRows((prev) =>
      prev.map((row) => ({
        ...row,
        status: 'H',
        checkInTime: '06:45',
        notes: '',
      }))
    );
  };

  // Save current attendance sheet
  const handleSaveAttendance = () => {
    saveClassAttendance(activeClass.id, selectedDate, attendanceRows, autoNotify);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Single WhatsApp dispatch
  const handleDirectWhatsApp = (studentId: string) => {
    const row = attendanceRows.find((r) => r.studentId === studentId);
    if (!row) return;

    const { whatsappUrl } = sendWhatsAppNotification(
      studentId,
      row.status,
      selectedDate,
      row.checkInTime || '06:45',
      undefined
    );

    // Open WhatsApp Web/App in new window
    window.open(whatsappUrl, '_blank');
  };

  // Blast notifications for absents
  const handleBlastAbsents = () => {
    const count = blastClassNotifications(activeClass.id, selectedDate, true);
    alert(`Berhasil mengirimkan notifikasi ketidakhadiran ke ${count} orang tua wali.`);
  };

  // Filter students by search
  const filteredStudents = classStudents.filter(
    (std) =>
      std.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.nis.includes(searchQuery)
  );

  // Live count summary
  const countH = attendanceRows.filter((r) => r.status === 'H').length;
  const countS = attendanceRows.filter((r) => r.status === 'S').length;
  const countI = attendanceRows.filter((r) => r.status === 'I').length;
  const countA = attendanceRows.filter((r) => r.status === 'A').length;
  const countT = attendanceRows.filter((r) => r.status === 'T').length;
  const rate =
    attendanceRows.length > 0
      ? Math.round(((countH + countT) / attendanceRows.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
              <span>Presensi Siswa</span>
              <span>·</span>
              <span>{activeClass.academicYear}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Kelas {activeClass.name}</span>
              <span className="text-xs font-normal text-slate-500">
                (Wali Kelas: {activeClass.homeroomTeacher})
              </span>
            </h1>
          </div>

          {/* Date & Class Selectors */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs font-mono font-medium text-slate-800 bg-transparent focus:outline-none"
              />
            </div>

            <div className="relative">
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    Kelas {cls.name} ({cls.totalStudents} Siswa)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Quick Class Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 mt-4 border-t border-slate-100 pb-1 scrollbar-none">
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                cls.id === selectedClassId
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cls.name}
            </button>
          ))}
        </div>
      </div>

      {/* Class Statistics Ribbon & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono tabular-nums">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600">Hadir:</span>
            <span className="font-bold text-slate-900">{countH}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-600">Sakit:</span>
            <span className="font-bold text-slate-900">{countS}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="text-slate-600">Izin:</span>
            <span className="font-bold text-slate-900">{countI}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="text-slate-600">Alpa:</span>
            <span className={`font-bold ${countA > 0 ? 'text-red-600' : 'text-slate-900'}`}>
              {countA}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span className="text-slate-600">Terlambat:</span>
            <span className="font-bold text-slate-900">{countT}</span>
          </div>
          <div className="pl-2 border-l border-slate-200 font-sans text-xs">
            <span className="text-slate-500">Kehadiran: </span>
            <span className="font-bold text-blue-700 font-mono">{rate}%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleMarkAllPresent}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Semua Hadir</span>
          </button>

          {countA + countT + countS + countI > 0 && (
            <button
              onClick={handleBlastAbsents}
              className="px-3 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-amber-600" />
              <span>Broadcast Tak Hadir</span>
            </button>
          )}

          <button
            onClick={handleSaveAttendance}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Presensi</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>
              Presensi kelas <strong>{activeClass.name}</strong> tanggal {selectedDate} berhasil disimpan
              {autoNotify ? ' dan notifikasi WhatsApp tercatat ke log orang tua.' : '.'}
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Tersimpan</span>
        </div>
      )}

      {/* Student Attendance Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama atau NIS siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoNotify}
              onChange={(e) => setAutoNotify(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Otomatis buat notifikasi WhatsApp ke wali murid</span>
          </label>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 w-24">NIS</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4 w-64 text-center">Status Kehadiran</th>
                <th className="py-3 px-4 w-28 text-center">Jam Masuk</th>
                <th className="py-3 px-4">Catatan / Alasan</th>
                <th className="py-3 px-4 w-36 text-center">Notifikasi Orang Tua</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                    Tidak ada siswa yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std, index) => {
                  const row = attendanceRows.find((r) => r.studentId === std.id) || {
                    studentId: std.id,
                    status: 'H' as AttendanceStatus,
                    checkInTime: '06:45',
                    notes: '',
                  };

                  return (
                    <tr
                      key={std.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        row.status === 'A'
                          ? 'bg-red-50/30'
                          : row.status === 'T'
                          ? 'bg-purple-50/30'
                          : ''
                      }`}
                    >
                      {/* No */}
                      <td className="py-3 px-4 text-center text-slate-400 font-mono">
                        {index + 1}
                      </td>

                      {/* NIS */}
                      <td className="py-3 px-4 font-mono font-medium text-slate-600">
                        {std.nis}
                      </td>

                      {/* Name & Parent info */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{std.name}</div>
                        <div className="text-[11px] text-slate-400">
                          Wali: {std.parentName} · ({std.parentPhone})
                        </div>
                      </td>

                      {/* Status Selector (H / S / I / A / T) */}
                      <td className="py-3 px-4">
                        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 gap-0.5 justify-center w-full">
                          {[
                            { id: 'H', label: 'Hadir', activeClass: 'bg-emerald-600 text-white font-bold' },
                            { id: 'S', label: 'Sakit', activeClass: 'bg-amber-500 text-white font-bold' },
                            { id: 'I', label: 'Izin', activeClass: 'bg-blue-600 text-white font-bold' },
                            { id: 'A', label: 'Alpa', activeClass: 'bg-red-600 text-white font-bold' },
                            { id: 'T', label: 'Telat', activeClass: 'bg-purple-600 text-white font-bold' },
                          ].map((st) => (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => handleStatusChange(std.id, st.id as AttendanceStatus)}
                              className={`flex-1 py-1 text-[11px] rounded transition-colors cursor-pointer ${
                                row.status === st.id
                                  ? st.activeClass
                                  : 'text-slate-600 hover:bg-slate-200/70'
                              }`}
                            >
                              {st.id}
                            </button>
                          ))}
                        </div>
                      </td>

                      {/* Jam Masuk */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="text"
                          value={row.checkInTime}
                          onChange={(e) => handleTimeChange(std.id, e.target.value)}
                          disabled={row.status === 'A' || row.status === 'S' || row.status === 'I'}
                          className="w-16 py-1 px-1.5 text-center font-mono text-xs border border-slate-200 rounded bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-40 disabled:bg-slate-100"
                        />
                      </td>

                      {/* Catatan */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder={
                            row.status === 'S'
                              ? 'Ket: Surat dokter / sakit...'
                              : row.status === 'I'
                              ? 'Ket: Acara keluarga...'
                              : row.status === 'T'
                              ? 'Alasan terlambat...'
                              : 'Catatan kedisiplinan...'
                          }
                          value={row.notes}
                          onChange={(e) => handleNotesChange(std.id, e.target.value)}
                          className="w-full py-1 px-2 text-xs border border-slate-200 rounded bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-300"
                        />
                      </td>

                      {/* Send Direct WhatsApp Action */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDirectWhatsApp(std.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors cursor-pointer"
                          title={`Kirim WA ke ${std.parentName} (${std.parentPhone})`}
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Kirim WA</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Menampilkan <strong>{filteredStudents.length}</strong> siswa kelas {activeClass.name}
          </span>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Keterangan Status:</span>
            <span>H = Hadir</span>
            <span>·</span>
            <span>S = Sakit</span>
            <span>·</span>
            <span>I = Izin</span>
            <span>·</span>
            <span className="text-red-600 font-semibold">A = Alpa</span>
            <span>·</span>
            <span className="text-purple-600 font-semibold">T = Terlambat</span>
          </div>
        </div>
      </div>
    </div>
  );
};
