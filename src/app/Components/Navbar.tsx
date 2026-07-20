'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Menu, X, Phone, MapPin, Clock, Search, ChevronDown, HelpCircle
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Monitor scroll for shadow depth
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
      {/* 1. TOP MINI HEADER BAR */}
      <div className="hidden lg:block bg-white border-b border-slate-100 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[11px] font-semibold text-slate-500">
          {/* Left Contact Information */}
          <div className="flex items-center space-x-6">
            <span className="flex items-center">
              <Phone className="w-3.5 h-3.5 mr-1.5 text-[#1E3A8A]" />
              +62-877-2626-9479 (Chat Only)
            </span>
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#1E3A8A]" />
              ICT Center UHAMKA, Jakarta Timur
            </span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-[#1E3A8A]" />
              Senin - Jumat: 08.00 - 16.00
            </span>
          </div>

          {/* Right Social Media Links */}
          <div className="flex items-center space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1E3A8A] transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1E3A8A] transition-colors font-bold text-[9px] uppercase tracking-tighter">
              Tiktok
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1E3A8A] transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1E3A8A] transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-shadow duration-200 ${
        isScrolled ? 'shadow-md shadow-slate-100' : ''
      }`}>
        <div className="flex items-center justify-between h-20">
          
          {/* Logo BPTI UHAMKA */}
          <Link href="/" className="flex items-center shrink-0 group">
            <Image
              src="/logo-bpti.jpg"
              alt="BPTI UHAMKA"
              width={180}
              height={80}
              className="h-13 w-auto object-contain"
              priority
            />
          </Link>

          {/* Main Navigation Links (All uppercase, bold slate with spacing) */}
          <div className="hidden lg:flex items-center space-x-7 text-[12px] font-black tracking-wider text-slate-800 ml-12">
            <Link href="/" className="hover:text-[#1E3A8A] transition-colors">
              BERANDA
            </Link>

            {/* Dropdown PROFIL */}
            <div className="relative">
              <button
                onMouseEnter={() => setProfileOpen(true)}
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-0.5 hover:text-[#1E3A8A] focus:outline-none"
              >
                <span>PROFIL</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {profileOpen && (
                <div
                  onMouseLeave={() => setProfileOpen(false)}
                  className="absolute left-0 mt-2 w-48 bg-white border border-slate-100 rounded-lg shadow-lg py-2 z-50 text-[11px]"
                >
                  <a href="/#profile-visi" className="block px-4 py-2.5 hover:bg-slate-50 hover:text-[#1E3A8A] font-bold">
                    VISI & MISI
                  </a>
                  <a href="/#team" className="block px-4 py-2.5 hover:bg-slate-50 hover:text-[#1E3A8A] font-bold">
                    TIM STAFF BPTI
                  </a>
                </div>
              )}
            </div>

            <Link href="/#products" className="hover:text-[#1E3A8A] transition-colors">
              PRODUK
            </Link>
            
            <Link href="/news" className="hover:text-[#1E3A8A] transition-colors">
              ARTIKEL
            </Link>

            <Link href="/downloads" className="hover:text-[#1E3A8A] transition-colors">
              DOWNLOAD
            </Link>

            <Link href="/pkl" className="hover:text-[#1E3A8A] transition-colors">
              PROGRAM PKL
            </Link>

            <Link href="/downloads?category=Panduan" className="hover:text-[#1E3A8A] transition-colors">
              PANDUAN APPS
            </Link>
          </div>

          {/* Right Controls Widget */}
          <div className="hidden lg:flex items-center space-x-5 shrink-0">
            {/* Search Trigger */}
            <button className="text-slate-600 hover:text-[#1E3A8A] transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Language Picker Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center space-x-1 border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-50 focus:outline-none"
              >
                {/* Flag display (ID / Indo) */}
                <span className="w-5 h-3.5 bg-red-600 relative overflow-hidden rounded shadow-sm inline-block">
                  <span className="absolute bottom-0 left-0 right-0 h-1/2 bg-white"></span>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>
              {langOpen && (
                <div
                  onMouseLeave={() => setLangOpen(false)}
                  className="absolute right-0 mt-2 w-32 bg-white border rounded-xl shadow-lg py-2 z-50 text-xs font-bold text-slate-700"
                >
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center space-x-2">
                    <span className="w-4 h-2.5 bg-red-600 relative overflow-hidden rounded inline-block"><span className="absolute bottom-0 left-0 right-0 h-1/2 bg-white"></span></span>
                    <span>Indonesia</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center space-x-2">
                    <span className="w-4 h-2.5 bg-blue-900 relative overflow-hidden rounded inline-block"><span className="absolute left-0 right-0 h-1/2 bg-red-600"></span><span className="absolute bottom-0 left-0 right-0 h-1/2 bg-white"></span></span>
                    <span>English</span>
                  </button>
                </div>
              )}
            </div>

            {/* Call Center Button */}
            <a
              href="https://wa.me/6287726269479"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 h-12 text-xs font-black text-white bg-[#0A56A4] hover:bg-[#08427f] transition-all rounded shadow-sm"
            >
              CALL CENTER
            </a>
          </div>

          {/* Mobile responsive toggle */}
          <div className="lg:hidden flex items-center space-x-3">
            <a
              href="https://wa.me/6287726269479"
              className="px-4 py-2 text-[10px] font-black text-white bg-[#0A56A4] rounded"
            >
              CALL CENTER
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu navigation */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 text-xs font-bold text-slate-700">
            <Link href="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-slate-50">
              BERANDA
            </Link>
            <a href="/#profile-visi" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-slate-50">
              VISI & MISI
            </a>
            <a href="/#team" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-slate-50">
              TIM STAFF BPTI
            </a>
            <Link href="/#products" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-slate-50">
              PRODUK
            </Link>
            <Link href="/news" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-slate-50">
              ARTIKEL
            </Link>
            <Link href="/downloads" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-slate-50">
              DOWNLOAD
            </Link>
            <Link href="/pkl" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-slate-50">
              PROGRAM PKL
            </Link>
            <Link href="/downloads?category=Panduan" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-slate-50">
              PANDUAN APPS
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
