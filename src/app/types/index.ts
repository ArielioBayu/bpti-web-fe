export interface User {
  id: number;
  username: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

export interface News {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  category_id: number | null;
  category_name?: string;
  author_id: number | null;
  author_name?: string;
  view_count: number;
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface NewsListResponse {
  data: News[];
  total: number;
  page: number;
  limit: number;
  sort: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  logo_url: string;
  category: 'Mahasiswa' | 'Dosen' | 'Tendik' | 'Umum';
  app_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface Download {
  id: number;
  title: string;
  category: 'Panduan' | 'Formulir' | 'SK' | 'Lainnya';
  file_url: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  division: 'Pimpinan' | 'Pengembangan Sistem' | 'Keamanan' | 'Infrastruktur' | 'Magang';
  photo_url: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  quote: string;
  avatar_url: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  created_at?: string;
  updated_at?: string;
}

export interface APIErrorResponse {
  message: string;
}
