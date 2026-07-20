'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle, XCircle, Clock, AlertTriangle, 
  ExternalLink, Eye, ChevronDown, Check, X, AlertCircle, MessageSquare 
} from 'lucide-react';
import pklService from '../../services/pkl';
import { PKLSubmission } from '../../types';

export default function AdminPklPage() {
  const [submissions, setSubmissions] = useState<PKLSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<PKLSubmission | null>(null);
  
  // Status edit form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [notes, setNotes] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pklService.listSubmissions();
      // Sort: newest first
      setSubmissions(data ? [...data].reverse() : []);
    } catch (err) {
      setError('Gagal memuat berkas pendaftaran PKL/Magang.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const openReviewModal = (sub: PKLSubmission) => {
    setError(null);
    setSuccess(null);
    setSelectedSubmission(sub);
    setStatus(sub.status);
    setNotes(sub.notes || '');
    setIsModalOpen(true);
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await pklService.updateStatus(selectedSubmission.id, { status, notes });
      setSuccess(`Status pendaftaran ${selectedSubmission.student_name} berhasil diperbarui.`);
      setIsModalOpen(false);
      loadSubmissions();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memperbarui status pengajuan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Kelola Pengajuan PKL / Magang</h1>
          <p className="text-sm text-slate-500">Tinjau berkas CV mahasiswa, setujui atau tolak pengajuan PKL, dan berikan catatan/feedback.</p>
        </div>
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
          <div className="p-12 text-center text-slate-400">Loading pengajuan PKL...</div>
        ) : submissions.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <FileText className="mx-auto w-12 h-12 mb-3 text-slate-300" />
            <span>Belum ada pengajuan PKL yang didaftarkan.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b text-xs uppercase tracking-wider">
                  <th className="px-6 py-4">Nama Mahasiswa</th>
                  <th className="px-6 py-4">Universitas & Jurusan</th>
                  <th className="px-6 py-4">Periode Magang</th>
                  <th className="px-6 py-4">Kontak</th>
                  <th className="px-6 py-4">CV</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {item.student_name}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className="font-semibold text-slate-700 block">{item.university}</span>
                      <span className="text-slate-400 block mt-0.5">{item.major}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-semibold">
                      {item.internship_period}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className="block text-slate-600 font-medium">{item.email}</span>
                      <span className="block text-slate-400 mt-0.5">{item.phone}</span>
                    </td>
                    <td className="px-6 py-4">
                      {item.cv_url ? (
                        <a
                          href={item.cv_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          Lihat CV
                          <ExternalLink className="w-3.5 h-3.5 ml-1" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.status === 'approved' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approved
                        </span>
                      ) : item.status === 'rejected' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="w-3 h-3 mr-1" />
                          Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-yellow-50 text-yellow-700 border border-yellow-200">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openReviewModal(item)}
                        className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal Form */}
      {isModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border shadow-2xl max-w-xl w-full overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-900">
                Review Pengajuan PKL Mahasiswa
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="p-6 space-y-6">
              {/* Submission info details */}
              <div className="bg-slate-50 p-5 rounded-2xl border space-y-3 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-bold text-slate-500">Nama Lengkap</span>
                  <span className="col-span-2 font-bold text-slate-900">: {selectedSubmission.student_name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-bold text-slate-500">Asal Kampus</span>
                  <span className="col-span-2 font-semibold text-slate-800">: {selectedSubmission.university}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-bold text-slate-500">Program Studi</span>
                  <span className="col-span-2 text-slate-700">: {selectedSubmission.major}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-bold text-slate-500">Periode Magang</span>
                  <span className="col-span-2 text-slate-700">: {selectedSubmission.internship_period}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-bold text-slate-500">Kontak Email</span>
                  <span className="col-span-2 text-slate-700">: {selectedSubmission.email}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-bold text-slate-500">WhatsApp / Telp</span>
                  <span className="col-span-2 text-slate-700">: {selectedSubmission.phone}</span>
                </div>
                {selectedSubmission.cv_url && (
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t mt-2">
                    <span className="font-bold text-slate-500">Resume / CV</span>
                    <span className="col-span-2">
                      : <a href={selectedSubmission.cv_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center font-bold text-blue-600 hover:underline">
                        Buka CV Dokumen
                        <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </a>
                    </span>
                  </div>
                )}
              </div>

              {/* Status input selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Keputusan Administrasi</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['pending', 'approved', 'rejected'] as const).map((s) => {
                    const isSelected = status === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(s)}
                        className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 ${
                          isSelected
                            ? s === 'approved'
                              ? 'bg-green-600 border-green-600 text-white shadow-md shadow-green-100'
                              : s === 'rejected'
                              ? 'bg-red-600 border-red-600 text-white shadow-md shadow-red-100'
                              : 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-100'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {s === 'approved' && <Check className="w-4 h-4" />}
                        {s === 'rejected' && <X className="w-4 h-4" />}
                        {s === 'pending' && <Clock className="w-4 h-4" />}
                        <span className="capitalize">{s}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes feedback input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Catatan / Tanggapan Admin</label>
                <textarea
                  rows={4}
                  placeholder="Contoh: Pengajuan disetujui. Silakan datang ke kantor BPTI pada tanggal 1 Agustus 2026 jam 09.00 WIB untuk briefing."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                  {submitting ? 'Menyimpan...' : 'Simpan Keputusan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
