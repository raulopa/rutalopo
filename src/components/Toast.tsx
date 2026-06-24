import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none sm:top-4 sm:right-4 sm:left-auto flex flex-col items-center sm:items-end gap-2 p-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl border w-full max-w-sm backdrop-blur-md ${getToastStyles(toast.type)}`}
          >
            <div className="shrink-0 mt-0.5">
              {getToastIcon(toast.type)}
            </div>
            <div className="flex-1 text-sm font-bold leading-relaxed pr-2 tracking-wide">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-current opacity-70 hover:opacity-100 transition-all hover:rotate-90 p-1 -m-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

function getToastStyles(type: string) {
  switch (type) {
    case 'success':
      return 'bg-emerald-500/95 text-white border-emerald-600/50';
    case 'error':
      return 'bg-red-500/95 text-white border-red-600/50';
    case 'warning':
      return 'bg-amber-500/95 text-white border-amber-600/50';
    case 'info':
    default:
      return 'bg-brand-purple/95 text-white border-brand-purple/50';
  }
}

function getToastIcon(type: string) {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="w-5 h-5" />;
    case 'error':
      return <AlertCircle className="w-5 h-5" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5" />;
    case 'info':
    default:
      return <Info className="w-5 h-5" />;
  }
}
