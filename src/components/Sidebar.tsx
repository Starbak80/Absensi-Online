import React from 'react';
import { SchoolLogo } from './SchoolLogo';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck2,
  FileSpreadsheet,
  BellRing,
  Database,
  Shield,
  Menu,
  X,
  LogOut,
  ChevronRight,
  School,
} from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export type NavTab =
  | 'dashboard'
  | 'absensi-siswa'
  | 'absensi-guru'
  | 'dashboard-siswa'
  | 'laporan-mingguan'
  | 'laporan-bulanan'
  | 'notifikasi-ortu'
  | 'data-master';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { adminUser, logoutAdmin, schoolProfile } = useAttendance();

  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
    { id: 'absensi-siswa', label: 'Absensi Siswa Per Kelas', icon: Users },
    { id: 'absensi-guru', label: 'Absensi Guru & Staf', icon: CalendarCheck2 },
    { id: 'dashboard-siswa', label: 'Dashboard Siswa', icon: GraduationCap },
    { id: 'laporan-mingguan', label: 'Laporan Mingguan', icon: FileSpreadsheet },
    { id: 'laporan-bulanan', label: 'Laporan Bulanan', icon: FileSpreadsheet },
    { id: 'notifikasi-ortu', label: 'Notifikasi Real-time Wali', icon: BellRing },
    { id: 'data-master', label: 'Data Master & Sekolah', icon: Database },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand */}
        <div className="h-18 px-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SchoolLogo size={38} />
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-tight text-white uppercase leading-tight font-sans">
                SMK TARUNA BHAKTI
              </span>
              <span className="text-[11px] text-blue-400 font-medium">
                Kadugede · Kuningan
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* School Tagline Bar */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <School className="w-3.5 h-3.5 text-blue-400" />
            NPSN: {schoolProfile.npsn}
          </span>
          <span className="text-[10px] text-emerald-400 font-medium">
            T.A. 2026/2027
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu Administrasi
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
              </button>
            );
          })}
        </nav>

        {/* Admin User Card in Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/80">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-900 text-blue-300 font-bold flex items-center justify-center text-xs shrink-0 border border-blue-700">
                <Shield className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {adminUser?.fullName || 'Administrator'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {adminUser?.email || 'arsiptb80@gmail.com'}
                </p>
              </div>
            </div>
            <button
              onClick={logoutAdmin}
              title="Keluar dari Akun Admin"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
