import { BookOpen, Award, CheckCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <span className="w-6 h-6 rounded bg-amber-500 text-[#0F2C59] flex items-center justify-center font-black text-xs">
              F
            </span>
            <span>FASTEF Fiches Pédagogiques</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Programme officiel Sénégal
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Classes de 4ème & 3ème
            </span>
            <span className="text-slate-400">Maths & Physique-Chimie</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Plateforme FASTEF Fiches Sénégal. Tous droits réservés.</p>
          <p>Format standard FASTEF officiel — Document Word (.docx) & PDF</p>
        </div>
      </div>
    </footer>
  );
}
