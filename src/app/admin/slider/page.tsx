'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';
import newsService from '../../services/news';
import categoriesService from '../../services/categories';
import uploadService from '../../services/upload';
import { News, Category } from '../../types';

export default function AdminSliderPage() {
  const [slides, setSlides] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sliderCategoryId, setSliderCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    image_url: '',
    status: 'published' as 'published' | 'draft',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 1. Initial Load: Ensure Category "Slider" exists and fetch slides
  useEffect(() => {
    async function initSliderCategory() {
      try {
        setLoading(true);
        const catList = await categoriesService.list();
        setCategories(catList);

        let sliderCat = catList.find(c => c.slug === 'slider' || c.name.toLowerCase() === 'slider');
        
        // If "Slider" category doesn't exist, create it dynamically!
        if (!sliderCat) {
          await categoriesService.create({ name: 'Slider' });
          const updatedCatList = await categoriesService.list();
          setCategories(updatedCatList);
          sliderCat = updatedCatList.find(c => c.slug === 'slider' || c.name.toLowerCase() === 'slider');
        }

        if (sliderCat) {
          setSliderCategoryId(sliderCat.id);
          // Load slides
          const response = await newsService.list({
            category: 'slider',
            status: '', // Fetch draft and published
            limit: 100,
          });
          setSlides(response.data || []);
        }
      } catch (err) {
        console.error(err);
        setError('Gagal menginisialisasi kategori slider.');
      } finally {
        setLoading(false);
      }
    }

    initSliderCategory();
  }, []);

  const reloadSlides = async () => {
    if (!sliderCategoryId) return;
    setLoading(true);
    try {
      const response = await newsService.list({
        category: 'slider',
        status: '',
        limit: 100,
      });
      setSlides(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openFormModal = (slide?: News) => {
    setError(null);
    setSuccess(null);
    if (slide) {
      setSelectedId(slide.id);
      setForm({
        title: slide.title,
        content: slide.content,
        image_url: slide.image_url,
        status: slide.status,
      });
    } else {
      setSelectedId(null);
      setForm({
        title: '',
        content: '',
        image_url: '',
        status: 'published',
      });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!form.title || !form.image_url) {
      setError('Judul banner dan gambar slider wajib diisi.');
      setSubmitting(false);
      return;
    }

    if (!sliderCategoryId) {
      setError('Kategori slider belum terbuat.');
      setSubmitting(false);
      return;
    }

    const payload = {
      ...form,
      category_id: sliderCategoryId,
    };

    try {
      if (selectedId) {
        await newsService.update(selectedId, payload);
        setSuccess('Banner slide berhasil diperbarui.');
      } else {
        await newsService.create(payload);
        setSuccess('Banner slide baru berhasil ditambahkan.');
      }
      setIsModalOpen(false);
      reloadSlides();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan slide.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const uploadRes = await uploadService.upload(file);
      setForm(prev => ({ ...prev, image_url: uploadRes.file_url }));
      setSuccess('Gambar slide berhasil diunggah.');
    } catch (err) {
      setError('Gagal mengunggah foto.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin menghapus banner slider ini?')) return;
    try {
      await newsService.delete(id);
      setSuccess('Banner slide berhasil dihapus.');
      reloadSlides();
    } catch (err) {
      setError('Gagal menghapus slide.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Pengaturan Banner Slider Beranda</h1>
          <p className="text-sm text-slate-500">Sesuaikan banner utama di beranda publik. Tambahkan foto menarik, teks overlay, dan atur status aktifnya.</p>
        </div>
        <button
          onClick={() => openFormModal()}
          className="inline-flex items-center px-4 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow"
        >
          <Plus className="mr-1.5 w-4 h-4" />
          Tambah Slide Baru
        </button>
      </div>

      {/* Notifications */}
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

      {/* Grid List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading list slider...</div>
      ) : slides.length === 0 ? (
        <div className="p-16 text-center text-slate-400 bg-white border border-slate-200/50 rounded-3xl">
          <ImageIcon className="mx-auto w-12 h-12 mb-3 text-slate-300" />
          <span>Belum ada slide banner yang dikonfigurasi. Menampilkan default landing page.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/50 shadow-sm flex flex-col justify-between"
            >
              <div className="relative h-44 bg-slate-100">
                <img
                  src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:8080${item.image_url}`}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=60';
                  }}
                />
                <span className={`absolute top-4 left-4 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  item.status === 'published'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-slate-50 text-slate-500 border-slate-250'
                }`}>
                  {item.status === 'published' ? 'Active / Published' : 'Draft / Hidden'}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-900 leading-snug truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {item.content || '(Tanpa sub-keterangan)'}
                  </p>
                </div>
                <div className="flex items-center justify-end space-x-2 pt-3 border-t">
                  <button
                    onClick={() => openFormModal(item)}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100"
                  >
                    Edit Slide
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-50 border rounded-lg hover:bg-slate-100"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-900">
                {selectedId ? 'Edit Banner Slide' : 'Tambah Banner Slide Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Slide Title */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Judul Slide (Teks Utama)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pusat Riset IT Terakreditasi Nasional"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Sub-content/Caption */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Sub-Keterangan (Caption Banner)</label>
                <textarea
                  rows={2}
                  placeholder="Keterangan pendukung singkat yang tampil di bawah judul utama..."
                  value={form.content}
                  onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none text-sm"
                />
              </div>

              {/* Banner Image upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Gambar Slide (Rasio Lanskap)</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    required
                    placeholder="URL gambar atau klik unggah"
                    value={form.image_url}
                    onChange={(e) => setForm(prev => ({ ...prev, image_url: e.target.value }))}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none text-sm"
                  />
                  <div className="relative shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      id="slide-upload"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="slide-upload"
                      className="inline-flex items-center px-4 py-2.5 border rounded-xl text-xs font-bold cursor-pointer bg-white hover:bg-slate-50"
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </label>
                  </div>
                </div>
                {form.image_url && (
                  <div className="mt-2 h-28 bg-slate-100 rounded-lg overflow-hidden border">
                    <img
                      src={form.image_url.startsWith('http') ? form.image_url : `http://localhost:8080${form.image_url}`}
                      alt="Review"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Status Aktif</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none text-sm cursor-pointer"
                >
                  <option value="published">Aktif / Tampilkan di Home</option>
                  <option value="draft">Sembunyikan / Simpan sebagai Draft</option>
                </select>
              </div>

              {/* Footer buttons */}
              <div className="pt-4 border-t flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-500 hover:bg-slate-50 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 text-xs font-bold shadow"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
