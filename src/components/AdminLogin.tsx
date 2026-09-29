import React, { useState } from 'react';
import { SchoolLogo } from './SchoolLogo';
import { useAttendance } from '../context/AttendanceContext';
import { Lock, Mail, ShieldAlert, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin } = useAttendance();
  const [usernameOrEmail, setUsernameOrEmail] = useState('arsiptb80@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const success = loginAdmin(usernameOrEmail, password);
      setIsLoading(false);
      if (!success) {
        setError('Kredensial tidak valid. Silakan periksa username/email dan password admin.');
      }
    }, 350);
  };

  const handleQuickDemoLogin = () => {
    setUsernameOrEmail('arsiptb80@gmail.com');
    setPassword('admin123');
    setIsLoading(true);
    setTimeout(() => {
      loginAdmin('arsiptb80@gmail.com', 'admin123');
      setIsLoading(false);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Background Institutional Pattern */}
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-xs border border-white/20 mb-3 shadow-inner">
                <SchoolLogo size={68} />
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-white uppercase">
                SMK TARUNA BHAKTI
              </h1>
              <p className="text-xs text-blue-200 font-medium tracking-wider uppercase mt-0.5">
                KADUGEDE · KABUPATEN KUNINGAN
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs text-blue-100">
                <Lock className="w-3.5 h-3.5 text-blue-300" />
                <span>Portal Khusus Administrator</span>
              </div>
            </div>
          </div>

          {/* Form Area */}
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">Masuk Akun Admin</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Sistem rekapitulasi kehadiran harian, mingguan, bulanan, dan notifikasi orang tua.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email / Username Admin
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    placeholder="arsiptb80@gmail.com / admin"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Kata Sandi
                  </label>
                  <span className="text-[11px] text-slate-400">Default: admin123</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memverifikasi...
                  </span>
                ) : (
                  <>
                    <span>Masuk ke Panel Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick 1-click test button */}
            <div className="mt-5 pt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 border border-slate-200 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Masuk Cepat (Akses Otomatis Admin)</span>
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Enkripsi Sesi Lokal Terproteksi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-slate-500 mt-5 leading-relaxed">
          &copy; 2026 SMK Taruna Bhakti Kadugede · Jl. Raya Kadugede No. 80 Kuningan
          <br />
          Sistem Rekapitulasi Presensi Terintegrasi Dinas Pendidikan Kab. Kuningan
        </p>
      </div>
    </div>
  );
};
