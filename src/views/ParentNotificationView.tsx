import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { AttendanceStatus } from '../types';
import {
  Send,
  MessageSquare,
  Search,
  CheckCheck,
  Clock,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Smartphone,
  Sliders,
  AlertTriangle,
  UserCheck,
  Filter,
} from 'lucide-react';

export const ParentNotificationView: React.FC = () => {
  const {
    students,
    classes,
    notificationLogs,
    selectedDate,
    setSelectedDate,
    sendWhatsAppNotification,
    blastClassNotifications,
    schoolProfile,
  } = useAttendance();

  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [blastSuccess, setBlastSuccess] = useState<string | null>(null);

  // Template customizer state
  const [customHeader, setCustomHeader] = useState('NOTIFIKASI PRESENSI REAL-TIME');
  const [includeNotes, setIncludeNotes] = useState(true);

  // Filter notification logs
  const filteredLogs = notificationLogs.filter((log) => {
    const matchesDate = !selectedDate || log.date === selectedDate;
    const std = students.find((s) => s.id === log.studentId);
    const matchesClass =
      selectedClassId === 'all' || (std && std.classId === selectedClassId);
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesSearch =
      log.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.parentPhone.includes(searchQuery);

    return matchesDate && matchesClass && matchesStatus && matchesSearch;
  });

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleBlastAllAbsents = () => {
    let count = 0;
    classes.forEach((c) => {
      count += blastClassNotifications(c.id, selectedDate, true);
    });
    setBlastSuccess(
      `Berhasil memicu siaran notifikasi WhatsApp real-time ke ${count} orang tua siswa yang Alpa/Terlambat/Izin.`
    );
    setTimeout(() => setBlastSuccess(null), 4000);
  };

  const handleBlastClass = (classId: string) => {
    const count = blastClassNotifications(classId, selectedDate, false);
    setBlastSuccess(`Berhasil mengirimkan rekap harian ke ${count} wali murid.`);
    setTimeout(() => setBlastSuccess(null), 4000);
  };

  // Sample student for WhatsApp preview phone
  const sampleStudent = students[0];
  const sampleClass = classes.find((c) => c.id === sampleStudent?.classId);

  const previewMessage = `*${customHeader}*\n*SMK TARUNA BHAKTI KADUGEDE*\n============================\nYth. Bapak/Ibu Wali Murid dari:\nNama: *${sampleStudent?.name || 'Aditya Pratama'}*\nNIS: *${sampleStudent?.nis || '260101'}*\nKelas: *${sampleClass?.name || 'X RPL 1'}*\n\nKami menginformasikan bahwa ananda pada hari ini:\nTanggal: *${selectedDate}*\nJam: *06:45 WIB*\nTercatat: *HADIR (Tepat Waktu)*\n${includeNotes ? 'Keterangan: _Tiba sebelum bel pagi_\n' : ''}\nMohon kerja sama orang tua/wali dalam memantau kedisiplinan belajar putra/putri kita bersama.\n\n_Pusat Informasi Presensi Siswa SMK Taruna Bhakti Kadugede_\n_Telp/WA Layanan: (0232) 873421_`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
              <span>Integrasi Komunikasi Sekolah & Wali</span>
              <span>·</span>
              <span>WhatsApp Cloud Gateway</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <span>Notifikasi Kehadiran Real-time Orang Tua</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kirim kabar presensi instan saat siswa absen pagi agar orang tua langsung mengetahui status kehadiran.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleBlastAllAbsents}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Broadcast Siswa Tak Hadir ({selectedDate})</span>
            </button>
          </div>
        </div>
      </div>

      {blastSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{blastSuccess}</span>
        </div>
      )}

      {/* Two Column Layout: Template Customizer & Live Phone Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Notification Logs & Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            {/* Filter Toolbar */}
            <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none"
                />

                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none"
                >
                  <option value="all">Semua Kelas</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none"
                >
                  <option value="all">Semua Status</option>
                  <option value="H">Hadir</option>
                  <option value="A">Alpa (Perlu Pantauan)</option>
                  <option value="T">Terlambat</option>
                  <option value="S">Sakit</option>
                  <option value="I">Izin</option>
                </select>
              </div>

              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari siswa, wali, atau no WA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Notification Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4 w-10 text-center">No</th>
                    <th className="py-2.5 px-4">Nama Siswa & Kelas</th>
                    <th className="py-2.5 px-4">Orang Tua / Wali</th>
                    <th className="py-2.5 px-4 w-24 text-center">Status</th>
                    <th className="py-2.5 px-4 w-24 text-center">Waktu Kirim</th>
                    <th className="py-2.5 px-4 w-28 text-center">Tindakan Langsung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                        Tidak ada log notifikasi yang cocok dengan kriteria filter.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log, index) => {
                      const cleanPhone = log.parentPhone.replace(/^0/, '62');
                      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                        log.message
                      )}`;

                      return (
                        <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-4 text-center text-slate-400 font-mono">
                            {index + 1}
                          </td>
                          <td className="py-2.5 px-4">
                            <div className="font-semibold text-slate-900">
                              {log.studentName}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              Kelas: {log.className}
                            </div>
                          </td>
                          <td className="py-2.5 px-4">
                            <div className="text-slate-800 font-medium">
                              {log.parentName}
                            </div>
                            <div className="text-[11px] text-emerald-700 font-mono">
                              {log.parentPhone}
                            </div>
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                log.status === 'H'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : log.status === 'S'
                                  ? 'bg-amber-100 text-amber-800'
                                  : log.status === 'I'
                                  ? 'bg-blue-100 text-blue-800'
                                  : log.status === 'A'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {log.status === 'H'
                                ? 'Hadir'
                                : log.status === 'S'
                                ? 'Sakit'
                                : log.status === 'I'
                                ? 'Izin'
                                : log.status === 'A'
                                ? 'Alpa'
                                : 'Terlambat'}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-center font-mono text-[11px] text-slate-500">
                            {log.time} WIB
                            <div className="text-[10px] text-emerald-600 flex items-center justify-center gap-1">
                              <CheckCheck className="w-3 h-3 text-emerald-600" />
                              <span>Terkirim</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                                title="Buka WhatsApp Web dan kirim pesan langsung"
                              >
                                <span>Kirim WA</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                              <button
                                onClick={() => handleCopyMessage(log.id, log.message)}
                                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                                title="Salin Teks Pesan"
                              >
                                {copiedId === log.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>
                Total <strong>{filteredLogs.length}</strong> riwayat notifikasi tercatat
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">
                Status Gateway: Online & Terhubung
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Live WhatsApp Smartphone Preview Mockup */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>Simulasi Tampilan Pesan Orang Tua</span>
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Pesan yang otomatis diterima di aplikasi WhatsApp orang tua siswa saat presensi diproses.
            </p>

            {/* Smartphone Mockup */}
            <div className="w-full max-w-xs mx-auto bg-slate-900 rounded-3xl p-3 shadow-xl border-4 border-slate-800">
              {/* Phone Speaker & Camera Notch */}
              <div className="w-20 h-3 bg-slate-800 rounded-full mx-auto mb-2"></div>

              {/* WhatsApp App Screen */}
              <div className="bg-[#efeae2] rounded-2xl overflow-hidden shadow-inner flex flex-col h-96">
                {/* WA Top Bar */}
                <div className="bg-[#075e54] text-white p-2.5 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-200 text-[#075e54] flex items-center justify-center font-bold text-xs">
                    TB
                  </div>
                  <div className="truncate flex-1">
                    <p className="text-xs font-semibold truncate leading-tight">
                      SMK Taruna Bhakti Info
                    </p>
                    <p className="text-[10px] text-emerald-200 leading-none">
                      Akun Resmi Presensi
                    </p>
                  </div>
                </div>

                {/* WA Chat Body */}
                <div className="flex-1 p-3 overflow-y-auto space-y-2">
                  <div className="text-center">
                    <span className="text-[9px] bg-white/80 px-2 py-0.5 rounded shadow-2xs text-slate-500">
                      Hari ini, {selectedDate}
                    </span>
                  </div>

                  {/* Incoming Green Message Bubble */}
                  <div className="bg-white rounded-lg p-2.5 shadow-2xs text-[11px] text-slate-800 leading-relaxed font-sans relative border-l-4 border-[#25d366]">
                    <div className="whitespace-pre-line font-mono text-[10px] leading-tight">
                      {previewMessage}
                    </div>
                    <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-slate-400">
                      <span>06:46</span>
                      <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                  </div>
                </div>

                {/* WA Input Bar Mockup */}
                <div className="p-2 bg-[#f0f2f5] border-t border-slate-300 flex items-center gap-2">
                  <div className="flex-1 bg-white rounded-full px-3 py-1 text-[10px] text-slate-400">
                    Ketik pesan...
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#128c7e] text-white flex items-center justify-center">
                    <Send className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Template options */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNotes}
                  onChange={(e) => setIncludeNotes(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Sertakan catatan/alasan pada notifikasi</span>
              </label>

              <p className="text-[11px] text-slate-400">
                Pesan diformat otomatis dengan enkripsi standar tautan wa.me sehingga tidak membebani pulsa sekolah.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
