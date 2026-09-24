import React from 'react';
import { CheckCircle } from 'lucide-react';

interface RouteStickerProps {
  date: string | null;
  code: string | null;
  fallbackText: string | null;
}

export const RouteSticker: React.FC<RouteStickerProps> = ({ date, code, fallbackText }) => {
  return (
    <div className="h-[35%] w-full flex flex-col items-center justify-center p-2 sm:p-4 relative z-10 bg-slate-50/50 overflow-hidden">
      {/* GRID DE DATOS (KM y Desnivel) */}
      <div className="grid grid-cols-2 gap-y-1 sm:gap-y-3 gap-x-2">
        <div>
          <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold tracking-widest uppercase mb-0.5">Fecha</p>
          <p className="text-[10px] sm:text-xs font-bold text-slate-600">{date}</p>
        </div>
        <div>
          <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold tracking-widest uppercase mb-0.5">Código</p>
          <p className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase">{code || fallbackText}</p>
        </div>
      </div>


      <div className="relative z-20 bg-emerald-500 mt-2 sm:mt-4 text-white p-2 sm:p-3 rounded-full border-white shadow-xl transform group-hover:scale-100 transition-transform duration-300">
        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
      </div>

    </div>
  );
};
