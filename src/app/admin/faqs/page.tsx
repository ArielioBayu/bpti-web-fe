'use client';

import React, { useState, useEffect } from 'react';
import { Plus, HelpCircle, MessageSquare, Edit2, Trash2, X, AlertCircle, Upload, Users } from 'lucide-react';
import faqsService from '../../services/faqs';
import testimonialsService from '../../services/testimonials';
import uploadService from '../../services/upload';
import { FAQ, Testimonial } from '../../types';

export default function AdminFaqTestimonialsPage() {
  const [activeTab, setActiveTab] = useState<'faq' | 'testimonial'>('faq');

  // Lists
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
  // Loaders
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // FAQ Form State
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
  });

  // Testimonial Form State
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    quote: '',
    avatar_url: '',
    role: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'faq') {
        const data = await faqsService.list();
        setFaqs(data || []);
      } else {
        const data = await testimonialsService.list();
        setTestimonials(data || []);
      }
    } catch (err) {
      setError('Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const openFormModal = (item?: FAQ | Testimonial) => {
    setError(null);
    setSuccess(null);
    if (activeTab === 'faq') {
      const faq = item as FAQ | undefined;
      if (faq) {
        setSelectedId(faq.id);
        setFaqForm({ question: faq.question, answer: faq.answer });
      } else {
        setSelectedId(null);
        setFaqForm({ question: '', answer: '' });
      }
    } else {
      const testimonial = item as Testimonial | undefined;
      if (testimonial) {
        setSelectedId(testimonial.id);
        setTestimonialForm({
          name: testimonial.name,
          quote: testimonial.quote,
          avatar_url: testimonial.avatar_url || '',
          role: testimonial.role || '',
        });
      } else {
        setSelectedId(null);
        setTestimonialForm({
          name: '',
          quote: '',
          avatar_url: '',
          role: '',
        });
      }
    }
    setIsModalOpen(true);
  };

  const handleFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!faqForm.question || !faqForm.answer) {
      setError('Pertanyaan dan jawaban wajib diisi.');
      setSubmitting(false);
      return;
    }

    try {
      if (selectedId) {
        await faqsService.update(selectedId, faqForm);
        setSuccess('FAQ berhasil diperbarui.');
      } else {
        await faqsService.create(faqForm);
        setSuccess('FAQ baru berhasil ditambahkan.');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan FAQ.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!testimonialForm.name || !testimonialForm.quote) {
      setError('Nama pengulas dan ulasan/quote wajib diisi.');
      setSubmitting(false);
      return;
    }

    try {
      if (selectedId) {
        await testimonialsService.update(selectedId, testimonialForm);
        setSuccess('Testimonial berhasil diperbarui.');
      } else {
        await testimonialsService.create(testimonialForm);
        setSuccess('Testimonial baru berhasil ditambahkan.');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan testimonial.');
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
      setTestimonialForm(prev => ({ ...prev, avatar_url: uploadRes.file_url }));
      setSuccess('Foto avatar berhasil diunggah.');
    } catch (err) {
      setError('Gagal mengunggah foto avatar.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin menghapus item ini?')) return;
    try {
      if (activeTab === 'faq') {
        await faqsService.delete(id);
        setSuccess('FAQ berhasil dihapus.');
      } else {
        await testimonialsService.delete(id);
        setSuccess('Testimonial berhasil dihapus.');
      }
      loadData();
    } catch (err) {
      setError('Gagal menghapus data.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Kelola FAQ & Testimonial</h1>
          <p className="text-sm text-slate-500">Kelola daftar Tanya Jawab (FAQ) serta kata alumni/testimonial civitas akademika.</p>
        </div>
        <button
          onClick={() => openFormModal()}
          className="inline-flex items-center px-4 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow"
        >
          <Plus className="mr-1.5 w-4 h-4" />
          {activeTab === 'faq' ? 'Tambah FAQ Baru' : 'Tambah Testimonial Baru'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'faq'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Tanya Jawab (FAQ)</span>
        </button>
        <button
          onClick={() => setActiveTab('testimonial')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'testimonial'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Kata Alumni & Testimonial</span>
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

      {/* Datatable */}
      <div className="bg-white rounded-3xl border border-slate-200/50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Memuat data...</div>
        ) : activeTab === 'faq' ? (
          /* FAQ Table */
          faqs.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              <HelpCircle className="mx-auto w-12 h-12 mb-3 text-slate-300" />
              <span>Belum ada data FAQ yang ditambahkan.</span>
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 w-1/3">Pertanyaan</th>
                  <th className="px-6 py-4">Jawaban</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs leading-relaxed max-w-sm truncate">
                      {faq.answer}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openFormModal(faq)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 bg-slate-50 border rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 bg-slate-50 border rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          /* Testimonial Table */
          testimonials.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              <MessageSquare className="mx-auto w-12 h-12 mb-3 text-slate-300" />
              <span>Belum ada ulasan/testimonial yang ditambahkan.</span>
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b text-xs uppercase tracking-wider">
                  <th className="px-6 py-4">Foto / Nama</th>
                  <th className="px-6 py-4">Posisi / Role</th>
                  <th className="px-6 py-4 w-1/2">Quote Testimonial</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {testimonials.map((test) => (
                  <tr key={test.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border bg-slate-50 flex items-center justify-center p-0.5">
                          {test.avatar_url ? (
                            <img
                              src={test.avatar_url.startsWith('http') ? test.avatar_url : `http://localhost:8080${test.avatar_url}`}
                              alt=""
                              className="w-full h-full object-cover rounded-full"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60';
                              }}
                            />
                          ) : (
                            <Users className="text-slate-400 w-5 h-5" />
                          )}
                        </div>
                        <span className="font-bold text-slate-900">{test.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs font-semibold">
                      {test.role}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs italic leading-relaxed max-w-sm truncate">
                      "{test.quote}"
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openFormModal(test)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 bg-slate-50 border rounded-lg"
                        >
                          <Edit2 className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(test.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 bg-slate-50 border rounded-lg"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-900">
                {activeTab === 'faq'
                  ? selectedId ? 'Edit FAQ' : 'Tambah FAQ Baru'
                  : selectedId ? 'Edit Testimonial' : 'Tambah Testimonial Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            {activeTab === 'faq' ? (
              /* FAQ FORM */
              <form onSubmit={handleFaqSubmit} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Pertanyaan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bagaimana cara reset password portal akademik?"
                    value={faqForm.question}
                    onChange={(e) => setFaqForm(prev => ({ ...prev, question: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Jawaban FAQ</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Masukkan penjelasan jawaban singkat..."
                    value={faqForm.answer}
                    onChange={(e) => setFaqForm(prev => ({ ...prev, answer: e.target.value }))}
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
                    {submitting ? 'Menyimpan...' : 'Simpan FAQ'}
                  </button>
                </div>
              </form>
            ) : (
              /* TESTIMONIAL FORM */
              <form onSubmit={handleTestimonialSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Nama Pengulas</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Andi Wijaya"
                      value={testimonialForm.name}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none text-sm"
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Jabatan / Alumni</label>
                    <input
                      type="text"
                      placeholder="Contoh: Alumni Informatika 2022"
                      value={testimonialForm.role}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Avatar URL & File upload */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Avatar / Foto Pengulas</label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="URL avatar"
                      value={testimonialForm.avatar_url}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, avatar_url: e.target.value }))}
                      className="flex-1 px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none text-sm"
                    />
                    <div className="relative shrink-0">
                      <input
                        type="file"
                        accept="image/*"
                        id="avatar-upload"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="inline-flex items-center px-4 py-2.5 border rounded-xl text-xs font-bold cursor-pointer bg-white hover:bg-slate-50"
                      >
                        {uploading ? 'Uploading...' : 'Upload'}
                      </label>
                    </div>
                  </div>
                  {testimonialForm.avatar_url && (
                    <div className="mt-2 w-14 h-14 bg-slate-100 rounded-full overflow-hidden border flex items-center justify-center p-0.5">
                      <img
                        src={testimonialForm.avatar_url.startsWith('http') ? testimonialForm.avatar_url : `http://localhost:8080${testimonialForm.avatar_url}`}
                        alt="Review"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  )}
                </div>

                {/* Quote Quote */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Quote Testimonial</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Masukkan kutipan komentar/ulasan..."
                    value={testimonialForm.quote}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, quote: e.target.value }))}
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
                    {submitting ? 'Menyimpan...' : 'Simpan Testimonial'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
