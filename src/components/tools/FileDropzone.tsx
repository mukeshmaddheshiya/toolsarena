'use client';
import { useCallback, useState } from 'react';
import { Upload, X, FileText, Image, File } from 'lucide-react';
import { cn, formatFileSize } from '@/lib/utils';

interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  onFiles: (files: File[]) => void;
  files?: File[];
  onRemove?: (index: number) => void;
  description?: string;
  className?: string;
}

function FileIcon({ file }: { file: File }) {
  if (file.type.startsWith('image/')) return <Image className="w-4 h-4 text-purple-500" />;
  if (file.type === 'application/pdf') return <FileText className="w-4 h-4 text-red-500" />;
  return <File className="w-4 h-4 text-slate-500" />;
}

export function FileDropzone({
  accept,
  multiple = false,
  maxSizeMB = 20,
  onFiles,
  files = [],
  onRemove,
  description,
  className,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndProcess = useCallback((newFiles: File[]) => {
    setError(null);
    const valid: File[] = [];
    for (const file of newFiles) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`"${file.name}" exceeds ${maxSizeMB}MB limit.`);
        return;
      }
      valid.push(file);
    }
    onFiles(valid);
  }, [maxSizeMB, onFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndProcess(multiple ? droppedFiles : [droppedFiles[0]]);
  }, [multiple, validateAndProcess]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    validateAndProcess(selected);
    e.target.value = '';
  }, [validateAndProcess]);

  return (
    <div className={className}>
      <label
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center w-full min-h-[160px] rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200',
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-600 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-white dark:bg-slate-800'
        )}
      >
        <input type="file" accept={accept} multiple={multiple} onChange={handleChange} className="sr-only" />
        <Upload className={cn('w-10 h-10 mb-3', isDragging ? 'text-primary-500' : 'text-slate-400')} />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
          <span className="text-primary-600 dark:text-primary-400">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-slate-400 mt-1 text-center">
          {description || `${accept || 'Any file'} • Max ${maxSizeMB}MB${multiple ? ' • Multiple files allowed' : ''}`}
        </p>
      </label>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <X className="w-3.5 h-3.5" /> {error}
        </p>
      )}

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, i) => (
            <li key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <FileIcon file={file} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
              </div>
              {onRemove && (
                <button onClick={() => onRemove(i)} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <X className="w-3.5 h-3.5 text-slate-500" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
