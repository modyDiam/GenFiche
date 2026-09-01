'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BookOpen, User, LogOut, LayoutDashboard, Sparkles, ShieldCheck, CreditCard } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (err) {
        console.error('Erreur vérification session:', err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Erreur déconnexion:', err);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0F2C59] text-white border-b border-blue-900 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & Titre */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-[#0F2C59] font-black shadow-inner group-hover:bg-amber-400 transition-colors">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight">FASTEF</span>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-1.5 py-0.5 rounded border border-amber-500/30">
                Fiches 4e/3e
              </span>
            </div>
            <p className="text-[11px] text-blue-200 hidden sm:block font-medium">
              Générateur Pédagogique Officiel (Sénégal)
            </p>
          </div>
        </Link>

        {/* Navigation & Profil */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-24 bg-blue-800/50 animate-pulse rounded"></div>
          ) : user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium px-2.5 py-1.5 rounded-md transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-white/15 text-white'
                    : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Mon Espace</span>
              </Link>

              <Link
                href="/dashboard/nouvelle-fiche"
                className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-[#0F2C59] shadow-sm transition-colors`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ Nouvelle fiche</span>
              </Link>

              <Link
                href="/dashboard/abonnement"
                className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium px-2.5 py-1.5 rounded-md transition-colors ${
                  pathname === '/dashboard/abonnement'
                    ? 'bg-amber-400 text-[#0F2C59] font-bold'
                    : 'text-amber-300 hover:bg-white/10'
                }`}
              >
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>Abonnement</span>
              </Link>

              <Link
                href="/admin/programme"
                className={`hidden md:flex items-center gap-1.5 text-xs sm:text-sm font-medium px-2.5 py-1.5 rounded-md transition-colors ${
                  pathname === '/admin/programme'
                    ? 'bg-white/15 text-white'
                    : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                <span>Programme officiel</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs font-medium text-blue-200 hover:text-white bg-blue-900/60 hover:bg-blue-900 px-2.5 py-1.5 rounded-md border border-blue-800 transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={`text-xs sm:text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                  pathname === '/login'
                    ? 'bg-white/15 text-white'
                    : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="text-xs sm:text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-[#0F2C59] px-3.5 py-1.5 rounded-md shadow-sm transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Créer un compte</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
