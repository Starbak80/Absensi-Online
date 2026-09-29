import React, { useState, useEffect } from 'react';
import { NavTab } from './Sidebar';
import { useAttendance } from '../context/AttendanceContext';
import { SupabaseSyncModal } from './SupabaseSyncModal';
import {
  Menu,
  Calendar,
  Clock,
  Send,
  User,
  ShieldCheck,
  RefreshCw,
  Database,
} from 'lucide-react';

interface HeaderProps {
  currentTab: NavTab;
  onOpenMobileSidebar: () => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileSidebar,
  onNavigateTab,
}) => {
  const { adminUser, notificationLogs, selectedDate, setSelectedDate } = useAttendance();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getBreadcrumb = (tab: NavTab): { category: string; page: string } => {
    switch (tab) {
      case 'dashboard':
        return { category: 'Ikhtisar', page: 'Dashboard Presensi Utama' };
      case 'absensi-siswa':
        return { category: 'Presensi', page: 'Input & Rekap Siswa Per Kelas' };
      case 'absensi-guru':
        return { category: 'Kepegawaian', page: 'Presensi Guru & Tenaga Kependidikan' };
      case 'dashboard-siswa':
        return { category: 'Kesiswaan', page: 'Dashboard & Kartu Presensi Siswa' };
      case 'laporan-mingguan':
        return { category: 'Laporan', page: 'Rekapitulasi Mingguan' };
      case 'laporan-bulanan':
        return { category: 'Laporan', page: 'Rekapitulasi Bulanan' };
      case 'notifikasi-ortu':
        return { category: 'Komunikasi', page: 'Notifikasi Real-time Orang Tua' };
      case 'data-master':
        return { category: 'Pengaturan', page: 'Data Master & Profil Sekolah' };
      default:
        return { category: 'Sistem', page: 'Absensi' };
    }
  };

  const breadcrumb = getBreadcrumb(currentTab);
  const todaySentCount = notificationLogs.filter(
    (l) => l.date === selectedDate && l.sentVia === 'WhatsApp'
  ).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
      {/* Zone 1: Mobile toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-500">{breadcrumb.category}</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-900">{breadcrumb.page}</span>
        </div>
      </div>

      {/* Zone 2: Live Clock & Date Controls */}
      <div className="hidden lg:flex items-center gap-5 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 text-slate-700 font-mono tabular-nums">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>{currentTime || '07:30:00'} WIB</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-md px-2 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
          />
        </div>
      </div>

      {/* Zone 3: Actions & Admin Profile */}
      <div className="flex items-center gap-2.5">
        {/* Supabase Connection Status Button */}
        <button
          onClick={() => setIsSupabaseModalOpen(true)}
          title="Supabase Database Status & Sync"
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-300 transition-colors cursor-pointer"
        >
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Supabase:</span>
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Online</span>
          </span>
        </button>

        {/* Quick notification status badge button */}
        <button
          onClick={() => onNavigateTab('notifikasi-ortu')}
          title="Buka panel notifikasi orang tua"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
        >
          <Send className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-mono tabular-nums font-semibold">{todaySentCount}</span>
          <span className="text-[11px] text-slate-600">WA Terkirim</span>
        </button>

        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

        {/* Admin profile label */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 shrink-0">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">
              {adminUser?.username || 'Admin'}
            </p>
            <p className="text-[10px] text-emerald-600 font-medium leading-none">
              Akses Admin Aktif
            </p>
          </div>
        </div>
      </div>

      {/* Supabase Modal */}
      <SupabaseSyncModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </header>
  );
};
