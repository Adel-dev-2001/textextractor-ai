export type ProcessStatus = 'pending' | 'processing' | 'success' | 'error';

export interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
  status: ProcessStatus;
  extractedText: string | null;
  error: string | null;
}
