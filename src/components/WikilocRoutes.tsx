import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Map, MapPin, Calendar as CalendarIcon, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RutaAdmin } from '../services/adminService';
import { RoadmapTimeline } from './RoadmapTimeline';
import { useToast } from '../context/ToastContext';

export const WikilocRoutes = () => {
  const [rutas, setRutas] = useState<RutaAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchRutas = async () => {
      try {
        if (!supabase) return;
        const { data, error } = await supabase
          .from('rutas')
          .select('*')
          .order('fecha', { ascending: true })
          .order('hora', { ascending: true });

        if (error) throw error;
        setRutas(data || []);
      } catch (err) {
        console.error("Error fetching routes:", err);
        addToast("Error al cargar las rutas de Wikiloc", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchRutas();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 animate-pulse">
        <div className="flex gap-4 mb-8 border-b border-gray-200 pb-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-14 bg-gray-200 rounded-xl w-full mt-6"></div>
          </div>
          <div className="lg:col-span-8">
            <div className="h-[350px] md:h-[450px] bg-gray-200 rounded-2xl w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (rutas.length === 0) return null;

  const ruta = rutas[activeTab];

  // Helper formatting
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' }).format(date);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 font-poppins">
      {/* ROADMAP TIMELINE (Replaces standard carousel) */}
      <div className="mb-12">
        <RoadmapTimeline 
          rutas={rutas} 
          activeRouteIndex={activeTab} 
          onSelectRoute={(index) => setActiveTab(index)} 
        />
      </div>

      {/* Contenedor de la Ruta */}
      <AnimatePresence mode="wait">
        <motion.div
          key={ruta.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
        >
          {/* Columna Izquierda: Ficha Técnica */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="mb-6 flex justify-between items-start gap-4">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4 ${ruta.tipo_ruta?.toLowerCase().includes('gravel')
                    ? 'bg-brand-ochre/20 text-brand-ochre'
                    : 'bg-brand-dark-purple/10 text-brand-dark-purple'
                  }`}>
                  {ruta.tipo_ruta || 'Ruta'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                  {ruta.nombre}
                </h2>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <button 
                  onClick={() => setActiveTab(prev => Math.max(0, prev - 1))}
                  disabled={activeTab === 0}
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-brand-purple hover:text-white hover:border-brand-purple transition-all disabled:opacity-50 disabled:pointer-events-none shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setActiveTab(prev => Math.min(rutas.length - 1, prev + 1))}
                  disabled={activeTab === rutas.length - 1}
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-brand-purple hover:text-white hover:border-brand-purple transition-all disabled:opacity-50 disabled:pointer-events-none shadow-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 mb-8">
              {/* Distancia */}
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-brand-dark-purple">
                  <Map className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Distancia</p>
                  <p className="text-xl font-black text-slate-800">{ruta.distancia_km || '0'} <span className="text-sm font-semibold text-slate-500">km</span></p>
                </div>
              </div>

              {/* Desnivel */}
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-brand-dark-purple">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Desnivel</p>
                  <p className="text-xl font-black text-slate-800">+{ruta.desnivel_positivo || '0'} <span className="text-sm font-semibold text-slate-500">m</span></p>
                </div>
              </div>

              {/* Fecha */}
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-brand-dark-purple">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha</p>
                  <p className="text-lg font-bold text-slate-800">{formatDate(ruta.fecha)}</p>
                </div>
              </div>
            </div>

            {ruta.wikiloc_url && (
              <a
                href={ruta.wikiloc_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full bg-slate-900 hover:bg-brand-dark-purple text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-brand-dark-purple/30"
              >
                Ver track completo en Wikiloc
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </div>

          {/* Columna Derecha: Preview del Mapa */}
          <div className="lg:col-span-7">
            {ruta.wikiloc_id ? (
              <div className="relative w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50 bg-white border border-slate-100">
                <iframe
                  className="absolute inset-0 w-full h-full border-0"
                  src={`https://es.wikiloc.com/wikiloc/spatialArtifacts.do?event=view&id=${ruta.wikiloc_id}&measures=off&title=off&near=off&images=off&maptype=H`}
                  title={`Mapa de ${ruta.nombre}`}
                  allowFullScreen
                  scrolling="no"
                ></iframe>
              </div>
            ) : (
              <div className="w-full h-[350px] md:h-[450px] rounded-2xl bg-slate-100 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200">
                <Map className="w-12 h-12 mb-4 opacity-50" />
                <p className="font-medium">Mapa no disponible para esta ruta</p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
