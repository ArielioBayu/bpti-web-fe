'use client';

import React, { useState, useEffect } from 'react';
import { FolderOpen, Upload, Copy, Check, FileText, Image as ImageIcon, Trash2, X, AlertCircle } from 'lucide-react';
import uploadService from '../../services/upload';

export default function AdminMediaLibraryPage() {
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bpti_uploaded_media');
    if (saved) {
      try {
        setMediaList(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveMediaList = (list: string[]) => {
    setMediaList(list);
    localStorage.setItem('bpti_uploaded_media', JSON.stringify(list));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const file = files[0];
      const uploadRes = await uploadService.upload(file);
      
      const newList = [uploadRes.file_url, ...mediaList];
      saveMediaList(newList);
      setSuccess('Media berhasil diunggah dan disimpan ke pustaka.');
    } catch (err) {
      console.error(err);
      setError('Gagal mengunggah media. Pastikan ukuran file tidak melebihi batas.');
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url: string, index: number) => {
    const fullUrl = url.startsWith('http') ? url : `http://localhost:8080${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const handleDelete = (indexToDelete: number) => {
    if (!confirm('Apakah Anda ingin menghapus berkas ini dari riwayat pustaka media lokal Anda? (Catatan: Berkas fisik di server backend tetap ada)')) return;
    const newList = mediaList.filter((_, idx) => idx !== indexToDelete);
    saveMediaList(newList);
    setSuccess('Riwayat media dihapus.');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Pustaka Media (Media Library)</h1>
          <p className="text-sm text-slate-500">Unggah foto, dokumen panduan, atau logo ke server dan salin tautan URL-nya untuk konten website.</p>
        </div>
        <div className="relative shrink-0">
          <input
            type="file"
            id="media-uploader"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
          <label
            htmlFor="media-uploader"
            className={`inline-flex items-center px-4 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow cursor-pointer ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload className="mr-1.5 w-4 h-4" />
            {uploading ? 'Mengunggah...' : 'Unggah File Baru'}
          </label>
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

      {/* Media Grid */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm space-y-6">
        {mediaList.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <FolderOpen className="mx-auto w-14 h-14 mb-4 text-slate-350" />
            <h3 className="font-bold text-slate-700">Pustaka Media Kosong</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
              Unggah file gambar atau dokumen magang Anda di atas untuk memulai mengisi riwayat berkas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {mediaList.map((url, idx) => {
              const isImage = /\.(jpg|jpeg|png|gif|webp|svg)/i.test(url);
              const fileName = url.split('/').pop() || 'file';
              const fullUrl = url.startsWith('http') ? url : `http://localhost:8080${url}`;
              
              return (
                <div
                  key={idx}
                  className="group relative bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  {/* File Preview */}
                  <div className="h-32 bg-slate-100 border-b flex items-center justify-center relative overflow-hidden shrink-0">
                    {isImage ? (
                      <img
                        src={fullUrl}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center space-y-1 text-slate-400">
                        <FileText className="w-10 h-10" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Document</span>
                      </div>
                    )}
                  </div>

                  {/* Metadata and Actions */}
                  <div className="p-3 space-y-3 flex-1 flex flex-col justify-between">
                    <p className="text-xs font-bold text-slate-700 truncate" title={fileName}>
                      {fileName}
                    </p>
                    
                    <div className="flex items-center justify-between gap-1 pt-1.5 border-t">
                      <button
                        onClick={() => handleCopy(url, idx)}
                        className={`flex items-center justify-center flex-1 py-1.5 rounded-lg border text-[10px] font-bold space-x-1 transition-colors ${
                          copiedIndex === idx
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : 'bg-white hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>Salin Link</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleDelete(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 bg-white border rounded-lg"
                        title="Delete from list"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
