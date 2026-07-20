'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Users, Edit2, Trash2, X, AlertCircle, Upload } from 'lucide-react';
import teamService from '../../services/team';
import uploadService from '../../services/upload';
import { TeamMember } from '../../types';

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    position: '',
    division: 'Pimpinan' as 'Pimpinan' | 'Pengembangan Sistem' | 'Keamanan' | 'Infrastruktur' | 'Magang',
    photo_url: '',
    order_index: 0,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadTeam = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await teamService.list();
      setTeam(data || []);
    } catch (err) {
      setError('Gagal memuat direktori anggota tim.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const openFormModal = (member?: TeamMember) => {
    setError(null);
    setSuccess(null);
    if (member) {
      setSelectedId(member.id);
      setForm({
        name: member.name,
        position: member.position,
        division: member.division,
        photo_url: member.photo_url || '',
        order_index: member.order_index || 0,
      });
    } else {
      setSelectedId(null);
      setForm({
        name: '',
        position: '',
        division: 'Pimpinan',
        photo_url: '',
        order_index: team.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!form.name || !form.position || !form.division) {
      setError('Nama, jabatan, dan divisi wajib diisi.');
      setSubmitting(false);
      return;
    }

    const payload = {
      ...form,
      order_index: Number(form.order_index) || 0,
    };

    try {
      if (selectedId) {
        await teamService.update(selectedId, payload);
        setSuccess('Data anggota tim berhasil diperbarui.');
      } else {
        await teamService.create(payload);
        setSuccess('Data anggota tim baru berhasil ditambahkan.');
      }
      setIsModalOpen(false);
      loadTeam();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan data anggota tim.');
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
      setForm(prev => ({ ...prev, photo_url: uploadRes.file_url }));
      setSuccess('Foto berhasil diunggah.');
    } catch (err) {
      setError('Gagal mengunggah foto.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin menghapus anggota tim ini?')) return;
    try {
      await teamService.delete(id);
      setSuccess('Anggota tim berhasil dihapus.');
      loadTeam();
    } catch (err) {
      setError('Gagal menghapus anggota tim.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Kelola Direktori Anggota Tim BPTI</h1>
          <p className="text-sm text-slate-500">Daftarkan nama, jabatan, divisi, dan urutan staf BPTI UHAMKA yang ditampilkan di landing page.</p>
        </div>
        <button
          onClick={() => openFormModal()}
          className="inline-flex items-center px-4 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow"
        >
          <Plus className="mr-1.5 w-4 h-4" />
          Tambah Anggota Tim
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
          <div className="p-12 text-center text-slate-400">Loading list anggota tim...</div>
        ) : team.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Users className="mx-auto w-12 h-12 mb-3 text-slate-300" />
            <span>Belum ada data anggota tim yang didaftarkan.</span>
          </div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b text-xs uppercase tracking-wider">
                <th className="px-6 py-4">Foto / Nama</th>
                <th className="px-6 py-4">Jabatan</th>
                <th className="px-6 py-4">Divisi</th>
                <th className="px-6 py-4">Urutan Tampilan</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {team.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border bg-slate-50 flex items-center justify-center p-0.5">
                        {item.photo_url ? (
                          <img
                            src={item.photo_url.startsWith('http') ? item.photo_url : `http://localhost:8080${item.photo_url}`}
                            alt=""
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60';
                            }}
                          />
                        ) : (
                          <Users className="text-slate-450 w-5 h-5" />
                        )}
                      </div>
                      <span className="font-bold text-slate-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-xs font-semibold">
                    {item.position}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {item.division}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs font-bold pl-12">
                    {item.order_index}
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
                {selectedId ? 'Edit Anggota Tim' : 'Registrasi Anggota Tim Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Rahardjo, M.Kom."
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Jabatan / Posisi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kepala BPTI"
                    value={form.position}
                    onChange={(e) => setForm(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Division */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Divisi Kerja</label>
                  <select
                    value={form.division}
                    onChange={(e) => setForm(prev => ({ ...prev, division: e.target.value as any }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
                  >
                    <option value="Pimpinan">Pimpinan</option>
                    <option value="Pengembangan Sistem">Pengembangan Sistem</option>
                    <option value="Keamanan">Keamanan</option>
                    <option value="Infrastruktur">Infrastruktur</option>
                    <option value="Magang">Magang / PKL</option>
                  </select>
                </div>

                {/* Order Index */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Urutan Tampilan (Display Order)</label>
                  <input
                    type="number"
                    required
                    value={form.order_index}
                    onChange={(e) => setForm(prev => ({ ...prev, order_index: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Photo URL & Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Foto Profil</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="URL file foto profil"
                    value={form.photo_url}
                    onChange={(e) => setForm(prev => ({ ...prev, photo_url: e.target.value }))}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none text-sm"
                  />
                  <div className="relative shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      id="photo-upload"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="photo-upload"
                      className="inline-flex items-center px-4 py-2.5 border rounded-xl text-xs font-bold cursor-pointer bg-white hover:bg-slate-50"
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </label>
                  </div>
                </div>
                {form.photo_url && (
                  <div className="mt-2 w-20 h-20 bg-slate-100 rounded-full overflow-hidden border flex items-center justify-center p-0.5">
                    <img
                      src={form.photo_url.startsWith('http') ? form.photo_url : `http://localhost:8080${form.photo_url}`}
                      alt="Review"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                )}
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
                  {submitting ? 'Menyimpan...' : 'Simpan Anggota'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
