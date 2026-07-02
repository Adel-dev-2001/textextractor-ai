import { useState, useCallback, useEffect, useMemo } from 'react';
import type { ImageFile } from '../types';
import { geminiService } from '../services/geminiService';
import { useTranslation, useSettings } from '../contexts/SettingsContext';

type DownloadFormat = 'txt' | 'json';

export const useImageProcessor = () => {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>('txt');
  const [progress, setProgress] = useState(0);
  const [isDraggingGlobal, setIsDraggingGlobal] = useState(false);
  const [copyAllSuccess, setCopyAllSuccess] = useState(false);

  const { t } = useTranslation();
  const { language } = useSettings();

  // Revoke preview URLs on unmount
  useEffect(() => {
    return () => {
      imageFiles.forEach(imageFile => URL.revokeObjectURL(imageFile.previewUrl));
    };
  }, [imageFiles]);

  const handleFilesSelected = useCallback((files: File[]) => {
    const newImageFiles: ImageFile[] = files.map(file => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending',
      extractedText: null,
      error: null,
    }));
    setImageFiles(prev => [...prev, ...newImageFiles]);
    setGlobalError(null);
    
    // Scroll to workspace on file select
    setTimeout(() => {
        const element = document.getElementById('workspace');
        if(element) element.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  // Global Drag and Drop & Paste handlers
  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter++;
      if (e.dataTransfer && e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDraggingGlobal(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter--;
      if (dragCounter === 0) {
        setIsDraggingGlobal(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingGlobal(false);
      dragCounter = 0;

      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
         const files = Array.from(e.dataTransfer.files).filter((file: File) => file.type.startsWith('image/'));
         if(files.length > 0) {
             handleFilesSelected(files);
         }
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
          return;
      }

      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const files = Array.from(e.clipboardData.files).filter((file: File) => file.type.startsWith('image/'));
        if (files.length > 0) {
          e.preventDefault();
          handleFilesSelected(files);
        }
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);
    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
      window.removeEventListener('paste', handlePaste);
    };
  }, [handleFilesSelected]);

  const removeFile = useCallback((idToRemove: string) => {
    setImageFiles(prevFiles => {
      const fileToRemove = prevFiles.find(f => f.id === idToRemove);
      if (fileToRemove) URL.revokeObjectURL(fileToRemove.previewUrl);
      return prevFiles.filter(f => f.id !== idToRemove);
    });
  }, []);

  const updateFileText = useCallback((idToUpdate: string, newText: string) => {
    setImageFiles(prev => 
      prev.map(f => f.id === idToUpdate ? { ...f, extractedText: newText } : f)
    );
  }, []);
  
  const clearAll = useCallback(() => {
    setImageFiles(prevFiles => {
      prevFiles.forEach(imageFile => URL.revokeObjectURL(imageFile.previewUrl));
      return [];
    });
    setGlobalError(null);
  }, []);

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      if (imageFiles.length > 0) {
          if (window.confirm(language === 'ar' ? 'هل تريد إعادة تعيين مساحة العمل؟' : 'Would you like to reset the workspace?')) {
              clearAll();
          }
      }
  }, [imageFiles, language, clearAll]);

  const processImages = useCallback(async () => {
    const pendingFiles = imageFiles.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) {
        setGlobalError(t('app.noNewImagesError'));
        return;
    }

    setIsProcessing(true);
    setGlobalError(null);
    setProgress(0);

    let processedCount = 0;
    for (const imgFile of pendingFiles) {
        setImageFiles(prev => prev.map(f => f.id === imgFile.id ? { ...f, status: 'processing' } : f));
        try {
            const text = await geminiService.extractTextFromImage(imgFile.file);
            setImageFiles(prev => prev.map(f => f.id === imgFile.id ? { ...f, status: 'success', extractedText: text } : f));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t('app.unexpectedError');
            setImageFiles(prev => prev.map(f => f.id === imgFile.id ? { ...f, status: 'error', error: errorMessage } : f));
        }
        processedCount++;
        setProgress(Math.round((processedCount / pendingFiles.length) * 100));
    }
    
    setIsProcessing(false);
  }, [imageFiles, t]);

  const handleDownloadAll = useCallback(() => {
    const successfulResults = imageFiles.filter(f => f.status === 'success' && f.extractedText);
    if (successfulResults.length === 0) return;

    let content = '';
    let mimeType = 'text/plain';
    let filename = 'extracted_texts.txt';

    if (downloadFormat === 'json') {
      const jsonData = successfulResults.map(result => ({
        filename: result.file.name,
        text: result.extractedText
      }));
      content = JSON.stringify(jsonData, null, 2);
      mimeType = 'application/json';
      filename = 'extracted_texts.json';
    } else {
      const separator = "==================================================";
      content = successfulResults.map(result => 
        `${separator}\n📄 ${t('app.imageLabel')}: ${result.file.name}\n${separator}\n\n${result.extractedText}\n\n`
      ).join('\n');
    }

    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [imageFiles, downloadFormat, t]);
  
  const handleCopyAll = useCallback(() => {
    const successfulResults = imageFiles.filter(f => f.status === 'success' && f.extractedText);
    if (successfulResults.length === 0) return;
    
    const separator = "==================================================";
    const content = successfulResults.map(result => 
      `${separator}\n📄 ${t('app.imageLabel')}: ${result.file.name}\n${separator}\n\n${result.extractedText}\n\n`
    ).join('\n');

    navigator.clipboard.writeText(content)
      .then(() => {
        setCopyAllSuccess(true);
        setTimeout(() => setCopyAllSuccess(false), 2000);
      })
      .catch(err => console.error('Failed to copy text: ', err));
  }, [imageFiles, t]);

  const hasFiles = imageFiles.length > 0;
  const hasPending = useMemo(() => imageFiles.some(f => f.status === 'pending'), [imageFiles]);
  const hasSuccess = useMemo(() => imageFiles.some(f => f.status === 'success'), [imageFiles]);
  const pendingCount = useMemo(() => imageFiles.filter(f => f.status === 'pending').length, [imageFiles]);

  return {
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
    pendingCount,
    setGlobalError
  };
};
