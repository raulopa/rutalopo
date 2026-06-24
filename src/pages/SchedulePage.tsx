import React, { useEffect, useState } from 'react';
import { adminService, RutaAdmin } from '../services/adminService';
import { useLanguage } from '../context/LanguageContext';
import { TopBanner } from '../components/TopBanner';
import { Link } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, Map, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { CurvedRoadmap } from '../components/CurvedRoadmap';
import { useToast } from '../context/ToastContext';

export default function SchedulePage() {
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [rutas, setRutas] = useState<RutaAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await adminService.getAllRutasAdmin();
        setRutas(data);
      } catch (err) {
        console.error(err);
        addToast('Error al cargar el cronograma', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }).format(d);
  };

  return (
    <div className="min-h-screen bg-brand-beige font-poppins selection:bg-brand-purple selection:text-white flex flex-col">
      <TopBanner />
      
      <header className="sticky top-0 z-40 bg-brand-beige/95 backdrop-blur-md border-b border-brand-purple/10 px-4 py-3 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-brand-purple hover:text-brand-ochre transition-colors font-bold text-sm">
            <ChevronLeft className="w-5 h-5" />
            {t.backBtn}
          </Link>
          <div className="font-black text-lg tracking-tight text-brand-purple flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-ochre" />
            {t.navSchedule}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 md:py-20">
        
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-purple tracking-tight">
            {t.scheduleTitle}
          </h1>
          <p className="text-slate-600 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            {t.scheduleSubtitle}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
          </div>
        ) : rutas.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-brand-purple/10 shadow-sm">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium text-lg">{t.noRoutesSched}</p>
          </div>
        ) : (
          <div className="w-full">
            <CurvedRoadmap rutas={rutas} />
          </div>
        )}
      </main>
    </div>
  );
}
