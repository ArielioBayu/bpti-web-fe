'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Download, Search, FileText, RefreshCw } from 'lucide-react';
import downloadsService from '../../services/downloads';
import { Download as DownloadType } from '../../types';

function DownloadsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [downloads, setDownloads] = useState<DownloadType[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync category if URL params change
  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    setActiveCategory(cat);
  }, [searchParams]);

  const loadDownloads = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = activeCategory !== 'All' ? { category: activeCategory } : undefined;
      const data = await downloadsService.list(params);
      setDownloads(data || []);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat berkas unduhan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDownloads();
  }, [activeCategory]);

  const filteredDownloads = downloads.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900">
          Pusat Unduhan Dokumen
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Temukan buku panduan penggunaan aplikasi, formulir pendaftaran magang BPTI, Surat Keputusan (SK) resmi, serta dokumen pendukung lainnya.
        </p>
      </div>

      {/* Search & Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-white border border-slate-200/50 p-5 rounded-2xl shadow-sm">
        <div className="md:col-span-2 relative">
          <input
            type="text"
            placeholder="Cari nama berkas atau deskripsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
          />
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
        </div>

        <div className="flex justify-end">
          <button
            onClick={loadDownloads}
            className="inline-flex items-center px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border text-xs font-bold text-slate-600 rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Muat Ulang
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-px text-xs font-bold text-slate-500">
        {['All', 'Panduan', 'Formulir', 'SK', 'Lainnya'].map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 border-b-2 font-black transition-all ${
                isActive
                  ? 'border-blue-600 text-[#1E3A8A]'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              {cat === 'All' ? 'Semua Berkas' : cat}
            </button>
          );
        })}
      </div>

      {/* Download Items Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-white border rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredDownloads.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200/50 rounded-3xl space-y-4">
          <FileText className="mx-auto w-12 h-12 text-slate-350" />
          <h3 className="text-sm font-extrabold text-slate-800">Berkas Tidak Ditemukan</h3>
          <p className="text-slate-500 text-xs max-w-xs mx-auto">
            Maaf, kami tidak menemukan berkas dokumen untuk pencarian atau filter kategori saat ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDownloads.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between space-x-4"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <span className="inline-block px-2 py-0.5 text-[8.5px] font-bold text-[#1E3A8A] bg-blue-50 border border-blue-100 rounded uppercase tracking-wider">
                  {doc.category}
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 truncate">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {doc.description || 'Unduh file dokumen panduan resmi dari BPTI UHAMKA.'}
                </p>
              </div>

              <div className="shrink-0 pt-1">
                <a
                  href={doc.file_url.startsWith('http') ? doc.file_url : `http://localhost:8080${doc.file_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center p-3 text-white bg-[#0A56A4] hover:bg-[#08427f] rounded-xl shadow transition-colors"
                  title="Unduh File"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PublicDownloadsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading downloads...</div>}>
      <DownloadsContent />
    </Suspense>
  );
}
