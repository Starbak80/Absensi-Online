import React, { useState, useEffect } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { TeacherAttendanceStatus } from '../types';
import {
  Calendar,
  Save,
  CheckCircle,
  Briefcase,
  Clock,
  BookOpen,
  Search,
  Check,
} from 'lucide-react';

export const TeacherAttendanceView: React.FC = () => {
  const {
    teachers,
    teacherAttendance,
    selectedDate,
    setSelectedDate,
    saveTeacherAttendance,
  } = useAttendance();

  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable rows for teachers
  const [rows, setRows] = useState<
    {
      teacherId: string;
      status: TeacherAttendanceStatus;
      checkInTime: string;
      checkOutTime: string;
      teachingJournal: string;
      notes: string;
    }[]
  >([]);

  useEffect(() => {
    const existing = teacherAttendance.filter((r) => r.date === selectedDate);
    const initial = teachers.map((t) => {
      const found = existing.find((r) => r.teacherId === t.id);
      return {
        teacherId: t.id,
        status: found ? found.status : 'H',
        checkInTime: found ? found.checkInTime : '06:30',
        checkOutTime: found?.checkOutTime || '15:30',
        teachingJournal:
          found?.teachingJournal || `Mengajar mata pelajaran ${t.subject}`,
        notes: found?.notes || '',
      };
    });
    setRows(initial);
  }, [selectedDate, teachers, teacherAttendance]);

  const handleStatusChange = (teacherId: string, status: TeacherAttendanceStatus) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.teacherId === teacherId) {
          return {
            ...r,
            status,
            checkInTime:
              status === 'S' || status === 'I' || status === 'Cuti' ? '-' : '06:30',
          };
        }
        return r;
      })
    );
  };

  const handleFieldChange = (
    teacherId: string,
    field: 'checkInTime' | 'checkOutTime' | 'teachingJournal' | 'notes',
    value: string
  ) => {
    setRows((prev) =>
      prev.map((r) => (r.teacherId === teacherId ? { ...r, [field]: value } : r))
    );
  };

  const handleSave = () => {
    saveTeacherAttendance(selectedDate, rows);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleMarkAllPresent = () => {
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        status: 'H',
        checkInTime: '06:30',
        checkOutTime: '15:30',
      }))
    );
  };

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nip.includes(searchQuery)
  );

  const hadirCount = rows.filter((r) => r.status === 'H' || r.status === 'Dinas').length;
  const rate = Math.round((hadirCount / (teachers.length || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Header Controller */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
              <span>Kepegawaian & Guru</span>
              <span>·</span>
              <span>SMK Taruna Bhakti Kadugede</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Presensi Guru & Tenaga Kependidikan
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencatatan waktu hadir, tugas dinas, izin, dan jurnal mengajar harian.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs font-mono font-medium text-slate-800 bg-transparent focus:outline-none"
              />
            </div>

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Presensi Guru</span>
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 font-mono tabular-nums text-slate-600">
            <span>Total Guru: {teachers.length}</span>
            <span>·</span>
            <span className="text-emerald-600 font-semibold">
              Hadir: {rows.filter((r) => r.status === 'H').length}
            </span>
            <span>·</span>
            <span className="text-blue-600 font-semibold">
              Dinas Luar: {rows.filter((r) => r.status === 'Dinas').length}
            </span>
            <span>·</span>
            <span>Sakit/Izin: {rows.filter((r) => r.status === 'S' || r.status === 'I').length}</span>
            <span>·</span>
            <span>Persentase: {rate}%</span>
          </div>

          <button
            onClick={handleMarkAllPresent}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
          >
            Tandai Semua Guru Hadir
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Presensi guru tanggal {selectedDate} berhasil disimpan ke sistem arsip sekolah.</span>
        </div>
      )}

      {/* Teachers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari guru, NIP, atau mata pelajaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Guru & NIP</th>
                <th className="py-3 px-4">Mata Pelajaran</th>
                <th className="py-3 px-4 w-56 text-center">Status Kehadiran</th>
                <th className="py-3 px-4 w-28 text-center">Jam Hadir/Pulang</th>
                <th className="py-3 px-4">Jurnal Mengajar / Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeachers.map((t, index) => {
                const row = rows.find((r) => r.teacherId === t.id) || {
                  teacherId: t.id,
                  status: 'H' as TeacherAttendanceStatus,
                  checkInTime: '06:30',
                  checkOutTime: '15:30',
                  teachingJournal: '',
                  notes: '',
                };

                return (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center text-slate-400 font-mono">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{t.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">NIP: {t.nip}</div>
                      {t.isPiketToday && (
                        <span className="inline-block mt-1 text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
                          Piket Hari Ini
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{t.subject}</td>
                    <td className="py-3 px-4">
                      <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 gap-0.5 justify-center w-full">
                        {[
                          { id: 'H', label: 'Hadir' },
                          { id: 'Dinas', label: 'Dinas' },
                          { id: 'S', label: 'Sakit' },
                          { id: 'I', label: 'Izin' },
                          { id: 'Cuti', label: 'Cuti' },
                        ].map((st) => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() =>
                              handleStatusChange(t.id, st.id as TeacherAttendanceStatus)
                            }
                            className={`flex-1 py-1 text-[11px] rounded transition-colors cursor-pointer ${
                              row.status === st.id
                                ? 'bg-blue-600 text-white font-bold'
                                : 'text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {st.id}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="text"
                          value={row.checkInTime}
                          onChange={(e) =>
                            handleFieldChange(t.id, 'checkInTime', e.target.value)
                          }
                          className="w-14 py-1 text-center text-xs border border-slate-200 rounded bg-slate-50 focus:bg-white focus:outline-none"
                        />
                        <span className="text-slate-400">-</span>
                        <input
                          type="text"
                          value={row.checkOutTime}
                          onChange={(e) =>
                            handleFieldChange(t.id, 'checkOutTime', e.target.value)
                          }
                          className="w-14 py-1 text-center text-xs border border-slate-200 rounded bg-slate-50 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="Materi diajar / tugas luar..."
                        value={row.teachingJournal}
                        onChange={(e) =>
                          handleFieldChange(t.id, 'teachingJournal', e.target.value)
                        }
                        className="w-full py-1 px-2 text-xs border border-slate-200 rounded bg-slate-50 focus:bg-white focus:outline-none placeholder:text-slate-300"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
