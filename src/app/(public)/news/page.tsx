'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Calendar, Eye, ArrowRight, LayoutGrid, FileText } from 'lucide-react';
import newsService from '../../services/news';
import categoriesService from '../../services/categories';
import { News, Category } from '../../types';

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const limit = 6;

  // Handle Search Debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 45000); // Wait 450ms before triggering search
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const catData = await categoriesService.list();
        setCategories(catData);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch news list based on queries
  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const result = await newsService.list({
          page: currentPage,
          limit,
          sort: sortOrder,
          search: searchQuery, // Using active input or debounced
          category: selectedCategory,
          status: 'published',
        });
        setNews(result.data || []);
        setTotalPages(Math.ceil(result.total / limit) || 1);
      } catch (err: any) {
        // If 404 is thrown, handle gracefully (empty results)
        if (err.response?.status === 404) {
          setNews([]);
          setTotalPages(1);
        } else {
          console.error('Failed to fetch news:', err);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [currentPage, sortOrder, selectedCategory, debouncedSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(searchQuery);
    setCurrentPage(1);
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header Info */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          Berita & Warta BPTI
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Temukan kabar kegiatan, tutorial, update sistem informasi, dan dokumentasi program kerja Badan Pengembangan Teknologi Informasi UHAMKA.
        </p>
      </div>

      {/* Search, Sort, and Filter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center bg-white dark:bg-slate-900 border border-slate-200/50 p-6 rounded-3xl shadow-sm">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="lg:col-span-2 relative">
          <input
            type="text"
            placeholder="Cari judul berita atau isi konten..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        </form>

        {/* Categories Select */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategorySelect(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none cursor-pointer"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order Select */}
        <div>
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none cursor-pointer"
          >
            <option value="desc">Urutan: Terbaru</option>
            <option value="asc">Urutan: Terlama</option>
          </select>
        </div>
      </div>

      {/* Main Results Listing */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden border shadow-sm animate-pulse space-y-4">
              <div className="h-48 bg-slate-200 w-full"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-6 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200/50 rounded-3xl space-y-4">
          <FileText className="mx-auto w-14 h-14 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-800">Berita Tidak Ditemukan</h3>
          <p className="text-slate-500 max-w-sm mx-auto text-sm">
            Maaf, kami tidak menemukan kecocokan berita untuk pencarian atau filter yang Anda gunakan.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setDebouncedSearch('');
              setSelectedCategory('');
              setCurrentPage(1);
            }}
            className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <article
              key={item.id}
              className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden shrink-0">
                <img
                  src={item.image_url?.startsWith('http') ? item.image_url : `http://localhost:8080${item.image_url}`}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=60';
                  }}
                />
                {item.category_name && (
                  <span className="absolute top-4 left-4 inline-block px-3 py-1 text-xs font-bold text-white bg-blue-600 rounded-lg shadow">
                    {item.category_name}
                  </span>
                )}
              </div>

              <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-slate-400 space-x-3">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {item.created_at?.split(' ')[0] || '16-07-2026'}
                    </span>
                    <span className="flex items-center">
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      {item.view_count || 0} views
                    </span>
                  </div>

                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    <Link href={`/news/${item.slug}`}>{item.title}</Link>
                  </h3>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    Penulis: {item.author_name || 'Admin'}
                  </span>
                  <Link
                    href={`/news/${item.slug}`}
                    className="inline-flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform"
                  >
                    Baca Artikel
                    <ArrowRight className="ml-1 w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Sebelumnya
          </button>
          <span className="text-sm font-semibold text-slate-500 px-4">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Berikutnya
          </button>
        </div>
      )}
    </div>
  );
}
