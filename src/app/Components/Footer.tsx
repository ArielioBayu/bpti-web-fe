import React from 'react';
import Link from 'next/link';
import { Monitor, Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Monitor className="text-white w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  BPTI <span className="text-blue-500">UHAMKA</span>
                </span>
                <p className="text-[10px] text-slate-400 font-medium">
                  Badan Pengembangan Teknologi Informasi
                </p>
              </div>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              BPTI UHAMKA bertanggung jawab untuk menyelenggarakan, mengembangkan, serta mengelola infrastruktur teknologi informasi, sistem informasi layanan akademik, dan keamanan data di lingkungan kampus Universitas Muhammadiyah Prof. DR. HAMKA.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Layanan & Menu
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors duration-200">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-white transition-colors duration-200">
                  Berita & Warta
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors duration-200">
                  Login Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Kontak Kami
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>
                  Kampus UHAMKA, Jl. Limau II, Kebayoran Baru, Jakarta Selatan, DKI Jakarta
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>(021) 7394445</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>bpti@uhamka.ac.id</span>
              </li>
              <li className="flex items-center space-x-3">
                <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                <a
                  href="https://uhamka.ac.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-200"
                >
                  uhamka.ac.id
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BPTI UHAMKA. All rights reserved.</p>
          <p className="mt-2 md:mt-0 font-medium">
            Developed with Next.js & Go Backend
          </p>
        </div>
      </div>
    </footer>
  );
}
