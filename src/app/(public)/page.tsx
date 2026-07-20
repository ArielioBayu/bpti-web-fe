'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { 
  ArrowRight, BookOpen, Layers, Users, MessageSquare, HelpCircle, 
  ChevronDown, ExternalLink, Calendar, Eye, FileText, Search, 
  Server, Shield, Network, ArrowUpRight, Sparkles, CheckCircle2
} from 'lucide-react';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import productsService from '../services/products';
import newsService from '../services/news';
import teamService from '../services/team';
import testimonialsService from '../services/testimonials';
import faqsService from '../services/faqs';
import { Product, News, TeamMember, Testimonial, FAQ } from '../types';

export default function HomePage() {
  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [newsList, setNewsList] = useState<News[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  // UI States
  const [activeCategory, setActiveCategory] = useState<'All' | 'Mahasiswa' | 'Dosen' | 'Tendik' | 'Umum'>('All');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Stats Counters
  const [stats, setStats] = useState({
    newsCount: 0,
    appsCount: 0,
    teamCount: 0,
    testimonialsCount: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prodData, newsData, teamData, testData, faqData] = await Promise.all([
          productsService.list(),
          newsService.list({ limit: 4, status: 'published' }),
          teamService.list(),
          testimonialsService.list(),
          faqsService.list(),
        ]);

        const prodList = prodData || [];
        const teamList = teamData || [];
        const testList = testData || [];
        const faqList = faqData || [];

        setProducts(prodList);
        setNewsList(newsData.data || []);
        setTeam(teamList);
        setTestimonials(testList);
        setFaqs(faqList);

        // Update stats
        setStats({
          newsCount: newsData.total || newsData.data?.length || 0,
          appsCount: prodList.length,
          teamCount: teamList.length,
          testimonialsCount: testList.length,
        });
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter products by category & search query
  const filteredProducts = products.filter(p => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans overflow-hidden">
      
      {/* 1. HERO SECTION (Full-width Deep Navy Blue & Emerald Gradient Container) */}
      <div className="relative w-full bg-gradient-to-br from-[#0B56A4] via-[#0D9488] to-[#1E3A8A] border-b border-blue-950/40 pb-40 pt-40 -mt-20 overflow-hidden bg-grid-pattern-dark text-white">
        
        {/* Ambient floating blobs inside the hero area */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <motion.div
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-40 -left-40 w-[40rem] h-[40rem] rounded-full bg-blue-400/20 blur-3xl"
          ></motion.div>
          <motion.div
            animate={{
              y: [0, 20, 0],
              x: [0, -15, 0],
              scale: [1, 0.95, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute top-20 right-10 w-[30rem] h-[30rem] rounded-full bg-emerald-400/20 blur-3xl"
          ></motion.div>
        </div>

        <section className="relative max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
            
            {/* Hero Left Column */}
            <div className="lg:col-span-6 space-y-10 z-20">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-sm"
              >
                <span className="flex h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>
                <span className="text-[10px] font-black tracking-widest text-white uppercase">BPTI UHAMKA Portal</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="space-y-4"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-7.5xl font-black tracking-tight leading-[0.95] text-white uppercase">
                  Akselerasi <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-400">
                    Digitalisasi
                  </span> <br />
                  Kampus
                </h1>
                
                <p className="text-base sm:text-lg text-blue-100 font-normal leading-relaxed tracking-wide max-w-lg">
                  Membangun ekosistem teknologi inovatif terintegrasi, menjamin keamanan cyber terpadu, dan menghadirkan layanan digital terbaik di Universitas Muhammadiyah Prof. DR. HAMKA.
                </p>
              </motion.div>

              {/* Integrated Search Form */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-md"
              >
                <div className="flex bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl shadow-xl focus-within:ring-2 focus-within:ring-yellow-400 transition-all">
                  <input
                    type="text"
                    placeholder="Cari layanan (misal: OLU, SIAKAD, Wifi)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow px-4 py-3 bg-transparent text-white placeholder-slate-300 font-semibold focus:outline-none text-xs"
                  />
                  <a
                    href="#products"
                    className="p-3 bg-[#F97316] hover:bg-orange-600 transition-colors rounded-xl flex items-center justify-center text-white"
                  >
                    <Search className="w-4 h-4 text-white" />
                  </a>
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <a
                  href="#products"
                  className="inline-flex items-center justify-center px-8 py-4 text-xs font-black uppercase tracking-wider text-slate-900 bg-white rounded-full hover:bg-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  Akses Aplikasi
                  <ArrowRight className="ml-2 w-4 h-4 text-[#1E3A8A]" />
                </a>
                <Link
                  href="/pkl"
                  className="inline-flex items-center justify-center px-8 py-4 text-xs font-black uppercase tracking-wider text-white bg-white/10 border border-white/20 rounded-full hover:bg-white/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  Program Magang / PKL
                </Link>
              </motion.div>
            </div>

            {/* Hero Right Column */}
            <div className="lg:col-span-6 relative z-10">
              <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center">
                
                <div className="absolute inset-4 bg-gradient-to-tr from-yellow-400/10 to-orange-400/10 rounded-[3rem] -rotate-6 scale-98 pointer-events-none border border-dashed border-white/10"></div>
                <div className="absolute inset-4 bg-white/5 rounded-[3rem] rotate-3 scale-102 pointer-events-none blur-sm"></div>

                <div className="relative w-[90%] h-[90%] bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/10">
                  <Image
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80"
                    alt="BPTI UHAMKA Team"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                </div>

                {/* Floating dark frosted glass widgets */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 -right-6 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-4 rounded-2xl shadow-2xl flex items-center space-x-3.5"
                >
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Status Jaringan</span>
                    <span className="font-extrabold text-xs text-white">Server Utama Aktif (100%)</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-16 -left-8 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-4 rounded-2xl shadow-2xl flex items-center space-x-3.5"
                >
                  <div className="p-2 bg-[#F97316]/20 text-[#F97316] rounded-lg">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Aplikasi Terdaftar</span>
                    <span className="font-extrabold text-xs text-white">{stats.appsCount}+ Layanan Kampus</span>
                  </div>
                </motion.div>

              </div>
            </div>

          </div>
        </section>
      </div>

      {/* 2. STATS SECTION (Floating overlapping card wrapper) */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 -mt-16 z-30 mb-32">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white border border-slate-200/55 p-8 rounded-[2.25rem] shadow-2xl shadow-slate-200/50">
          {[
            { label: 'Total Berita', count: stats.newsCount, icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
            { label: 'Aplikasi Aktif', count: stats.appsCount, icon: Layers, color: 'text-purple-600 bg-purple-50' },
            { label: 'Anggota Tim', count: stats.teamCount, icon: Users, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Testimonial', count: stats.testimonialsCount, icon: MessageSquare, color: 'text-amber-600 bg-amber-50' },
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors duration-200">
              <div className={`p-4 rounded-xl ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                {loading ? (
                  <div className="h-7 w-12 bg-slate-200 animate-pulse rounded-md"></div>
                ) : (
                  <span className="block text-2xl font-black text-slate-900">
                    {item.count}
                  </span>
                )}
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. APPLICATIONS SHOWCASE (Wrapped inside a clean soft blue-grey section) */}
      <div className="w-full bg-slate-100/60 border-y border-slate-200/40 py-24 mb-32">
        <section id="products" className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16 scroll-mt-24">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-black uppercase text-[#F97316] tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">Portal Layanan</span>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl uppercase tracking-tight">
              Aplikasi & Sistem Informasi BPTI
            </h2>
            <p className="text-slate-500 font-normal text-sm leading-relaxed max-w-lg mx-auto">
              Daftar aplikasi resmi universitas untuk memfasilitasi kebutuhan akademik mahasiswa, dosen, serta operasional tata kependidikan.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl max-w-xl mx-auto">
            {(['All', 'Mahasiswa', 'Dosen', 'Tendik', 'Umum'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#1E3A8A] text-white shadow'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {cat === 'All' ? 'Semua User' : cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-[2rem] p-6 border shadow animate-pulse h-48"></div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border rounded-[2rem] max-w-md mx-auto space-y-4">
              <Layers className="mx-auto w-10 h-10 text-slate-350" />
              <p className="text-slate-500 text-xs font-black uppercase tracking-wider">Aplikasi tidak ditemukan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(app => (
                <div
                  key={app.id}
                  className="group bg-white rounded-[2rem] p-7 border border-slate-250/50 shadow-sm hover:shadow-[0_20px_40px_rgba(30,58,138,0.06)] hover:border-[#1E3A8A] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-14 h-14 bg-slate-50 border rounded-2xl overflow-hidden flex items-center justify-center p-2.5 shadow-inner">
                        {app.logo_url ? (
                          <Image
                            src={app.logo_url.startsWith('http') ? app.logo_url : `http://localhost:8080${app.logo_url}`}
                            alt=""
                            fill
                            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                            sizes="60px"
                          />
                        ) : (
                          <Layers className="text-slate-400 w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#1E3A8A] transition-colors leading-tight">
                          {app.name}
                        </h3>
                        <span className="inline-block px-2.5 py-0.5 mt-1 text-[8px] font-black text-[#1E3A8A] bg-blue-50 rounded uppercase tracking-wider">
                          Akses: {app.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-3">
                      {app.description || 'Sistem informasi terpadu yang membantu kegiatan perkuliahan kampus UHAMKA.'}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Official Portal</span>
                    <a
                      href={app.app_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-black text-[#1E3A8A] hover:underline uppercase tracking-wider"
                    >
                      Buka Portal
                      <ArrowUpRight className="ml-1.5 w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* 4. RECENT NEWS GRID (Wrapped inside a full-width pure white container) */}
      <div className="w-full bg-white border-b border-slate-200/50 py-24 mb-32 bg-grid-pattern">
        <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200/65">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] font-black uppercase text-[#F97316] tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">Kabar Akademik</span>
              <h2 className="text-3xl font-black text-slate-900 sm:text-4xl uppercase tracking-tight">
                Berita & Pengumuman BPTI
              </h2>
            </div>
            <Link
              href="/news"
              className="inline-flex items-center px-6 py-3.5 text-xs font-black text-[#1E3A8A] border-2 border-slate-200 hover:border-[#1E3A8A] rounded-full hover:bg-slate-50 transition-colors uppercase tracking-wider"
            >
              Lihat Semua Berita
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-slate-50 rounded-[2rem] overflow-hidden border shadow animate-pulse h-64"></div>
              ))}
            </div>
          ) : newsList.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 border rounded-[2rem] max-w-md mx-auto space-y-4">
              <FileText className="mx-auto w-10 h-10 text-slate-350" />
              <p className="text-slate-500 text-xs font-bold">Belum ada rilis berita saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsList.slice(0, 3).map(news => (
                <article
                  key={news.id}
                  className="group bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-200/50 shadow-sm hover:shadow-[0_25px_50px_rgba(15,23,42,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative h-52 bg-slate-100 overflow-hidden shrink-0">
                    <Image
                      src={news.image_url?.startsWith('http') ? news.image_url : `http://localhost:8080${news.image_url}`}
                      alt={news.title}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                    {news.category_name && (
                      <span className="absolute top-4 left-4 inline-block px-3 py-1 text-[9px] font-black text-white bg-[#1E3A8A] rounded-lg uppercase tracking-wider">
                        {news.category_name}
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex flex-col justify-between flex-grow space-y-5">
                    <div className="space-y-2">
                      <div className="flex items-center text-[10px] font-bold text-slate-400 space-x-3">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {news.created_at?.split(' ')[0] || '16-07-2026'}
                        </span>
                        <span>{news.view_count || 0} views</span>
                      </div>

                      <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#1E3A8A] transition-colors line-clamp-2 leading-snug">
                        <Link href={`/news/${news.slug}`}>{news.title}</Link>
                      </h3>
                    </div>

                    <div className="pt-4 mt-auto border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>Oleh: {news.author_name || 'Admin'}</span>
                      <Link
                        href={`/news/${news.slug}`}
                        className="inline-flex items-center text-[#1E3A8A] uppercase tracking-wider font-black group-hover:translate-x-1 transition-transform"
                      >
                        Detail
                        <ArrowRight className="ml-1 w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* 5. INTERNSHIP CTA CARD (Wrapped inside a bright orange gradient backdrop) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 mb-32">
        <div className="relative bg-gradient-to-r from-[#F97316] to-[#EA580C] rounded-[2.5rem] shadow-2xl text-white p-8 md:p-16 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-grid-pattern-dark pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-[10px] font-black uppercase text-white bg-white/10 px-3 py-1 rounded-full border border-white/20">Program Magang</span>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl uppercase leading-none text-white">
              Bangun Portofolio Tech Anda di BPTI
            </h2>
            <p className="text-orange-50 text-sm sm:text-base leading-relaxed font-semibold">
              Ayo ikuti program kerja nyata/PKL untuk mempelajari sysadmin jaringan, manajemen cloud server, dan perancangan platform akademik digital bersama tim engineer BPTI.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/pkl"
                className="inline-flex items-center px-8 py-4 text-xs font-black uppercase tracking-wider text-slate-900 bg-white rounded-full hover:bg-slate-50 transition-all hover:scale-102 shadow-lg"
              >
                Daftar PKL/Magang
                <ArrowRight className="ml-2 w-4 h-4 text-[#F97316]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TEAM MEMBERS (Wrapped in a soft slate-50 background container) */}
      <div className="w-full bg-slate-50 border-y border-slate-200/40 py-24 mb-32">
        <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] font-black uppercase text-[#F97316] tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">Tim Pengembang</span>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl uppercase tracking-tight leading-none">
              Direktori Staff BPTI
            </h2>
            <p className="text-slate-500 font-medium text-xs sm:text-sm">
              Tim ahli pengembang sistem, pengelola keamanan siber, dan teknisi jaringan utama kampus UHAMKA.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-52 bg-white border rounded-[2rem] animate-pulse"></div>
              ))}
            </div>
          ) : team.length === 0 ? (
            <div className="text-center py-20 bg-white border rounded-[2rem] max-w-md mx-auto space-y-4">
              <Users className="mx-auto w-10 h-10 text-slate-350" />
              <p className="text-slate-500 text-xs font-bold">Direktori tim belum terbuat.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {team.map(member => (
                <div
                  key={member.id}
                  className="group bg-white border border-slate-200/50 rounded-[2rem] p-6 text-center hover:shadow-[0_20px_40px_rgba(30,58,138,0.06)] hover:-translate-y-1 hover:border-[#1E3A8A] transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-slate-200 p-0.5 group-hover:scale-102 transition-transform duration-300">
                      <img
                        src={member.photo_url?.startsWith('http') ? member.photo_url : `http://localhost:8080${member.photo_url}`}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full bg-slate-50"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=60';
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                        {member.name}
                      </h3>
                      <p className="text-[10px] font-black text-[#F97316] mt-1 uppercase tracking-wide">
                        {member.position}
                      </p>
                    </div>
                  </div>
                  <span className="inline-block px-3 py-1 mt-4 text-[9px] font-black text-slate-500 bg-slate-50 rounded-full border uppercase tracking-wider">
                    {member.division}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* 7. SWIPER.JS TESTIMONIALS CAROUSEL */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-8 mb-32">
          <div className="bg-[#0A56A4] text-white py-16 px-6 sm:px-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern-dark opacity-10 pointer-events-none"></div>
            
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <MessageSquare className="w-10 h-10 text-yellow-400 opacity-60 mx-auto" />
              
              <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                loop={testimonials.length > 1}
                className="testimonials-swiper pb-10"
              >
                {testimonials.map(test => (
                  <SwiperSlide key={test.id} className="cursor-grab active:cursor-grabbing">
                    <div className="space-y-6">
                      <p className="text-base sm:text-xl font-semibold italic text-slate-100 leading-relaxed max-w-3xl mx-auto">
                        "{test.quote}"
                      </p>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-white">
                          {test.name}
                        </h4>
                        <p className="text-[9px] font-black text-yellow-400 uppercase tracking-widest">
                          {test.role}
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>
      )}

      {/* 8. FAQS SECTION (Clean white background layout) */}
      <section id="faqs" className="max-w-3xl mx-auto px-6 sm:px-8 space-y-12 scroll-mt-24 pb-20">
        <div className="text-center space-y-4">
          <span className="text-[10px] font-black uppercase text-[#F97316] tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">Bantuan FAQ</span>
          <h2 className="text-3xl font-black text-slate-900 sm:text-4xl uppercase tracking-tight leading-none">
            Tanya Jawab Layanan IT
          </h2>
          <p className="text-slate-500 font-medium text-xs sm:text-sm">
            Panduan cepat penyelesaian kendala akun SSO, wifi internet kampus, dan pengajuan magang BPTI.
          </p>
        </div>

        {loading ? (
          <div className="h-16 bg-white border rounded-2xl animate-pulse"></div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-20 bg-white border rounded-[2rem] space-y-4">
            <HelpCircle className="mx-auto w-10 h-10 text-slate-350" />
            <p className="text-slate-500 text-xs font-bold">Daftar FAQ belum dikonfigurasi.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.id}
                  className="bg-white border border-slate-200/60 rounded-[1.5rem] overflow-hidden shadow-sm transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none cursor-pointer"
                  >
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#1E3A8A]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 border-t border-slate-50 pt-4 leading-relaxed font-semibold">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
