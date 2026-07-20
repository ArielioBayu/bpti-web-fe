'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../Components/Sidebar';
import { Home, ChevronRight, User } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-400">Memeriksa Sesi Autentikasi...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-950 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Admin Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <span className="flex items-center text-slate-400 hover:text-slate-600 cursor-pointer">
              <Home className="w-3.5 h-3.5 mr-1" />
              Sistem
            </span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-800">Admin Control Panel</span>
          </div>

          {/* Top Header User Profile Display */}
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
              <User className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-700">{user.name}</span>
          </div>
        </header>

        {/* Dynamic Inner Page */}
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
