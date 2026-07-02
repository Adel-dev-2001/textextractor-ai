import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ImageResultCard from './components/ImageResultCard';
import ImagePreviewModal from './components/ImagePreviewModal';
import ProgressBar from './components/ProgressBar';
import type { ImageFile } from './types';
import { 
  DownloadIcon, TrashIcon, PlusIcon, CopyIcon, 
  GlobeIcon, 
  UploadIcon, SunIcon, MoonIcon, CheckIcon,
  StudentIcon, BriefcaseIcon, CodeIcon, ChevronDownIcon
} from './components/IconComponents';
import { useTranslation, useSettings } from './contexts/SettingsContext';
import { LANGUAGES } from './constants/languages';
import { useImageProcessor } from './hooks/useImageProcessor';

const App: React.FC = () => {
  const {
    imageFiles,
    isProcessing,
    globalError,
    downloadFormat,
    setDownloadFormat,
    progress,
    isDraggingGlobal,
    copyAllSuccess,
    handleFilesSelected,
    removeFile,
    updateFileText,
    clearAll,
    handleLogoClick,
    processImages,
    handleDownloadAll,
    handleCopyAll,
    hasFiles,
    hasPending,
    hasSuccess,
    pendingCount
  } = useImageProcessor();

  const [modalImage, setModalImage] = useState<ImageFile | null>(null);
  const [activeModalContent, setActiveModalContent] = useState<'about' | 'privacy' | 'terms' | null>(null);
  const [activeUseCaseTab, setActiveUseCaseTab] = useState<'students' | 'business' | 'developers'>('students');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const { t, langInfo } = useTranslation();
  const { theme, setTheme, language, setLanguage } = useSettings();

  return (
    <div 
      className={`min-h-screen bg-slate-50 dark:bg-[#070b13] text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-blue-500/30 overflow-x-hidden relative flex flex-col`}
      dir={langInfo.dir}
    >
      {/* Premium Ambient Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
         <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-blue-500/10 to-teal-500/5 dark:from-blue-600/15 dark:to-teal-600/5 rounded-full blur-[140px] animate-float" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tr from-indigo-500/10 to-purple-500/5 dark:from-indigo-600/15 dark:to-purple-600/5 rounded-full blur-[140px] animate-float-delayed" />
         {/* Delicate global grid texture */}
         <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-75"></div>
      </div>

      {/* Global Drag Overlay */}
      <div 
        className={`fixed inset-0 z-[100] bg-blue-600/10 dark:bg-blue-500/20 backdrop-blur-md border-4 border-blue-500 border-dashed m-6 rounded-3xl flex flex-col items-center justify-center transition-all duration-300 pointer-events-none ${isDraggingGlobal ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <div className="p-8 rounded-full bg-white dark:bg-slate-900 shadow-2xl animate-bounce mb-4 border border-blue-100 dark:border-blue-900">
             <UploadIcon className="w-16 h-16 text-blue-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white bg-white/80 dark:bg-slate-900/80 px-8 py-4 rounded-2xl backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl">
            {t('uploader.select')}
        </h2>
      </div>

      {/* Modern Top Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 dark:bg-[#070b13]/85 border-b border-slate-200/50 dark:border-slate-850/50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <a 
            href="/" 
            onClick={handleLogoClick} 
            className="flex items-center gap-3 cursor-pointer group transition-all"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 dark:from-blue-500 dark:to-indigo-400 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                T
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                TextExtractor <span className="text-xs text-blue-500 dark:text-blue-400 font-medium tracking-normal ltr:ml-1 rtl:mr-1">AI</span>
              </span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                {t('app.newGenBadge')}
              </span>
            </div>
          </a>

          {/* Quick Language & Theme Switch Controls directly on header */}
          <div className="flex items-center gap-4">
            {/* Language switch button */}
            <div className="relative group/lang w-12 h-12 rounded-full flex items-center justify-center bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-blue-500/10 dark:hover:shadow-blue-500/15 hover:border-blue-500/40 dark:hover:border-blue-400/40 transition-all duration-300 hover:scale-105 active:scale-95">
              <div className="flex flex-col items-center justify-center gap-0.5">
                <GlobeIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover/lang:text-blue-500 dark:group-hover/lang:text-blue-400 transition-colors duration-300" />
                <span className="text-[9px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-wider">
                  {language}
                </span>
              </div>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none z-10"
                title="Change Language"
              >
                {Object.entries(LANGUAGES).map(([code, { name }]) => (
                  <option key={code} value={code} className="text-slate-800 bg-white dark:bg-[#070b13] font-semibold text-sm">
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dark & Light instant switch */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-12 h-12 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-blue-500/10 dark:hover:shadow-blue-500/15 hover:border-blue-500/40 dark:hover:border-blue-400/40 transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none flex items-center justify-center"
              aria-label="Toggle Theme"
            >
              <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
                {theme === 'dark' ? (
                  <SunIcon className="w-5 h-5 text-amber-500 group-hover:rotate-45 transition-transform duration-500" />
                ) : (
                  <MoonIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:-rotate-12 transition-transform duration-500" />
                )}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col justify-center">
        
        {/* Sleek Minimalist Hero / Intro Header */}
        <div className="text-center mb-10 max-w-2xl mx-auto transition-all animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
            {t('app.title')}
          </h1>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium">
            {t('app.subtitle')}
          </p>
        </div>

        {/* Workspace dynamic anchor */}
        <div id="workspace" className="w-full relative transition-all duration-300">
          {!hasFiles ? (
            <div className="space-y-16 animate-fade-in pb-12">
              <ImageUploader onFilesSelected={handleFilesSelected} disabled={isProcessing} />

              {/* Minimalist Stats Counters Bar */}
              <div className="grid grid-cols-3 gap-2 sm:gap-6 max-w-4xl mx-auto px-4 py-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm text-center">
                <div>
                  <div className="text-xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono tracking-tight">99.2%</div>
                  <div className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase">{t('stats.accuracy')}</div>
                </div>
                <div className="border-x border-slate-200 dark:border-slate-800">
                  <div className="text-xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-mono tracking-tight">50+</div>
                  <div className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase">{t('stats.languages')}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tracking-tight">100%</div>
                  <div className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase">{t('features.secureTitle')}</div>
                </div>
              </div>

              {/* Core Features Highlight List */}
              <div className="max-w-4xl mx-auto px-2">
                <h2 className="text-xl sm:text-2xl font-black text-center text-slate-900 dark:text-white mb-8 tracking-tight">
                  {t('features.title')}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { 
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ),
                      gradient: 'from-amber-400 to-orange-500',
                      glow: 'shadow-amber-500/30',
                      title: t('features.fastTitle'), 
                      desc: t('features.fastDesc') 
                    },
                    { 
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                          <circle cx="12" cy="12" r="3" fill="currentColor"/>
                          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.5"/>
                          <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1 3"/>
                          <path d="M12 1v2M12 21v2M1 12h2M21 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      ),
                      gradient: 'from-blue-500 to-indigo-600',
                      glow: 'shadow-blue-500/30',
                      title: t('features.accurateTitle'), 
                      desc: t('features.accurateDesc') 
                    },
                    { 
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                          <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6L12 2z" fill="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ),
                      gradient: 'from-emerald-500 to-teal-600',
                      glow: 'shadow-emerald-500/30',
                      title: t('features.secureTitle'), 
                      desc: t('features.secureDesc') 
                    }
                  ].map((feat, idx) => (
                    <div key={idx} className="flex flex-col p-6 rounded-2xl bg-white/60 dark:bg-[#0f1524]/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/55 shadow-sm transition-all hover:scale-[1.02] hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 group">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${feat.gradient} mb-5 shadow-lg ${feat.glow} group-hover:shadow-xl group-hover:scale-105 transition-all text-white`}>
                        {feat.icon}
                      </div>
                      <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-1.5">{feat.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* How it Works Section */}
              <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-xl sm:text-2xl font-black text-center text-slate-900 dark:text-white mb-10 tracking-tight">
                  {t('howItWorks.title')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {[
                    { step: '01', title: t('howItWorks.step1Title'), desc: t('howItWorks.step1Desc') },
                    { step: '02', title: t('howItWorks.step2Title'), desc: t('howItWorks.step2Desc') },
                    { step: '03', title: t('howItWorks.step3Title'), desc: t('howItWorks.step3Desc') },
                  ].map((step, idx) => (
                    <div key={idx} className="relative flex flex-col items-center text-center">
                      <div className="text-4xl font-extrabold text-slate-200 dark:text-slate-800 mb-3">{step.step}</div>
                      <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-2">{step.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Use Cases Horizontal Tab Switcher Section */}
              <div className="max-w-4xl mx-auto px-2">
                <div className="text-center mb-10">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                    {t('useCases.title')}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                    {t('useCases.subtitle')}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900/80 rounded-2xl max-w-lg mx-auto border border-slate-200/40 dark:border-slate-800/60 mb-6">
                  {[
                    { id: 'students', label: t('useCases.studentsTitle'), icon: StudentIcon },
                    { id: 'business', label: t('useCases.businessTitle'), icon: BriefcaseIcon },
                    { id: 'developers', label: t('useCases.developersTitle'), icon: CodeIcon },
                  ].map((tab) => {
                    const isSelected = activeUseCaseTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveUseCaseTab(tab.id as 'students' | 'business' | 'developers')}
                        className={`
                          flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 flex-1 justify-center
                          ${isSelected 
                            ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-700/50 scale-[1.02]' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                          }
                        `}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Display active use case container */}
                <div className="bg-white/60 dark:bg-[#0f1524]/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform">
                    {activeUseCaseTab === 'students' && <StudentIcon className="w-32 h-32 text-blue-500" />}
                    {activeUseCaseTab === 'business' && <BriefcaseIcon className="w-32 h-32 text-teal-500" />}
                    {activeUseCaseTab === 'developers' && <CodeIcon className="w-32 h-32 text-indigo-500" />}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-2xl text-blue-500 border border-blue-100/50 dark:border-blue-900/30">
                      {activeUseCaseTab === 'students' && <StudentIcon className="w-6 h-6" />}
                      {activeUseCaseTab === 'business' && <BriefcaseIcon className="w-6 h-6" />}
                      {activeUseCaseTab === 'developers' && <CodeIcon className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                        {activeUseCaseTab === 'students' && t('useCases.studentsTitle')}
                        {activeUseCaseTab === 'business' && t('useCases.businessTitle')}
                        {activeUseCaseTab === 'developers' && t('useCases.developersTitle')}
                      </h3>
                      <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-0.5">
                        {activeUseCaseTab === 'students' && 'Academic OCR & Summaries'}
                        {activeUseCaseTab === 'business' && 'Enterprise Document Scanner'}
                        {activeUseCaseTab === 'developers' && 'Developer Screenshot Extract'}
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                    {activeUseCaseTab === 'students' && t('useCases.studentsDesc')}
                    {activeUseCaseTab === 'business' && t('useCases.businessDesc')}
                    {activeUseCaseTab === 'developers' && t('useCases.developersDesc')}
                  </p>
                </div>
              </div>

              {/* Minimalist FAQ Accordions Section */}
              <div className="max-w-2xl mx-auto px-4">
                <h2 className="text-xl sm:text-2xl font-black text-center text-slate-900 dark:text-white mb-8 tracking-tight">
                  {t('faq.title')}
                </h2>

                <div className="space-y-4">
                  {[
                    { q: t('faq.q1'), a: t('faq.a1') },
                    { q: t('faq.q2'), a: t('faq.a2') },
                    { q: t('faq.q3'), a: t('faq.a3') },
                    { q: t('faq.q4'), a: t('faq.a4') },
                  ].map((faqItem, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div 
                        key={idx} 
                        className="bg-white/50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/70 rounded-2xl transition-all duration-300"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between p-5 text-left rtl:text-right gap-4 focus:outline-none"
                        >
                          <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                            {faqItem.q}
                          </span>
                          <span className="shrink-0">
                            <ChevronDownIcon 
                              className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : 'text-slate-400'}`} 
                            />
                          </span>
                        </button>
                        
                        <div 
                          className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                        >
                          <div className="overflow-hidden">
                            <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-850/50 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                              {faqItem.a}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
             <div className="space-y-6">
                {/* Floating Modern Action Bar */}
                <div className="sticky top-20 z-30 transition-all duration-300">
                  <div className="backdrop-blur-xl bg-white/90 dark:bg-[#0c1222]/90 border border-slate-200/70 dark:border-slate-800/80 rounded-2xl p-4.5 shadow-xl shadow-slate-200/30 dark:shadow-black/50">
                     {isProcessing && <ProgressBar progress={progress} />}
                     
                     <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        
                        <div className="flex items-center gap-3 w-full md:w-auto">
                           <label htmlFor="add-more-inputs" className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-xl hover:-translate-y-0.5 shadow-sm hover:shadow-blue-500/20 transition-all cursor-pointer">
                                <PlusIcon className="w-4 h-4"/>
                                {t('app.addMore')}
                           </label>
                           <input type="file" id="add-more-inputs" multiple accept="image/*" className="hidden" onChange={(e) => handleFilesSelected(Array.from(e.target.files || []))} disabled={isProcessing}/>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-2.5 w-full md:w-auto">
                            {/* Run processing trigger */}
                            <button 
                              onClick={processImages} 
                              disabled={isProcessing || !hasPending} 
                              className="flex-1 md:flex-none px-6 py-2.5 text-xs font-black text-white bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl hover:shadow-md hover:shadow-teal-500/10 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:-translate-y-0 disabled:shadow-none disabled:cursor-not-allowed"
                            >
                                {isProcessing ? t('app.processing') : `${t('app.processPending')} (${pendingCount})`}
                            </button>
                            
                            <div className="h-6 w-px bg-slate-300 dark:bg-slate-800 hidden md:block mx-1"></div>

                            {/* Copy all */}
                            <button 
                              onClick={handleCopyAll} 
                              disabled={isProcessing || !hasSuccess} 
                              className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-850 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                            >
                                {copyAllSuccess ? <CheckIcon className="w-4 h-4 text-emerald-500" /> : <CopyIcon className="w-4 h-4"/>} 
                                {copyAllSuccess ? t('card.copied') : t('app.copyAll')}
                            </button>
                             
                            {/* Download group */}
                            <div className="flex items-center">
                                <button 
                                  onClick={handleDownloadAll} 
                                  disabled={isProcessing || !hasSuccess} 
                                  className="px-4 py-2.5 text-xs font-semibold rounded-l-xl rtl:rounded-r-xl rounded-r-none rtl:rounded-l-none text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-r-0 rtl:border-l-0 hover:bg-slate-200 dark:hover:bg-slate-850 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                                >
                                    <DownloadIcon className="w-4 h-4"/> {t('app.downloadAll')}
                                </button>
                                <div className="relative">
                                    <select 
                                      value={downloadFormat} 
                                      onChange={e => setDownloadFormat(e.target.value as any)} 
                                      disabled={isProcessing || !hasSuccess} 
                                      className="py-2.5 ltr:pl-2 rtl:pr-2 ltr:pr-6 rtl:pl-6 text-xs font-bold rounded-r-xl rtl:rounded-l-xl rounded-l-none rtl:rounded-r-none text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer appearance-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <option value="txt">TXT</option>
                                        <option value="json">JSON</option>
                                    </select>
                                    <div className="pointer-events-none absolute ltr:right-2.5 rtl:left-2.5 top-1/2 -translate-y-1/2">
                                      <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Clear All files */}
                            <button 
                              onClick={clearAll} 
                              disabled={isProcessing} 
                              className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 hover:border-red-300 dark:hover:border-red-700/50 hover:-translate-y-0.5 shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                              title={t('app.clearAll')}
                            >
                                <TrashIcon className="w-4 h-4"/>
                                <span className="hidden sm:inline">{t('app.clearAll')}</span>
                            </button>
                        </div>
                     </div>
                  </div>
                </div>

                {globalError && (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-center animate-shake">
                        <p className="text-red-700 dark:text-red-400 font-semibold text-sm">{globalError}</p>
                    </div>
                )}
                
                {/* Responsive Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 pt-2">
                    {imageFiles.map(imageFile => (
                        <ImageResultCard 
                            key={imageFile.id}
                            imageFile={imageFile} 
                            onRemove={() => removeFile(imageFile.id)} 
                            onView={() => setModalImage(imageFile)}
                            onUpdateText={(newText) => updateFileText(imageFile.id, newText)}
                        />
                    ))}
                </div>
             </div>
          )}
        </div>

      </main>

      {/* Polish Minimal Footer */}
      <footer className="mt-auto py-8 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/40 dark:border-slate-850/40 px-4">
        <p className="font-bold text-slate-800 dark:text-slate-300 mb-1.5 tracking-wide text-sm">
          TextExtractor AI
        </p>
        <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 flex-wrap">
          <span>&copy; 2026</span>
          <span className="text-slate-350 dark:text-slate-800">&bull;</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">Adel Mohamed</span>
          <span className="text-slate-350 dark:text-slate-800">&bull;</span>
          <button onClick={() => setActiveModalContent('about')} className="hover:text-blue-500">{t('footer.aboutUs')}</button>
          <span className="text-slate-350 dark:text-slate-800">&bull;</span>
          <button onClick={() => setActiveModalContent('privacy')} className="hover:text-blue-500">{t('footer.privacy')}</button>
          <span className="text-slate-350 dark:text-slate-800">&bull;</span>
          <button onClick={() => setActiveModalContent('terms')} className="hover:text-blue-500">{t('footer.terms')}</button>
        </p>
      </footer>

      {modalImage && <ImagePreviewModal image={modalImage} onClose={() => setModalImage(null)} />}
      
      {activeModalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button onClick={() => setActiveModalContent(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
              {activeModalContent === 'about' && t('footer.aboutUs')}
              {activeModalContent === 'privacy' && t('footer.privacy')}
              {activeModalContent === 'terms' && t('footer.terms')}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {activeModalContent === 'about' && t('footer.aboutContent')}
              {activeModalContent === 'privacy' && t('footer.privacyContent')}
              {activeModalContent === 'terms' && t('footer.termsContent')}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(2deg); }
            100% { transform: translateY(0px) rotate(0deg); }
        }
        
        @keyframes float-delayed {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(20px) rotate(-2deg); }
            100% { transform: translateY(0px) rotate(0deg); }
        }

        @keyframes scan {
            0% { top: 0%; opacity: 0; box-shadow: 0 0 5px rgba(59, 130, 246, 0); }
            10% { opacity: 1; box-shadow: 0 0 15px rgba(59, 130, 246, 0.8); }
            90% { opacity: 1; box-shadow: 0 0 15px rgba(59, 130, 246, 0.8); }
            100% { top: 100%; opacity: 0; box-shadow: 0 0 5px rgba(59, 130, 246, 0); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .animate-float {
            animation: float 15s ease-in-out infinite;
        }
        
        .animate-float-delayed {
            animation: float-delayed 18s ease-in-out infinite;
        }

        .animate-scan {
            animation: scan 2.5s linear infinite;
        }

        @keyframes fade-in {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
            20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
};

export default App;
