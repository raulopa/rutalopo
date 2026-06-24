import React from 'react';
import { Modal } from './Modal';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string | React.ReactNode;
  onConfirm: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmText,
  cancelText,
  isDestructive = false,
  isLoading = false,
}) => {
  const { t } = useLanguage();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="p-6">
        <div className="text-slate-600 mb-6 text-sm">
          {message}
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            {cancelText || t.cancel || 'Cancelar'}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-bold text-white shadow hover:shadow-md transition-all disabled:opacity-50 flex items-center justify-center min-w-[100px] ${
              isDestructive 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-brand-purple hover:bg-[#3d1942]'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              confirmText || 'Confirmar'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
