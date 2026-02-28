'use client';
import { useState, useCallback } from 'react';
import { isValidImageFile, isValidPDFFile, formatFileSize } from '@/lib/utils';

interface FileProcessorOptions {
  accept?: string[];
  maxSizeMB?: number;
  multiple?: boolean;
  onProcess: (files: File[]) => Promise<void>;
}

interface FileProcessorState {
  files: File[];
  isProcessing: boolean;
  error: string | null;
  progress: number;
}

export function useFileProcessor(options: FileProcessorOptions) {
  const { accept, maxSizeMB = 20, multiple = false, onProcess } = options;
  const [state, setState] = useState<FileProcessorState>({
    files: [],
    isProcessing: false,
    error: null,
    progress: 0,
  });

  const validateFile = useCallback((file: File): string | null => {
    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      return `File "${file.name}" is too large. Maximum size is ${maxSizeMB}MB.`;
    }
    if (accept && accept.length > 0) {
      const isValid = accept.some(type => {
        if (type.startsWith('.')) return file.name.toLowerCase().endsWith(type);
        if (type.endsWith('/*')) return file.type.startsWith(type.replace('/*', ''));
        return file.type === type;
      });
      if (!isValid) {
        return `File "${file.name}" is not a supported format.`;
      }
    }
    return null;
  }, [accept, maxSizeMB]);

  const handleFiles = useCallback(async (newFiles: File[]) => {
    const filesToProcess = multiple ? newFiles : [newFiles[0]];
    for (const file of filesToProcess) {
      const error = validateFile(file);
      if (error) {
        setState(prev => ({ ...prev, error }));
        return;
      }
    }
    setState(prev => ({ ...prev, files: filesToProcess, error: null, isProcessing: true, progress: 0 }));
    try {
      await onProcess(filesToProcess);
      setState(prev => ({ ...prev, isProcessing: false, progress: 100 }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: err instanceof Error ? err.message : 'An error occurred during processing.',
      }));
    }
  }, [multiple, validateFile, onProcess]);

  const reset = useCallback(() => {
    setState({ files: [], isProcessing: false, error: null, progress: 0 });
  }, []);

  const setProgress = useCallback((progress: number) => {
    setState(prev => ({ ...prev, progress }));
  }, []);

  return { ...state, handleFiles, reset, setProgress, formatFileSize };
}
