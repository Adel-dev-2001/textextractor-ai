import React, { useState, useCallback } from 'react';
import { UploadIcon } from './IconComponents';
import { useTranslation } from '../contexts/SettingsContext';

interface ImageUploaderProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesSelected, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useTranslation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesSelected(Array.from(event.target.files).filter((file: File) => file.type.startsWith('image/')));
    }
    event.target.value = '';
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files && files.length > 0) {
      onFilesSelected(files.filter((file: File) => file.type.startsWith('image/')));
    }
  }, [disabled, onFilesSelected]);


  return (
    <div className="w-full max-w-4xl mx-auto my-12 animate-fade-in-up">
      <label 
        htmlFor="file-upload" 
        className={`
            group relative flex flex-col items-center justify-center w-full h-80 px-4 transition-all duration-500 
            rounded-3xl appearance-none cursor-pointer backdrop-blur-xl
            border-[3px] border-dashed overflow-hidden
            ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100/30 dark:bg-slate-800/30 border-slate-300 dark:border-slate-600' : 
              isDragging 
                ? 'bg-blue-50/80 dark:bg-blue-900/30 border-blue-500 scale-[1.01] shadow-2xl shadow-blue-500/20 ring-4 ring-blue-500/10' 
                : 'bg-white/40 dark:bg-slate-900/40 border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-400 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:shadow-xl'
            }
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-6 text-center z-10 relative">
            {/* Animated Icon Container */}
            <div className={`
                relative p-6 rounded-2xl bg-gradient-to-tr from-blue-50 to-white dark:from-slate-800 dark:to-slate-700 
                shadow-lg border border-white/50 dark:border-slate-600
                transition-all duration-500 
                ${isDragging ? 'rotate-6 scale-110 shadow-blue-500/20' : 'group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-xl'}
            `}>
                <UploadIcon className={`w-14 h-14 text-blue-600 dark:text-blue-400 ${isDragging ? 'animate-bounce' : ''}`} />
                
                {/* Pulse ring behind icon */}
                <div className={`absolute inset-0 rounded-2xl bg-blue-400/20 blur-xl transition-opacity duration-500 ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
            </div>

            <div className="space-y-3">
                <span className="block text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 dark:from-white dark:to-slate-300">
                    {t('uploader.select')}
                </span>
                <span className="block text-sm font-medium text-slate-500 dark:text-slate-400">
                     {t('uploader.dragDrop')}
                </span>
            </div>
            
            <div className="flex gap-3 pt-2">
                {['JPG', 'PNG', 'WEBP'].map((ext) => (
                    <span key={ext} className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                        {ext}
                    </span>
                ))}
            </div>
        </div>
        
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          multiple
          accept="image/*"
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          disabled={disabled}
        />
        
        {/* Decorative elements */}
        <div className={`absolute inset-0 -z-10 bg-gradient-to-tr from-blue-500/5 via-transparent to-teal-500/5 transition-opacity duration-500 ${isDragging ? 'opacity-100' : 'opacity-50'}`} />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"></div>
      </label>
      <style>{`
          @keyframes fade-in-up {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
              animation: fade-in-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          }
      `}</style>
    </div>
  );
};

export default ImageUploader;
