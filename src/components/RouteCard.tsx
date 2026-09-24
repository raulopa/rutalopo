import React from 'react';
import { motion } from 'motion/react';
import { Compass } from 'lucide-react';
import { RouteSticker } from './RouteSticker';

interface RouteCardProps {
  title: string;
  date: string;
  code: string | null;
  imageUrl: string | null;
  isJustUnlocked: boolean;
  index: number;
  fallbackText: string;
  distancia?: number | null;
  desnivel?: number | null;
}

// Extraemos colores corporativos para el estilo
const BRAND_THEMES = [
  { gradient: 'linear-gradient(135deg, #FF6B6B 0%, #96031F 100%)', shadow: 'rgba(255,107,107,0.5)' },
  { gradient: 'linear-gradient(135deg, #FDBB2D 0%, #D4A373 100%)', shadow: 'rgba(253,187,45,0.5)' },
  { gradient: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)', shadow: 'rgba(67,233,123,0.5)' },
  { gradient: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)', shadow: 'rgba(250,112,154,0.5)' },
  { gradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)', shadow: 'rgba(79,172,254,0.5)' },
  { gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)', shadow: 'rgba(102,126,234,0.5)' },
  { gradient: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)', shadow: 'rgba(240,147,251,0.5)' },
  { gradient: 'linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%)', shadow: 'rgba(132,250,176,0.5)' },
];

export const RouteCard: React.FC<RouteCardProps> = ({
  title,
  date,
  code,
  imageUrl,
  isJustUnlocked,
  index,
  fallbackText,
  distancia,
  desnivel
}) => {
  // Hash for prefix to theme
  const prefix = code || title;
  let hash = 0;
  for (let i = 0; i < prefix.length; i++) {
    hash = prefix.charCodeAt(i) + ((hash << 5) - hash);
  }
  const themeIndex = Math.abs(hash) % BRAND_THEMES.length;
  const theme = BRAND_THEMES[themeIndex];

  return (
    <motion.div
      initial={isJustUnlocked ? { scale: 0.8, rotate: -5, opacity: 0 } : { opacity: 1, scale: 1, y: 0 }}
      animate={isJustUnlocked ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0], opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative w-full aspect-[3/4] cursor-pointer group"
      style={{
        filter: `drop-shadow(0 15px 30px rgba(0,0,0,0.1))`,
      }}
    >
      {/* Contenedor con la máscara de Ticket (mordiscos en el 65%) */}
      <div
        className="w-full h-full bg-white rounded-[18px] relative flex flex-col overflow-hidden"
        style={{
          WebkitMaskImage: "radial-gradient(circle at 0 65%, transparent 16px, black 17px), radial-gradient(circle at 100% 65%, transparent 16px, black 17px)",
          WebkitMaskSize: "51% 100%",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "left, right",
          maskImage: "radial-gradient(circle at 0 65%, transparent 16px, black 17px), radial-gradient(circle at 100% 65%, transparent 16px, black 17px)",
          maskSize: "51% 100%",
          maskRepeat: "no-repeat",
          maskPosition: "left, right",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* LÍNEA DE PERFORACIÓN */}
        <div className="absolute top-[65%] left-4 right-4 border-t-[3px] border-dotted border-slate-200"></div>

        {/* ==================================================== */}
        {/* PARTE SUPERIOR (65%) */}
        {/* ==================================================== */}
        <div className="h-[65%] w-full flex flex-col p-3 sm:p-5 relative z-10 overflow-hidden">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-2 sm:mb-4">
            <div className="flex items-center gap-1.5 text-brand-ochre">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-black tracking-widest text-[9px] sm:text-[10px]">RUTALOPO</span>
            </div>
            <div
              className="px-1.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-50 text-emerald-600 text-[6px] sm:text-[7px] font-black tracking-widest uppercase shadow-sm"
            >
              VALIDADA
            </div>
          </div>

          {/* TÍTULO */}
          <div className="mb-2 sm:mb-4 flex-1 flex flex-col justify-center min-h-0">
            <h2 className="font-black text-brand-purple text-lg sm:text-2xl leading-[1.1] uppercase break-words drop-shadow-sm line-clamp-3">
              {title}
            </h2>
            <span className="text-slate-400 text-[9px] sm:text-xs mt-1 font-bold tracking-wide uppercase">
              Colección Oficial
            </span>
          </div>

          {/* GRID DE DATOS (KM y Desnivel) */}
          <div className="grid grid-cols-2 gap-y-1 gap-x-2 mt-auto">
            <div>
              <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold tracking-widest uppercase mb-0.5">Distancia</p>
              <p className="text-xs sm:text-sm font-black text-slate-800">
                {distancia ? `${distancia} km` : '-'}
              </p>
            </div>
            <div>
              <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold tracking-widest uppercase mb-0.5">Desnivel</p>
              <p className="text-xs sm:text-sm font-black text-slate-800">
                {desnivel ? `+${desnivel} m` : '-'}
              </p>
            </div>
          </div>

        </div>
        <RouteSticker date={date} code={code} fallbackText={fallbackText} />


      </div>
    </motion.div>
  );
};
