'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Layers, Edit2, Trash2, X, AlertCircle, Upload, Link2, ExternalLink } from 'lucide-react';
import productsService from '../../services/products';
import uploadService from '../../services/upload';
import { Product } from '../../types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Form fields
  const [form, setForm] = useState({
    name: '',
    description: '',
    logo_url: '',
    category: 'Mahasiswa' as 'Mahasiswa' | 'Dosen' | 'Tendik' | 'Umum',
    app_url: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsService.list();
      setProducts(data || []);
    } catch (err) {
      setError('Gagal memuat daftar aplikasi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openFormModal = (prod?: Product) => {
    setError(null);
    setSuccess(null);
    if (prod) {
      setSelectedId(prod.id);
      setForm({
        name: prod.name,
        description: prod.description || '',
        logo_url: prod.logo_url || '',
        category: prod.category,
        app_url: prod.app_url || '',
      });
    } else {
      setSelectedId(null);
      setForm({
        name: '',
        description: '',
        logo_url: '',
        category: 'Mahasiswa',
        app_url: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!form.name || !form.category || !form.app_url) {
      setError('Nama aplikasi, kategori target user, dan link aplikasi wajib diisi.');
      setSubmitting(false);
      return;
    }

    try {
      if (selectedId) {
        await productsService.update(selectedId, form);
        setSuccess('Aplikasi berhasil diperbarui.');
      } else {
        await productsService.create(form);
        setSuccess('Aplikasi baru berhasil ditambahkan.');
      }
      setIsModalOpen(false);
      loadProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan aplikasi.');
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
      setForm(prev => ({ ...prev, logo_url: uploadRes.file_url }));
      setSuccess('Logo berhasil diunggah.');
    } catch (err) {
      setError('Gagal mengunggah logo.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin menghapus aplikasi ini dari portal?')) return;
    try {
      await productsService.delete(id);
      setSuccess('Aplikasi berhasil dihapus.');
      loadProducts();
    } catch (err) {
      setError('Gagal menghapus aplikasi.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Kelola Aplikasi & Proyek BPTI</h1>
          <p className="text-sm text-slate-500">Daftarkan aplikasi internal kampus UHAMKA agar dapat diakses civitas akademika di halaman publik.</p>
        </div>
        <button
          onClick={() => openFormModal()}
          className="inline-flex items-center px-4 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow"
        >
          <Plus className="mr-1.5 w-4 h-4" />
          Registrasi Aplikasi Baru
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

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading list aplikasi...</div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Layers className="mx-auto w-12 h-12 mb-3 text-slate-300" />
            <span>Belum ada aplikasi yang didaftarkan.</span>
          </div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b text-xs uppercase tracking-wider">
                <th className="px-6 py-4">Aplikasi</th>
                <th className="px-6 py-4">Deskripsi</th>
                <th className="px-6 py-4">Target User</th>
                <th className="px-6 py-4">URL Link</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-lg overflow-hidden border flex items-center justify-center p-1.5 shadow-inner">
                        {item.logo_url ? (
                          <img
                            src={item.logo_url.startsWith('http') ? item.logo_url : `http://localhost:8080${item.logo_url}`}
                            alt=""
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60';
                            }}
                          />
                        ) : (
                          <Layers className="text-slate-400 w-5 h-5" />
                        )}
                      </div>
                      <span className="font-bold text-slate-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs max-w-xs truncate">
                    {item.description || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-xs font-semibold">
                    <a
                      href={item.app_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center hover:text-blue-600 hover:underline"
                    >
                      <Link2 className="w-3.5 h-3.5 mr-1" />
                      Link App
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openFormModal(item)}
                        className="p-1.5 text-slate-500 hover:text-amber-600 bg-slate-50 border rounded-lg"
                        title="Edit"
                      >
                        <Edit2 className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 bg-slate-50 border rounded-lg"
                        title="Hapus"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-900">
                {selectedId ? 'Edit Registrasi Aplikasi' : 'Daftarkan Aplikasi Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Nama Aplikasi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SILA UHAMKA"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Target User</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
                  >
                    <option value="Mahasiswa">Mahasiswa</option>
                    <option value="Dosen">Dosen</option>
                    <option value="Tendik">Tendik</option>
                    <option value="Umum">Umum / Publik</option>
                  </select>
                </div>
              </div>

              {/* App URL Link */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Link Tautan Aplikasi (URL)</label>
                <input
                  type="url"
                  required
                  placeholder="https://sila.uhamka.ac.id"
                  value={form.app_url}
                  onChange={(e) => setForm(prev => ({ ...prev, app_url: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Logo URL / File upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Logo Aplikasi</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="URL file logo"
                    value={form.logo_url}
                    onChange={(e) => setForm(prev => ({ ...prev, logo_url: e.target.value }))}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none text-sm"
                  />
                  <div className="relative shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      id="logo-upload"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="logo-upload"
                      className="inline-flex items-center px-4 py-2.5 border rounded-xl text-xs font-bold cursor-pointer bg-white hover:bg-slate-50"
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Deskripsi Aplikasi</label>
                <textarea
                  rows={3}
                  placeholder="Masukkan kegunaan singkat aplikasi ini bagi civitas akademika..."
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none text-sm"
                />
              </div>

              {/* Modal footer */}
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
                  {submitting ? 'Menyimpan...' : 'Simpan Aplikasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
