import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "BPTI UHAMKA | Badan Pengembangan Teknologi Informasi",
  description: "Portal resmi Badan Pengembangan Teknologi Informasi Universitas Muhammadiyah Prof. DR. HAMKA. Menyediakan informasi aplikasi, berita kampus, tim, dan layanan pendaftaran PKL/magang.",
  icons: {
    icon: "/logo-uhamka.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
