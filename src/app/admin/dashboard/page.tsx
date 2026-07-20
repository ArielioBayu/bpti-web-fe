'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, Layers, Users, HelpCircle, ArrowUpRight, 
  Plus, Sparkles, TrendingUp, CheckCircle, Clock, AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import newsService from '../../services/news';
import productsService from '../../services/products';
import teamService from '../../services/team';
import pklService from '../../services/pkl';
import { News, Product, TeamMember, PKLSubmission } from '../../types';

export default function AdminDashboard() {
  const { user } = useAuth();
  
  // Data States
  const [news, setNews] = useState<News[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [submissions, setSubmissions] = useState<PKLSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Counters
  const [stats, setStats] = useState({
    news: 0,
    products: 0,
    team: 0,
    submissions: 0,
    pendingSubmissions: 0,
    activeSliders: 0,
  });

  useEffect(() => {
    async function loadDashboardStats() {
      try {
        setLoading(true);
        const [newsRes, prodRes, teamRes, pklRes, slideRes] = await Promise.all([
          newsService.list({ limit: 100 }),
          productsService.list(),
          teamService.list(),
          pklService.listSubmissions(),
          newsService.list({ category: 'slider', limit: 100 }),
        ]);

        const newsList = newsRes?.data || [];
        const prodList = prodRes || [];
        const teamList = teamRes || [];
        const pklList = pklRes || [];
        const slideList = slideRes?.data || [];

        setNews(newsList);
        setProducts(prodList);
        setTeam(teamList);
        setSubmissions(pklList);

        const pending = pklList.filter(s => s?.status === 'pending').length;
        const activeSlides = slideList.filter(s => s.status === 'published').length;

        setStats({
          news: newsRes?.total || newsList.length,
          products: prodList.length,
          team: teamList.length,
          submissions: pklList.length,
          pendingSubmissions: pending,
          activeSliders: activeSlides,
        });
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardStats();
  }, []);

  // 1. Data Prep for News Views Bar Chart
  const topNewsChartData = (news || [])
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, 5)
    .map(n => ({
      name: n.title.length > 15 ? n.title.substring(0, 15) + '...' : n.title,
      views: n.view_count || 0,
    }));

  // 2. Data Prep for Team Division Pie Chart
  const divisionCounts = (team || []).reduce((acc: Record<string, number>, member) => {
    const div = member.division || 'Lainnya';
    acc[div] = (acc[div] || 0) + 1;
    return acc;
  }, {});

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const divisionChartData = Object.entries(divisionCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // 3. Data Prep for Submission Status Pie Chart
  const submissionStatusCounts = (submissions || []).reduce((acc: Record<string, number>, sub) => {
    acc[sub.status] = (acc[sub.status] || 0) + 1;
    return acc;
  }, { pending: 0, approved: 0, rejected: 0 });

  const pklStatusChartData = [
    { name: 'Menunggu (Pending)', value: submissionStatusCounts.pending, color: '#FBBF24' },
    { name: 'Disetujui (Approved)', value: submissionStatusCounts.approved, color: '#10B981' },
    { name: 'Ditolak (Rejected)', value: submissionStatusCounts.rejected, color: '#EF4444' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Card Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-[2rem] p-8 md:p-10 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-white blur-2xl"></div>
        </div>
        
        <div className="space-y-3 text-center md:text-left relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BPTI Uhamka Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Selamat datang, {user?.name || 'Editor BPTI'} 👋
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Kelola konten website BPTI UHAMKA — berita, proyek aplikasi, direktori tim, berkas unduhan, dan pantau pengajuan PKL yang masuk di sini.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 relative z-10">
          <Link
            href="/admin/products"
            className="inline-flex items-center justify-center px-5 py-3 text-xs font-bold text-slate-900 bg-white rounded-xl hover:bg-slate-50 transition-colors shadow-md"
          >
            <Plus className="mr-1.5 w-4 h-4 text-blue-600" />
            Tambah Proyek
          </Link>
          <Link
            href="/admin/news"
            className="inline-flex items-center justify-center px-5 py-3 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus className="mr-1.5 w-4 h-4" />
            Buat Berita
          </Link>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Berita', count: stats.news, icon: FileText, color: 'border-l-4 border-blue-500 text-blue-600' },
          { label: 'Proyek BPTI', count: stats.products, icon: Layers, color: 'border-l-4 border-purple-500 text-purple-600' },
          { label: 'Tim BPTI', count: stats.team, icon: Users, color: 'border-l-4 border-emerald-500 text-emerald-600' },
          { label: 'Slider Aktif', count: stats.activeSliders, icon: ImageIcon, color: 'border-l-4 border-amber-500 text-amber-600', extra: 'Banner slider' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                {stat.label}
              </span>
              <span className="text-3xl font-extrabold text-slate-900 block">
                {loading ? '...' : stat.count}
              </span>
              {stat.extra && (
                <span className="inline-block px-2 py-0.5 mt-2 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 uppercase">
                  {stat.extra}
                </span>
              )}
            </div>
            <div className={`p-3.5 rounded-xl bg-slate-50 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart 1: News Views Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Analitik Pembaca Berita</h3>
              <p className="text-xs text-slate-500">Visualisasi 5 berita terpopuler berdasarkan total views</p>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>

          <div className="h-72 w-full text-xs">
            {loading ? (
              <div className="h-full bg-slate-50 rounded-2xl animate-pulse"></div>
            ) : topNewsChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400">Belum ada data berita.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topNewsChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="views" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 2: Division distribution for team */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm space-y-6">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Distribusi Divisi Tim</h3>
            <p className="text-xs text-slate-500">Komposisi sebaran divisi staf BPTI UHAMKA</p>
          </div>

          <div className="h-72 w-full flex items-center justify-center text-xs">
            {loading ? (
              <div className="h-40 w-40 bg-slate-50 rounded-full animate-pulse"></div>
            ) : divisionChartData.length === 0 ? (
              <div className="text-slate-400">Belum ada data tim.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={divisionChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {divisionChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconSize={8} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Latest PKL Submissions Table */}
      <div className="bg-white rounded-3xl border border-slate-200/50 shadow-sm overflow-hidden space-y-6 py-6">
        <div className="px-6 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Pengajuan PKL/Magang Terbaru</h3>
            <p className="text-xs text-slate-500">Daftar pendaftaran magang mahasiswa yang masuk ke sistem BPTI</p>
          </div>
          <Link
            href="/admin/pkl"
            className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            Kelola Semua
            <ArrowUpRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto border-t border-slate-100">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="h-10 bg-slate-50 rounded animate-pulse"></div>
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-medium text-sm">
              Belum ada pengajuan PKL/Magang yang masuk ke sistem.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b text-xs uppercase tracking-wider">
                  <th className="px-6 py-4">Nama Mahasiswa</th>
                  <th className="px-6 py-4">Institusi & Jurusan</th>
                  <th className="px-6 py-4">Periode</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.slice(0, 5).map((sub) => {
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {sub.student_name}
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-xs">
                        <span className="font-semibold block">{sub.university}</span>
                        <span className="text-slate-400 block mt-0.5">{sub.major}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-xs">
                        {sub.internship_period}
                      </td>
                      <td className="px-6 py-4">
                        {sub.status === 'approved' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Disetujui
                          </span>
                        ) : sub.status === 'rejected' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Ditolak
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-yellow-50 text-yellow-700 border border-yellow-200">
                            <Clock className="w-3 h-3 mr-1" />
                            Menunggu
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href="/admin/pkl"
                          className="px-3.5 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-100 rounded-lg"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
