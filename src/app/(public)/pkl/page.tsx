'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Send, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import pklService from '../../services/pkl';

export default function PklRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    student_name: '',
    university: '',
    major: '',
    internship_period: '',
    email: '',
    phone: '',
    cv_url: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simple Validation
    if (
      !formData.student_name ||
      !formData.university ||
      !formData.major ||
      !formData.internship_period ||
      !formData.email ||
      !formData.phone
    ) {
      setError('Harap lengkapi semua field yang berbintang (*).');
      setLoading(false);
      return;
    }

    try {
      await pklService.register(formData);
      setSuccess(true);
      setFormData({
        student_name: '',
        university: '',
        major: '',
        internship_period: '',
        email: '',
        phone: '',
        cv_url: '',
      });
    } catch (err: any) {
      console.error('Failed to submit PKL registration:', err);
      setError(
        err.response?.data?.message ||
          'Terjadi kesalahan saat mengirim pendaftaran. Harap coba lagi.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Page Title */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600">
          <FileText className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900">
          Registrasi PKL / Magang BPTI
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Silakan lengkapi formulir pendaftaran di bawah ini untuk mengajukan kegiatan Praktik Kerja Lapangan (PKL) atau Magang di BPTI UHAMKA.
        </p>
      </div>

      {success ? (
        <div className="bg-white border border-green-200 rounded-3xl p-8 md:p-12 text-center shadow-lg space-y-6">
          <div className="inline-flex p-4 rounded-full bg-green-50 text-green-500">
            <CheckCircle2 className="w-16 h-16" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900">Pendaftaran Berhasil!</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
              Berkas pengajuan PKL Anda telah masuk ke sistem kami. Tim BPTI akan meninjau kualifikasi Anda dan menghubungi melalui email atau WhatsApp yang terdaftar.
            </p>
          </div>
          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-3 font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-colors"
            >
              Kirim Pengajuan Baru
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 font-bold text-slate-700 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 border border-slate-200/50 p-8 md:p-12 rounded-[2rem] shadow-xl space-y-8"
        >
          {error && (
            <div className="flex items-center space-x-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Name */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Nama Lengkap Mahasiswa <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="student_name"
                required
                placeholder="Masukkan nama lengkap Anda"
                value={formData.student_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* University */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Asal Kampus / Sekolah <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="university"
                required
                placeholder="Contoh: UHAMKA"
                value={formData.university}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Major */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Program Studi / Jurusan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="major"
                required
                placeholder="Contoh: Teknik Informatika"
                value={formData.major}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Internship Period */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Periode / Durasi Magang <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="internship_period"
                required
                placeholder="Contoh: Juli - September 2026"
                value={formData.internship_period}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Email Aktif <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="Contoh: nama@domain.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                No. WhatsApp / Telepon <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="phone"
                required
                placeholder="Contoh: 081234567890"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* CV URL */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              Link Dokumen CV / Resume (PDF)
            </label>
            <input
              type="url"
              name="cv_url"
              placeholder="Contoh: https://drive.google.com/file/d/.../view?usp=sharing"
              value={formData.cv_url}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <div className="flex items-start space-x-2 text-xs text-slate-500 mt-2 p-3 bg-slate-50 rounded-xl border">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>
                Unggah berkas CV Anda terlebih dahulu di Google Drive, Dropbox, atau layanan cloud lainnya, pastikan link diatur ke <strong>"Siapa saja yang memiliki link dapat melihat/mengakses"</strong>, lalu tempel tautannya di atas.
              </span>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-6 py-4 font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-blue-500/20 hover:scale-[1.01]"
            >
              {loading ? (
                <span>Memproses pendaftaran...</span>
              ) : (
                <>
                  Kirim Pengajuan PKL
                  <Send className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
