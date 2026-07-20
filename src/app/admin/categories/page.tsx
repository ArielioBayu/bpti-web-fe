'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Tags, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import categoriesService from '../../services/categories';
import { Category } from '../../types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [name, setName] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoriesService.list();
      setCategories(data || []);
    } catch (err) {
      setError('Gagal memuat kategori.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openFormModal = (cat?: Category) => {
    setError(null);
    setSuccess(null);
    if (cat) {
      setSelectedId(cat.id);
      setName(cat.name);
    } else {
      setSelectedId(null);
      setName('');
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Nama kategori wajib diisi.');
      setSubmitting(false);
      return;
    }

    try {
      if (selectedId) {
        await categoriesService.update(selectedId, { name });
        setSuccess('Kategori berhasil diperbarui.');
      } else {
        await categoriesService.create({ name });
        setSuccess('Kategori baru berhasil ditambahkan.');
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan kategori.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin menghapus kategori ini? Berita di bawah kategori ini akan kehilangan relasinya.')) return;
    try {
      await categoriesService.delete(id);
      setSuccess('Kategori berhasil dihapus.');
      loadCategories();
    } catch (err) {
      setError('Gagal menghapus kategori.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Kelola Kategori Berita</h1>
          <p className="text-sm text-slate-500">Buat dan edit kategori klasifikasi berita untuk memfilter konten warta berita.</p>
        </div>
        <button
          onClick={() => openFormModal()}
          className="inline-flex items-center px-4 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow"
        >
          <Plus className="mr-1.5 w-4 h-4" />
          Tambah Kategori
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
          <div className="p-12 text-center text-slate-400">Loading list kategori...</div>
        ) : categories.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Tags className="mx-auto w-12 h-12 mb-3 text-slate-300" />
            <span>Belum ada kategori yang ditambahkan.</span>
          </div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b text-xs uppercase tracking-wider">
                <th className="px-6 py-4">Nama Kategori</th>
                <th className="px-6 py-4">Slug (URL)</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {cat.name}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs font-mono">
                    {cat.slug}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openFormModal(cat)}
                        className="p-1.5 text-slate-500 hover:text-amber-600 bg-slate-50 border rounded-lg"
                        title="Edit"
                      >
                        <Edit2 className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
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
          <div className="bg-white rounded-3xl border shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-900">
                {selectedId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Nama Kategori</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengumuman Kampus"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

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
                  {submitting ? 'Menyimpan...' : 'Simpan Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
