import React, { useState } from 'react';
import type { ImageFile } from '../types';
import { TrashIcon, CopyIcon, CheckIcon, ZoomInIcon } from './IconComponents';
import { useTranslation } from '../contexts/SettingsContext';

interface ImageResultCardProps {
  imageFile: ImageFile;
  onRemove: () => void;
  onView: () => void;
  onUpdateText: (newText: string) => void;
}

const ImageResultCard: React.FC<ImageResultCardProps> = ({ imageFile, onRemove, onView, onUpdateText }) => {
    const [copySuccess, setCopySuccess] = useState(false);
    const { t } = useTranslation();
    
    const handleCopy = () => {
        if(imageFile.extractedText) {
            navigator.clipboard.writeText(imageFile.extractedText).then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            });
        }
    };

    const renderStatusContent = () => {
        switch (imageFile.status) {
            case 'processing':
                return (
                    <div className="flex flex-col h-full p-6 gap-4">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                             <span className="text-xs font-semibold text-blue-500 uppercase tracking-widest">{t('spinner.processing')}</span>
                        </div>
                        {/* Skeleton Loading Effect for Text */}
                        <div className="space-y-3 w-full animate-pulse">
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-11/12"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/5"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                        </div>
                         <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                             <div className="flex justify-between items-center text-xs text-slate-400">
                                <span>AI Analysis</span>
                                <span>Running...</span>
                             </div>
                         </div>
                    </div>
                );
            case 'success':
                return (
                    <div className="flex flex-col h-full bg-slate-50/30 dark:bg-slate-900/30">
                       <div className="flex-shrink-0 flex justify-between items-center p-3 border-b border-slate-100 dark:border-slate-700/50">
                             <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wide flex items-center gap-2">
                                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                 {t('card.extractedText')}
                             </h4>
                             <button onClick={handleCopy} className="group flex items-center gap-2 text-xs font-medium px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-500 rounded-lg transition-all shadow-sm">
                                 {copySuccess ? 
                                     <><CheckIcon className="h-3.5 w-3.5 text-green-500" /> <span className="text-green-600">{t('card.copied')}</span></> : 
                                     <><CopyIcon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> {t('card.copy')}</>
                                 }
                             </button>
                       </div>
                        <textarea
                            className="w-full flex-grow p-4 bg-transparent text-slate-900 dark:text-slate-300 leading-relaxed resize-none focus:outline-none focus:bg-white/40 dark:focus:bg-slate-800/40 transition-colors custom-scrollbar text-sm sm:text-base font-mono"
                            value={imageFile.extractedText || ""}
                            onChange={(e) => onUpdateText(e.target.value)}
                            placeholder={t('card.noTextFound')}
                            dir="auto"
                            spellCheck={false}
                        />
                    </div>
                );
            case 'error':
                return (
                     <div className="p-6 flex flex-col justify-center items-center h-full text-center bg-red-50/50 dark:bg-red-900/10">
                        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4 shadow-inner">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">{t('card.errorTitle')}</h4>
                        <p className="text-sm text-red-500/80 dark:text-red-400/80 break-all leading-relaxed max-w-[80%]">{imageFile.error}</p>
                    </div>
                );
            case 'pending':
            default:
                 return (
                    <div className="p-6 flex flex-col justify-center items-center h-full text-center bg-slate-50/50 dark:bg-slate-900/50 relative overflow-hidden group-hover:bg-slate-100/50 dark:group-hover:bg-slate-800/50 transition-colors duration-500">
                        <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-4 relative z-10">
                             <div className="w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded-full animate-pulse"></div>
                        </div>
                        <h4 className="font-bold text-slate-700 dark:text-slate-200 text-lg mb-1 relative z-10">{t('card.pendingTitle')}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px] relative z-10">{t('card.pendingBody')}</p>
                        
                        {/* Background Decor */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-slate-200/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                    </div>
                );
        }
    }

    const statusStyles = {
        pending: 'border-slate-200 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-800',
        processing: 'border-blue-400 dark:border-blue-600 ring-2 ring-blue-500/10 shadow-blue-500/10',
        success: 'border-teal-400/50 dark:border-teal-600/50 hover:border-teal-400 dark:hover:border-teal-500',
        error: 'border-red-300 dark:border-red-800'
    };

  return (
    <div className={`
        relative bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-xl 
        border ${statusStyles[imageFile.status]} 
        rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/30
        transition-all duration-500 flex flex-col h-[500px] animate-fade-in overflow-hidden group
        transform hover:-translate-y-1
    `}>
        {/* Header */}
        <div className="px-4 py-3 bg-white/50 dark:bg-slate-800/50 flex justify-between items-center flex-shrink-0 border-b border-slate-100 dark:border-slate-700/50 z-20">
            <div className="flex items-center gap-3 overflow-hidden">
                <span className={`flex h-2.5 w-2.5 relative`}>
                     <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${imageFile.status === 'processing' ? 'bg-blue-400' : 'hidden'}`}></span>
                     <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${imageFile.status === 'success' ? 'bg-green-500' : imageFile.status === 'error' ? 'bg-red-500' : imageFile.status === 'processing' ? 'bg-blue-500' : 'bg-slate-400'}`}></span>
                </span>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate font-mono tracking-tight" title={imageFile.file.name}>{imageFile.file.name}</p>
            </div>
            <button onClick={onRemove} className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300" title={t('app.clearAll')}>
                <TrashIcon className="w-4 h-4"/>
            </button>
        </div>
        
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 h-full overflow-hidden relative">
            {/* Image Section */}
            <div className="bg-slate-100/50 dark:bg-black/40 flex items-center justify-center p-6 overflow-hidden h-full relative group/image">
                {/* Image Container with Scan Effect */}
                <div className="relative max-w-full max-h-full shadow-lg rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <img src={imageFile.previewUrl} alt={imageFile.file.name} className="max-w-full max-h-full object-contain block" />
                    
                    {/* Scan Line Animation - Only active when processing */}
                    {imageFile.status === 'processing' && (
                        <div className="absolute inset-0 z-10 pointer-events-none">
                            <div className="w-full h-[3px] bg-blue-500 absolute shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-scan"></div>
                            <div className="absolute inset-0 bg-blue-500/5"></div>
                        </div>
                    )}
 
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/image:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                         <button onClick={onView} className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md border border-white/30 transition-transform transform hover:scale-110 shadow-lg">
                            <ZoomInIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                
                {/* Background Grid Pattern for professional look */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
                </div>
            </div>
 
            {/* Content Section */}
            <div className="border-t md:border-t-0 ltr:md:border-l rtl:md:border-r border-slate-200/60 dark:border-slate-700/60 h-full overflow-hidden relative bg-white/40 dark:bg-transparent">
                {renderStatusContent()}
            </div>
        </div>
 
        <style>{`
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(15px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in { animation: fade-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        `}</style>
    </div>
  );
};

export default ImageResultCard;
