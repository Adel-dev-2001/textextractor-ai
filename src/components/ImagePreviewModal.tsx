import React from 'react';
import type { ImageFile } from '../types';
import { CloseIcon } from './IconComponents';
import { useTranslation } from '../contexts/SettingsContext';

interface ImagePreviewModalProps {
  image: ImageFile;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ image, onClose }) => {
  const { t } = useTranslation();

  return (
    <div 
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in-fast" 
        onClick={onClose}
    >
      <div 
        className="bg-slate-100 dark:bg-slate-800 rounded-lg shadow-2xl max-w-4xl max-h-[90vh] w-full flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-3 flex justify-between items-center border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 truncate" title={image.file.name}>
                {t('modal.imagePreview')}: {image.file.name}
            </h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                <CloseIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
            </button>
        </div>
        <div className="p-4 flex-grow overflow-auto flex items-center justify-center">
            <img 
                src={image.previewUrl} 
                alt={image.file.name} 
                className="max-w-full max-h-full object-contain"
            />
        </div>
      </div>
      <style>{`
        @keyframes fade-in-fast {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in-fast {
            animation: fade-in-fast 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ImagePreviewModal;
