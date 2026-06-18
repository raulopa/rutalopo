import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Map, Clock, Mountain, Settings, Navigation, Info, ExternalLink } from 'lucide-react';
import { RutaAdmin } from '../services/adminService';

interface CurvedRoadmapProps {
  rutas: RutaAdmin[];
}

export const CurvedRoadmap: React.FC<CurvedRoadmapProps> = ({ rutas }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress within the container for the central timeline fill
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (!rutas || rutas.length === 0) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }).format(d);
  };

  const getRouteIcon = (type: string | null) => {
    const t = (type || '').toLowerCase();
    if (t.includes('gravel') || t.includes('bici') || t.includes('bike')) return <Settings className="w-5 h-5" />;
    if (t.includes('montaña') || t.includes('mountain')) return <Mountain className="w-5 h-5" />;
    return <Navigation className="w-5 h-5" />;
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto py-20 px-4 sm:px-6" ref={containerRef}>
      
      {/* Central Base Line (The "Track") */}
      <div className="absolute left-8 md:left-1/2 top-20 bottom-20 w-2 md:w-3 bg-brand-purple/10 rounded-full transform md:-translate-x-1/2">
        {/* Animated Progress Line */}
        <motion.div 
          className="absolute top-0 left-0 w-full bg-brand-purple rounded-full shadow-[0_0_15px_rgba(74,20,140,0.5)] origin-top"
          style={{ scaleY: smoothProgress }}
        />
      </div>

      <div className="space-y-24 md:space-y-32 relative z-10">
        {rutas.map((ruta, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div 
              key={ruta.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              className={`flex flex-col md:flex-row items-center w-full ${isEven ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Half screen spacer for desktop */}
              <div className="hidden md:block w-1/2" />

              {/* Central Node */}
              <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 flex justify-center items-center">
                <motion.div 
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-brand-beige border-4 border-brand-purple shadow-xl flex items-center justify-center text-brand-purple z-20"
                >
                  {getRouteIcon(ruta.tipo_ruta)}
                </motion.div>
                {/* Decorative curve connector simulating the S-shape path behind */}
                <div className={`hidden md:block absolute top-1/2 w-32 h-32 border-dashed border-2 border-brand-purple/30 rounded-[100px] -z-10 opacity-50 ${isEven ? 'left-8 rounded-l-none border-l-0' : 'right-8 rounded-r-none border-r-0'}`} />
              </div>

              {/* Content Card */}
              <div className={`w-full md:w-1/2 pl-24 md:pl-0 ${isEven ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl border border-brand-purple/5 hover:border-brand-purple/20 transition-colors group relative overflow-hidden">
                  
                  {/* Subtle background glow */}
                  <div className="absolute -right-20 -top-20 w-40 h-40 bg-brand-ochre/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-ochre/10 transition-colors" />

                  <span className="inline-block px-3 py-1 bg-brand-purple/5 text-brand-purple text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                    Etapa {index + 1}
                  </span>

                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 leading-tight group-hover:text-brand-purple transition-colors">
                    {ruta.nombre}
                  </h3>
                  
                  <div className={`flex flex-wrap gap-4 mb-6 font-mono text-sm text-slate-500 font-bold ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                    <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                      <Clock className="w-4 h-4 text-brand-ochre" />
                      {ruta.hora || '--:--'}
                    </span>
                    <span className="flex items-center gap-1.5 capitalize bg-slate-50 px-2 py-1 rounded-md">
                      {formatDate(ruta.fecha)}
                    </span>
                    <span className="flex items-center gap-1.5 bg-brand-ochre/10 text-brand-ochre px-2 py-1 rounded-md uppercase tracking-wider">
                      {ruta.tipo_ruta || 'Ruta'}
                    </span>
                  </div>

                  <div className={`grid grid-cols-2 gap-4 mb-6 ${isEven ? 'md:text-right' : 'text-left'}`}>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Distancia</p>
                      <p className="font-extrabold text-brand-purple text-lg flex items-center gap-2 justify-start md:justify-start">
                        <Map className="w-4 h-4 opacity-50" />
                        {ruta.distancia_km || '0'} <span className="text-xs">km</span>
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Desnivel</p>
                      <p className="font-extrabold text-brand-purple text-lg flex items-center gap-2 justify-start md:justify-start">
                        <Mountain className="w-4 h-4 opacity-50" />
                        +{ruta.desnivel_positivo || '0'} <span className="text-xs">m</span>
                      </p>
                    </div>
                  </div>

                  {ruta.notas && (
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 text-left">
                      <Info className="w-5 h-5 text-brand-ochre shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-700 font-medium leading-relaxed">
                        {ruta.notas}
                      </p>
                    </div>
                  )}

                  {ruta.wikiloc_url && (
                    <div className={`mt-6 pt-6 border-t border-slate-100 flex ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                      <a 
                        href={ruta.wikiloc_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-brand-purple hover:text-brand-ochre transition-colors"
                      >
                        Ver en Wikiloc
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
