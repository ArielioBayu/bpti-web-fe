'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Eye, User, ArrowLeft, Tag, Clock } from 'lucide-react';
import newsService from '../../../services/news';
import { News } from '../../../types';

export default function NewsDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function loadNewsDetails() {
      try {
        setLoading(true);
        const data = await newsService.getBySlug(slug);
        setNews(data);
      } catch (err) {
        console.error('Failed to load news article:', err);
        setError('Berita tidak ditemukan atau terjadi kesalahan server.');
      } finally {
        setLoading(false);
      }
    }

    loadNewsDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/4"></div>
        <div className="h-12 bg-slate-200 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-[400px] bg-slate-200 rounded-3xl w-full"></div>
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="inline-flex p-4 rounded-full bg-rose-50 text-rose-500">
          <Clock className="w-12 h-12" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Artikel Gagal Dimuat</h3>
        <p className="text-slate-500 text-sm">{error || 'Berita yang dicari tidak ditemukan.'}</p>
        <button
          onClick={() => router.push('/news')}
          className="w-full inline-flex items-center justify-center px-6 py-3 font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Kembali ke Berita
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Back navigation */}
      <div>
        <Link
          href="/news"
          className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Kembali ke Berita
        </Link>
      </div>

      {/* Headline Block */}
      <div className="space-y-4">
        {news.category_name && (
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold text-blue-600 bg-blue-50">
            <Tag className="w-3.5 h-3.5 mr-1" />
            {news.category_name}
          </span>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
          {news.title}
        </h1>

        {/* Metadata Details */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 pt-2 border-b border-slate-100 pb-4">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
            {news.created_at || '16-07-2026'}
          </span>
          <span className="flex items-center">
            <User className="w-4 h-4 mr-2 text-slate-400" />
            {news.author_name || 'Administrator'}
          </span>
          <span className="flex items-center">
            <Eye className="w-4 h-4 mr-2 text-slate-400" />
            {news.view_count || 0} Kali dibaca
          </span>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative h-[250px] sm:h-[450px] bg-slate-100 rounded-3xl overflow-hidden shadow-md">
        <img
          src={news.image_url?.startsWith('http') ? news.image_url : `http://localhost:8080${news.image_url}`}
          alt={news.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1000&auto=format&fit=crop&q=80';
          }}
        />
      </div>

      {/* Main Content Render */}
      <div 
        className="prose prose-blue max-w-none text-slate-700 leading-relaxed text-base space-y-6 pt-4"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />
    </article>
  );
}
