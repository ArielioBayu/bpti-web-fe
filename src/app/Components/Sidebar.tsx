'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, FileText, Tags, HelpCircle, Users, 
  Layers, FolderOpen, Download, LogOut, ChevronRight, Monitor,
  Image as ImageIcon
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Banner Slider', href: '/admin/slider', icon: ImageIcon },
    { name: 'Berita', href: '/admin/news', icon: FileText },
    { name: 'Kategori', href: '/admin/categories', icon: Tags },
    { name: 'FAQ & Testimonial', href: '/admin/faqs', icon: HelpCircle },
    { name: 'Tim BPTI', href: '/admin/team', icon: Users },
    { name: 'Proyek BPTI', href: '/admin/products', icon: Layers },
    { name: 'Media Library', href: '/admin/media', icon: FolderOpen },
    { name: 'File Management', href: '/admin/downloads', icon: Download },
  ];

  // Also include the PKL submissions inside admin
  const extraItems = [
    { name: 'Pengajuan PKL', href: '/admin/pkl', icon: FileText }
  ];

  return (
    <aside className="w-72 bg-[#0B56A4] text-white flex flex-col min-h-screen shrink-0 shadow-xl border-r border-blue-700/30">
      {/* Sidebar Brand Header */}
      <div className="p-6 border-b border-blue-600/40 bg-white flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Monitor className="text-white w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900 leading-none block">
              BPTI <span className="text-blue-600">UHAMKA</span>
            </span>
            <span className="text-[9px] text-slate-500 font-semibold block mt-0.5 tracking-wider">
              ADMIN CONTROL PANEL
            </span>
          </div>
        </Link>
      </div>

      {/* Admin User Profile */}
      <div className="p-6 border-b border-blue-600/40 bg-blue-600/10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shadow-inner border border-white/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <span className="block font-bold text-sm truncate max-w-[150px]">
              {user?.name || 'Super Admin BPTI'}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-[10px] font-bold bg-amber-500 text-slate-900 uppercase">
              {user?.role || 'Admin'}
            </span>
          </div>
        </div>
      </div>

      {/* Menu Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div>
          <span className="px-3 text-[10px] font-bold text-blue-200/60 uppercase tracking-widest block mb-3">
            MAIN MENU
          </span>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-150 group ${
                    isActive
                      ? 'bg-white/15 text-white shadow-md'
                      : 'text-blue-100 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-blue-200/70'}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <span className="px-3 text-[10px] font-bold text-blue-200/60 uppercase tracking-widest block mb-3">
            INTERNSHIP
          </span>
          <nav className="space-y-1">
            {extraItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-150 group ${
                    isActive
                      ? 'bg-white/15 text-white shadow-md'
                      : 'text-blue-100 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-blue-200/70'}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Logout Footer */}
      <div className="p-4 border-t border-blue-600/40 bg-blue-900/20">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2.5 px-4 py-3 rounded-xl text-sm font-bold text-red-200 hover:text-white hover:bg-red-600 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Keluar Sistem</span>
        </button>
      </div>
    </aside>
  );
}
