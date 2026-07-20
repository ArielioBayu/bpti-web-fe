'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, Plus, Search, Trash2, Edit2, Upload, 
  Check, X, AlertCircle, Eye, RefreshCw, Calendar
} from 'lucide-react';
import newsService from '../../services/news';
import categoriesService from '../../services/categories';
import uploadService from '../../services/upload';
import { News, Category } from '../../types';

export default function AdminNewsPage() {
  // Lists
  const [news, setNews] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Params/Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    image_url: '',
    category_id: 0,
    status: 'draft' as 'draft' | 'published',
  });

  // State flags
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const limit = 10;

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const newsRes = await newsService.list({
        page,
        limit,
        search,
        category,
        status,
        sort: 'desc',
      });
      setNews(newsRes.data || []);
      setTotalPages(Math.ceil(newsRes.total / limit) || 1);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setNews([]);
        setTotalPages(1);
      } else {
        setError('Gagal memuat berita.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, category, status]);

  // Load categories on start
  useEffect(() => {
    async function loadCats() {
      try {
        const catList = await categoriesService.list();
        setCategories(catList);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCats();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  // Open Modal for Create or Edit
  const openFormModal = async (newsItem?: News) => {
    setError(null);
    setSuccess(null);
    if (newsItem) {
      setSelectedId(newsItem.id);
      setForm({
        title: newsItem.title,
        content: newsItem.content,
        image_url: newsItem.image_url,
        category_id: newsItem.category_id || 0,
        status: newsItem.status,
      });
    } else {
      setSelectedId(null);
      setForm({
        title: '',
        content: '',
        image_url: '',
        category_id: categories[0]?.id || 0,
        status: 'draft',
      });
    }
    setIsModalOpen(true);
  };

  // Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!form.title || !form.content) {
      setError('Judul dan konten wajib diisi.');
      setSubmitting(false);
      return;
    }

    const payload = {
      ...form,
      category_id: Number(form.category_id) || null,
    };

    try {
      if (selectedId) {
        await newsService.update(selectedId, payload);
        setSuccess('Berita berhasil diperbarui.');
      } else {
        await newsService.create(payload);
        setSuccess('Berita baru berhasil ditambahkan.');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Gagal menyimpan berita.');
    } finally {
      setSubmitting(false);
    }
  };

  // Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const uploadRes = await uploadService.upload(file);
      setForm(prev => ({ ...prev, image_url: uploadRes.file_url }));
      setSuccess('Gambar berhasil diunggah.');
    } catch (err) {
      console.error('File upload failed:', err);
      setError('Gagal mengunggah file gambar.');
    } finally {
      setUploading(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
    try {
      await newsService.delete(id);
      setSuccess('Berita berhasil dihapus.');
      loadData();
    } catch (err) {
      console.error(err);
      setError('Gagal menghapus berita.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Kelola Berita & Artikel</h1>
          <p className="text-sm text-slate-500">Tulis, publikasikan, dan atur berita yang tampil di landing page utama.</p>
        </div>
        <button
          onClick={() => openFormModal()}
          className="inline-flex items-center px-4 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow"
        >
          <Plus className="mr-1.5 w-4 h-4" />
          Tulis Berita Baru
        </button>
      </div>

      {/* Alert Notification */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-2xl flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Filtering Row */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-96">
          <input
            type="text"
            placeholder="Cari judul..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
          />
          <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-slate-400" />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs"
          >
            <option value="">Semua Status</option>
            <option value="published">Diterbitkan (Published)</option>
            <option value="draft">Draft</option>
          </select>

          <button
            onClick={() => { setSearch(''); setCategory(''); setStatus(''); setPage(1); loadData(); }}
            className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 rounded-xl border"
            title="Reset Filters"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Datatable */}
      <div className="bg-white rounded-3xl border border-slate-200/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading list warta berita...</div>
          ) : news.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              <FileText className="mx-auto w-12 h-12 mb-3 text-slate-300" />
              <span>Belum ada artikel berita ditemukan.</span>
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b text-xs uppercase tracking-wider">
                  <th className="px-6 py-4">Thumbnail / Judul</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Views</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Dibuat Pada</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {news.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    {/* Thumbnail & Title */}
                    <td className="px-6 py-4 max-w-sm">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0 border">
                          <img
                            src={item.image_url?.startsWith('http') ? item.image_url : `http://localhost:8080${item.image_url}`}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&auto=format&fit=crop&q=60';
                            }}
                          />
                        </div>
                        <span className="font-bold text-slate-900 line-clamp-2 leading-snug">
                          {item.title}
                        </span>
                      </div>
                    </td>
                    {/* Category */}
                    <td className="px-6 py-4 text-slate-600 text-xs font-semibold">
                      {item.category_name || '-'}
                    </td>
                    {/* Views */}
                    <td className="px-6 py-4 text-slate-600 text-xs font-bold">
                      {item.view_count || 0}
                    </td>
                    {/* Status */}
                    <td className="px-6 py-4">
                      {item.status === 'published' ? (
                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          Draft
                        </span>
                      )}
                    </td>
                    {/* Date */}
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {item.created_at || '-'}
                    </td>
                    {/* Action buttons */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/news/${item.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-500 hover:text-blue-600 bg-slate-50 border rounded-lg"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openFormModal(item)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 bg-slate-50 border rounded-lg"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 bg-slate-50 border rounded-lg"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Halaman {page} dari {totalPages}</span>
            <div className="flex space-x-1">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1.5 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Form Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-900">
                {selectedId ? 'Edit Artikel Berita' : 'Tulis Artikel Berita Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Judul Berita</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan judul berita lengkap"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Kategori Berita</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm(prev => ({ ...prev, category_id: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
                  >
                    <option value={0}>Pilih Kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Status selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Status Publikasi</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
                  >
                    <option value="draft">Draft (Sembunyikan)</option>
                    <option value="published">Diterbitkan (Tampil di Home)</option>
                  </select>
                </div>
              </div>

              {/* Banner Image URL and File Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Gambar Artikel (Banner)</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="URL file gambar atau unggah via tombol di sebelah kanan"
                    value={form.image_url}
                    onChange={(e) => setForm(prev => ({ ...prev, image_url: e.target.value }))}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <div className="relative shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      id="news-upload"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="news-upload"
                      className={`inline-flex items-center px-4 py-2.5 border rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-50 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Upload className="w-4 h-4 mr-1.5 text-slate-500" />
                      {uploading ? 'Mengunggah...' : 'Upload Gambar'}
                    </label>
                  </div>
                </div>
                {form.image_url && (
                  <div className="mt-2 relative w-48 h-32 bg-slate-100 rounded-lg overflow-hidden border">
                    <img
                      src={form.image_url.startsWith('http') ? form.image_url : `http://localhost:8080${form.image_url}`}
                      alt="Review"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Rich Content Area */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Konten Berita</label>
                <textarea
                  rows={8}
                  required
                  placeholder="Masukkan isi lengkap warta berita di sini. Anda juga bisa memasukkan teks format HTML dasar seperti <p>, <strong>, <ul>, etc."
                  value={form.content}
                  onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-sans"
                />
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold border rounded-xl text-slate-500 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 shadow"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
