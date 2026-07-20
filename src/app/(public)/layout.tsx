import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
