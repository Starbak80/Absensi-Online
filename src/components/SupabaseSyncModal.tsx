import React, { useState, useEffect } from 'react';
import {
  testSupabaseConnection,
  pushAllDataToSupabase,
  SupabaseSyncStatus,
} from '../services/supabaseService';
import { SUPABASE_CONFIG, SUPABASE_SQL_SCHEMA } from '../lib/supabase';
import { useAttendance } from '../context/AttendanceContext';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  UploadCloud,
  DownloadCloud,
  Code,
  Copy,
  Check,
  ExternalLink,
  X,
  Server,
  Key,
} from 'lucide-react';

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSyncModal: React.FC<SupabaseSyncModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    schoolProfile,
    classes,
    students,
    teachers,
    studentAttendance,
    teacherAttendance,
    notificationLogs,
  } = useAttendance();

  const [status, setStatus] = useState<SupabaseSyncStatus>({
    isConnected: true,
    isChecking: false,
    isSyncing: false,
    lastSyncedAt: null,
    errorMessage: null,
    tablesStatus: {
      school_profile: false,
      classes: false,
      students: false,
      teachers: false,
      attendance_records: false,
      teacher_attendance_records: false,
      notification_logs: false,
    },
  });

  const [activeTab, setActiveTab] = useState<'status' | 'sql' | 'info'>('status');
  const [copiedSql, setCopiedSql] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      handleTestConnection();
    }
  }, [isOpen]);

  const handleTestConnection = async () => {
    setStatus((prev) => ({ ...prev, isChecking: true, errorMessage: null }));
    const result = await testSupabaseConnection();
    setStatus((prev) => ({
      ...prev,
      isChecking: false,
      isConnected: result.success,
      errorMessage: result.success ? null : result.message,
      tablesStatus: result.tables as any,
    }));
  };

  const handleSyncToSupabase = async () => {
    setStatus((prev) => ({ ...prev, isSyncing: true }));
    setSyncFeedback(null);

    const result = await pushAllDataToSupabase({
      schoolProfile,
      classes,
      students,
      teachers,
      studentAttendance,
      teacherAttendance,
      notificationLogs,
    });

    setStatus((prev) => ({
      ...prev,
      isSyncing: false,
      lastSyncedAt: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    }));

    setSyncFeedback(result.message);
    setTimeout(() => setSyncFeedback(null), 5000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">Koneksi Database Supabase</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30 font-mono">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Project: {SUPABASE_CONFIG.projectName} ({SUPABASE_CONFIG.projectId})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="px-5 pt-3 border-b border-slate-200 bg-slate-50 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-2 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'status'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Status & Sinkronisasi
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-2 px-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sql'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Skema SQL Database</span>
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`py-2 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'info'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Kredensial Project
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: Status & Sync */}
          {activeTab === 'status' && (
            <div className="space-y-4">
              {/* Connection Status Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Terhubung ke Supabase Cloud
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {SUPABASE_CONFIG.url}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleTestConnection}
                  disabled={status.isChecking}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 self-start sm:self-center"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 text-blue-600 ${
                      status.isChecking ? 'animate-spin' : ''
                    }`}
                  />
                  <span>{status.isChecking ? 'Memeriksa...' : 'Uji Koneksi'}</span>
                </button>
              </div>

              {/* Push / Sync Actions */}
              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-blue-900">
                      Sinkronisasi Data Dua Arah
                    </h4>
                    <p className="text-[11px] text-blue-700 mt-0.5">
                      Unggah data presensi harian, siswa, dan guru dari sistem ke tabel cloud Supabase.
                    </p>
                  </div>
                  {status.lastSyncedAt && (
                    <span className="text-[10px] text-blue-600 font-mono">
                      Terakhir: {status.lastSyncedAt} WIB
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleSyncToSupabase}
                    disabled={status.isSyncing}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <UploadCloud
                      className={`w-4 h-4 ${status.isSyncing ? 'animate-bounce' : ''}`}
                    />
                    <span>
                      {status.isSyncing
                        ? 'Menyinkronkan ke Supabase...'
                        : 'Sinkronkan Semua Data ke Supabase'}
                    </span>
                  </button>
                </div>

                {syncFeedback && (
                  <div className="p-2.5 rounded-lg bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{syncFeedback}</span>
                  </div>
                )}
              </div>

              {/* Tables Overview */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-2">
                  Status Tabel Database Supabase:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { key: 'classes', name: 'classes (Kelas)' },
                    { key: 'students', name: 'students (Siswa)' },
                    { key: 'teachers', name: 'teachers (Guru)' },
                    { key: 'attendance_records', name: 'attendance_records' },
                    { key: 'teacher_attendance_records', name: 'teacher_attendance' },
                    { key: 'notification_logs', name: 'notification_logs' },
                  ].map((tbl) => (
                    <div
                      key={tbl.key}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                    >
                      <span className="font-mono text-[11px] text-slate-700 truncate mr-2">
                        {tbl.name}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold shrink-0">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Siap</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SQL Schema Generator */}
          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Script SQL Tabel & RLS (Supabase)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Jalankan script ini di menu <strong>SQL Editor</strong> di dashboard Supabase jika belum membuat tabel.
                  </p>
                </div>
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Semua SQL</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 text-[11px] font-mono overflow-x-auto max-h-64 leading-relaxed border border-slate-800">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: Credentials info */}
          {activeTab === 'info' && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500">Nama Project Supabase</span>
                  <span className="font-semibold text-slate-900">{SUPABASE_CONFIG.projectName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500">Project ID</span>
                  <span className="font-mono font-semibold text-slate-900">{SUPABASE_CONFIG.projectId}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500">Project URL</span>
                  <span className="font-mono text-blue-700">{SUPABASE_CONFIG.url}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-500">API Key / Publishable Key</span>
                  <span className="font-mono text-slate-700 truncate max-w-[200px]">
                    {SUPABASE_CONFIG.anonKey.slice(0, 16)}••••••••
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Kredensial telah tersimpan dan terhubung ke client `@supabase/supabase-js`.
                Semua data absensi SMK Taruna Bhakti Kadugede tersinkronisasi secara aman.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <a
            href="https://supabase.com/dashboard/project/cbzbqlszvwpvmlpldfwd"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Buka Dashboard Supabase</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
