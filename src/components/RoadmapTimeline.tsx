import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Mountain, Map, Settings } from 'lucide-react';
import { RutaAdmin } from '../services/adminService';

interface RoadmapTimelineProps {
  rutas: RutaAdmin[];
  activeRouteIndex: number;
  onSelectRoute: (index: number) => void;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ rutas, activeRouteIndex, onSelectRoute }) => {
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive check for Mobile layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint in Tailwind
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!rutas || rutas.length === 0) return null;

  // Helpers
  const formatShortDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' }).format(date).replace('.', '');
  };

  const getRouteIcon = (type: string | null) => {
    const t = (type || '').toLowerCase();
    if (t.includes('gravel') || t.includes('bici') || t.includes('bike')) {
      return <Settings className="w-4 h-4" />;
    }
    if (t.includes('montaña') || t.includes('mountain')) {
      return <Mountain className="w-4 h-4" />;
    }
    return <Map className="w-4 h-4" />;
  };

  // Calculate progress line percentage (0 to 100%)
  const progressPercentage = rutas.length > 1 ? (activeRouteIndex / (rutas.length - 1)) * 100 : 0;

  return (
    <div className="w-full py-12 px-4 mb-8 bg-brand-beige/50 rounded-3xl border border-brand-purple/10 overflow-hidden relative">
      <div className="max-w-6xl mx-auto relative" ref={containerRef}>

        {/* PROGRESS LINE */}
        {/* Desktop: Horizontal Line */}
        {!isMobile && (
          <div className="absolute top-[48px] left-8 right-8 h-[2px] bg-slate-200 z-0 rounded-full">
            <motion.div
              className="absolute top-0 left-0 h-full bg-brand-purple rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        )}

        {/* Mobile: Vertical Line */}
        {isMobile && (
          <div className="absolute top-8 bottom-8 left-[39px] w-[2px] bg-slate-200 z-0 rounded-full">
            <motion.div
              className="absolute top-0 left-0 w-full bg-brand-purple rounded-full"
              initial={{ height: 0 }}
              animate={{ height: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        )}

        {/* NODES CONTAINER */}
        <div className={`relative z-10 flex ${isMobile ? 'flex-col space-y-12' : 'flex-row justify-between'} items-stretch w-full`}>
          {rutas.map((ruta, idx) => {
            const isActive = idx === activeRouteIndex;
            const isPast = idx < activeRouteIndex;

            return (
              <div
                key={ruta.id}
                onClick={() => onSelectRoute(idx)}
                className={`group cursor-pointer flex ${isMobile ? 'flex-row items-center gap-6' : 'flex-col items-center flex-1'}`}
              >

                {/* TOP INFO (Desktop) / RIGHT INFO (Mobile) */}
                <div className={`${isMobile ? 'order-2 flex-1 pt-1' : 'order-1 mb-4'} text-center md:text-center w-full`}>
                  <p className={`font-poppins uppercase tracking-widest text-[10px] sm:text-xs mb-1 transition-colors ${isActive ? 'font-extrabold text-brand-purple' : 'font-bold text-slate-500 group-hover:text-slate-700'}`}>
                    {formatShortDate(ruta.fecha)}
                  </p>
                  <p className={`font-mono text-[10px] sm:text-xs transition-colors ${isActive ? 'font-bold text-slate-800' : 'font-medium text-slate-400'}`}>
                    {ruta.hora || '--:--'}
                  </p>
                </div>

                {/* NODE DOT */}
                <div className={`${isMobile ? 'order-1 w-20 flex justify-center' : 'order-2'} relative flex items-center justify-center`}>
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`w-5 h-5 rounded-full border-[3px] shadow-sm relative z-10 bg-brand-beige transition-colors duration-300 ${isActive
                        ? 'border-brand-purple bg-brand-purple'
                        : isPast
                          ? 'border-brand-purple'
                          : 'border-slate-300 group-hover:border-slate-400'
                      }`}
                  />

                  {/* Glowing ring for active state */}
                  {isActive && (
                    <motion.div
                      layoutId="activeRing"
                      className="absolute m-auto w-9 h-9 rounded-full border border-brand-purple/30 bg-brand-purple/10 pointer-events-none"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  )}
                </div>

                {/* BOTTOM INFO (Desktop) / RIGHT SUB-INFO (Mobile combined) */}
                <div className={`${isMobile ? 'order-3 hidden' : 'order-3 mt-5'} flex flex-col items-center max-w-[120px] text-center`}>
                  <div className={`mb-2 p-1.5 rounded-full transition-colors ${isActive ? 'bg-brand-purple/10 text-brand-purple' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                    {getRouteIcon(ruta.tipo_ruta)}
                  </div>
                  <h4 className={`font-poppins text-xs sm:text-sm line-clamp-2 transition-colors ${isActive ? 'font-extrabold text-slate-900' : 'font-semibold text-slate-500 group-hover:text-slate-800'}`}>
                    {ruta.nombre}
                  </h4>
                </div>

                {/* Extra layout info for Mobile to place icon and name beside the date */}
                {isMobile && (
                  <div className="order-3 flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`p-1 rounded-full transition-colors ${isActive ? 'bg-brand-purple/10 text-brand-purple' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                        {getRouteIcon(ruta.tipo_ruta)}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-brand-purple' : 'text-slate-400'}`}>
                        {ruta.tipo_ruta || 'Ruta'}
                      </span>
                    </div>
                    <h4 className={`font-poppins text-sm leading-tight transition-colors ${isActive ? 'font-extrabold text-slate-900' : 'font-semibold text-slate-500 group-hover:text-slate-800'}`}>
                      {ruta.nombre}
                    </h4>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
