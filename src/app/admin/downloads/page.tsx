'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Download, Edit2, Trash2, X, AlertCircle, Upload, Link2, ExternalLink } from 'lucide-react';
import downloadsService from '../../services/downloads';
import uploadService from '../../services/upload';
import { Download as DownloadType } from '../../types';

export default function AdminDownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    category: 'Panduan' as 'Panduan' | 'Formulir' | 'SK' | 'Lainnya',
    file_url: '',
    description: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadDownloads = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await downloadsService.list();
      setDownloads(data || []);
    } catch (err) {
      setError('Gagal memuat berkas unduhan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDownloads();
  }, []);

  const openFormModal = (doc?: DownloadType) => {
    setError(null);
    setSuccess(null);
    if (doc) {
      setSelectedId(doc.id);
      setForm({
        title: doc.title,
        category: doc.category,
        file_url: doc.file_url,
        description: doc.description || '',
      });
    } else {
      setSelectedId(null);
      setForm({
        title: '',
        category: 'Panduan',
        file_url: '',
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!form.title || !form.file_url) {
      setError('Judul dokumen dan file unduhan wajib diisi.');
      setSubmitting(false);
      return;
    }

    try {
      if (selectedId) {
        await downloadsService.update(selectedId, form);
        setSuccess('Berkas unduhan berhasil diperbarui.');
      } else {
        await downloadsService.create(form);
        setSuccess('Berkas unduhan baru berhasil ditambahkan.');
      }
      setIsModalOpen(false);
      loadDownloads();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan berkas unduhan.');
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
      setForm(prev => ({ ...prev, file_url: uploadRes.file_url }));
      setSuccess('Berkas berhasil diunggah.');
    } catch (err) {
      setError('Gagal mengunggah berkas.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin menghapus berkas unduhan ini?')) return;
    try {
      await downloadsService.delete(id);
      setSuccess('Berkas unduhan berhasil dihapus.');
      loadDownloads();
    } catch (err) {
      setError('Gagal menghapus berkas unduhan.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Kelola File & Dokumen (Downloads)</h1>
          <p className="text-sm text-slate-500">Unggah dan daftarkan formulir, buku panduan magang, atau SK resmi BPTI agar bisa diunduh publik.</p>
        </div>
        <button
          onClick={() => openFormModal()}
          className="inline-flex items-center px-4 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow"
        >
          <Plus className="mr-1.5 w-4 h-4" />
          Unggah File Baru
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
          <div className="p-12 text-center text-slate-400">Loading list berkas...</div>
        ) : downloads.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Download className="mx-auto w-12 h-12 mb-3 text-slate-300" />
            <span>Belum ada berkas dokumen yang diunggah.</span>
          </div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b text-xs uppercase tracking-wider">
                <th className="px-6 py-4">Nama Berkas</th>
                <th className="px-6 py-4">Kategori Berkas</th>
                <th className="px-6 py-4">Deskripsi</th>
                <th className="px-6 py-4">Link File</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {downloads.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {item.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs max-w-xs truncate">
                    {item.description || '-'}
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-xs font-semibold">
                    <a
                      href={item.file_url.startsWith('http') ? item.file_url : `http://localhost:8080${item.file_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center hover:text-blue-600 hover:underline"
                    >
                      <Link2 className="w-3.5 h-3.5 mr-1" />
                      Unduh File
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
                {selectedId ? 'Edit File Panduan/SK' : 'Unggah File Panduan/SK Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Nama / Judul Dokumen</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Buku Panduan Magang BPTI"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Kategori Berkas</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
                >
                  <option value="Panduan">Panduan / Tutorial</option>
                  <option value="Formulir">Formulir Pendaftaran</option>
                  <option value="SK">SK Rektor / Dekan</option>
                  <option value="Lainnya">Dokumen Lainnya</option>
                </select>
              </div>

              {/* File URL and File picker */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Berkas Dokumen (PDF / Docs)</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    required
                    placeholder="URL berkas atau klik unggah"
                    value={form.file_url}
                    onChange={(e) => setForm(prev => ({ ...prev, file_url: e.target.value }))}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none text-sm"
                  />
                  <div className="relative shrink-0">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      id="doc-upload"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="doc-upload"
                      className="inline-flex items-center px-4 py-2.5 border rounded-xl text-xs font-bold cursor-pointer bg-white hover:bg-slate-50"
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Deskripsi Dokumen</label>
                <textarea
                  rows={3}
                  placeholder="Beri keterangan ringkas dokumen ini..."
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
                  {submitting ? 'Menyimpan...' : 'Simpan Berkas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
