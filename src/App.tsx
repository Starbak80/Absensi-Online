import React, { useState } from 'react';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { AdminLogin } from './components/AdminLogin';
import { DashboardView } from './views/DashboardView';
import { StudentAttendanceView } from './views/StudentAttendanceView';
import { TeacherAttendanceView } from './views/TeacherAttendanceView';
import { StudentDashboardView } from './views/StudentDashboardView';
import { WeeklyReportView } from './views/WeeklyReportView';
import { MonthlyReportView } from './views/MonthlyReportView';
import { ParentNotificationView } from './views/ParentNotificationView';
import { DataMasterView } from './views/DataMasterView';

const AppContent: React.FC = () => {
  const { isAdminLoggedIn } = useAttendance();
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If user is not authenticated as admin, lock access with the Admin Login Portal
  if (!isAdminLoggedIn) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <div className="print:hidden">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-72 min-w-0 print:pl-0">
        {/* Top Header */}
        <div className="print:hidden">
          <Header
            currentTab={currentTab}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            onNavigateTab={setCurrentTab}
          />
        </div>

        {/* View Content Portals */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto print:p-0 print:max-w-none">
          {currentTab === 'dashboard' && (
            <DashboardView onNavigateTab={setCurrentTab} />
          )}
          {currentTab === 'absensi-siswa' && <StudentAttendanceView />}
          {currentTab === 'absensi-guru' && <TeacherAttendanceView />}
          {currentTab === 'dashboard-siswa' && <StudentDashboardView />}
          {currentTab === 'laporan-mingguan' && <WeeklyReportView />}
          {currentTab === 'laporan-bulanan' && <MonthlyReportView />}
          {currentTab === 'notifikasi-ortu' && <ParentNotificationView />}
          {currentTab === 'data-master' && <DataMasterView />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AttendanceProvider>
      <AppContent />
    </AttendanceProvider>
  );
}
