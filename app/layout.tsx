import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'FASTEF Fiches | Générateur de Fiches Pédagogiques pour Collège (Sénégal)',
  description:
    'SaaS de préparation et génération de fiches de cours conformes au gabarit officiel FASTEF pour enseignants de Mathématiques et Physique-Chimie (4ème & 3ème) au Sénégal.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-amber-100 selection:text-amber-900">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
