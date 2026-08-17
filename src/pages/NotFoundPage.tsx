import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { AlertTriangle, Home } from 'lucide-react';
import { TopBanner } from '../components/TopBanner';

export default function NotFoundPage() {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = "404 - " + (t?.homeTitle || "La Rutalopó");
  }, [t]);

  return (
    <div className="min-h-screen bg-brand-beige text-slate-800 flex flex-col selection:bg-brand-purple selection:text-white">
      <TopBanner />
      
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 sm:p-12 shadow-2xl max-w-lg w-full text-center space-y-6">
          <div className="flex justify-center">
            <AlertTriangle className="w-24 h-24 text-brand-ochre animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-purple tracking-tight">
            404
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            Página no encontrada / Pàgina no trobada
          </p>
          <div className="pt-4">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 bg-brand-purple hover:bg-brand-purple-hover text-brand-beige px-6 py-3 rounded-xl font-bold transition-all shadow-md"
            >
              <Home className="w-5 h-5" />
              Volver al Inicio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
