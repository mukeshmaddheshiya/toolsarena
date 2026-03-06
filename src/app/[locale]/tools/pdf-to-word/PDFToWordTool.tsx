'use client';
import { useState, useEffect, useRef } from 'react';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { DownloadButton } from '@/components/common/DownloadButton';
import { formatFileSize } from '@/lib/utils';
import { Loader2, FileText, CheckCircle2, FileWarning, RotateCcw, Eye, EyeOff, Shield, Zap, Globe } from 'lucide-react';

interface PageText {
  pageNum: number;
  text: string;
  charCount: number;
}

type ConversionStep = 'idle' | 'reading' | 'extracting' | 'generating' | 'done';

const STEP_LABELS: Record<ConversionStep, string> = {
  idle: '',
  reading: 'Reading PDF file...',
  extracting: 'Extracting text from pages...',
  generating: 'Generating Word document...',
  done: 'Conversion complete!',
};

export function PDFToWordTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<ConversionStep>('idle');
  const [progress, setProgress] = useState(0);
  const [pages, setPages] = useState<PageText[]>([]);
  const [docxBlob, setDocxBlob] = useState<Blob | null>(null);
  const [error, setError] = useState('');
  const [pdfJsReady, setPdfJsReady] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window as any).pdfjsLib) { setPdfJsReady(true); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      setPdfJsReady(true);
    };
    document.head.appendChild(script);
  }, []);

  function handleFiles(files: File[]) {
    setFile(files[0]);
    setPages([]);
    setDocxBlob(null);
    setError('');
    setStep('idle');
    setProgress(0);
    setTotalPages(0);
  }

  async function convert() {
    if (!file || !pdfJsReady) return;
    setLoading(true);
    setError('');
    setPages([]);
    setDocxBlob(null);

    try {
      // Step 1: Read PDF
      setStep('reading');
      setProgress(5);
      const pdfjsLib = (window as any).pdfjsLib;
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdfDoc.numPages;
      setTotalPages(numPages);
      setProgress(15);

      // Step 2: Extract text
      setStep('extracting');
      const extractedPages: PageText[] = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        const items = textContent.items as { str: string; hasEOL?: boolean; transform?: number[] }[];

        let pageText = '';
        let lastY: number | null = null;

        for (const item of items) {
          if ('str' in item) {
            const y = item.transform ? item.transform[5] : null;
            if (lastY !== null && y !== null && Math.abs(lastY - y) > 2) {
              pageText += '\n';
            }
            pageText += item.str;
            lastY = y;
          }
        }

        extractedPages.push({
          pageNum,
          text: pageText.trim(),
          charCount: pageText.trim().length,
        });

        setProgress(15 + Math.round((pageNum / numPages) * 60));
      }

      setPages(extractedPages);

      // Step 3: Generate DOCX
      setStep('generating');
      setProgress(80);

      const docx = await import('docx');
      const { Document, Paragraph, TextRun, PageBreak, AlignmentType, Packer, HeadingLevel } = docx;

      const children: InstanceType<typeof Paragraph>[] = [];

      extractedPages.forEach((pg, idx) => {
        // Page break between pages
        if (idx > 0) {
          children.push(new Paragraph({ children: [new PageBreak()] }));
        }

        const lines = pg.text.split('\n');

        lines.forEach(line => {
          if (!line.trim()) {
            children.push(new Paragraph({ children: [] }));
            return;
          }

          // Detect heading-like lines (short, all caps or has significant uppercase)
          const isHeading = line.length > 0 && line.length < 80 && line === line.toUpperCase() && /[A-Z]{2,}/.test(line);
          // Detect sub-heading (Title Case, short)
          const isSubHeading = !isHeading && line.length < 100 && /^[A-Z][a-z]/.test(line) && !line.endsWith('.') && !line.endsWith(',');

          if (isHeading) {
            children.push(new Paragraph({
              children: [new TextRun({ text: line, bold: true, size: 32, font: 'Calibri' })],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 240, after: 120 },
            }));
          } else if (isSubHeading && line.length < 60) {
            children.push(new Paragraph({
              children: [new TextRun({ text: line, bold: true, size: 28, font: 'Calibri' })],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            }));
          } else {
            children.push(new Paragraph({
              children: [new TextRun({ text: line, size: 24, font: 'Calibri' })],
              alignment: AlignmentType.LEFT,
              spacing: { after: 80, line: 276 },
            }));
          }
        });
      });

      setProgress(90);

      const doc = new Document({
        sections: [{
          properties: {
            page: {
              margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
            },
          },
          children,
        }],
        creator: 'ToolsArena.in - PDF to Word Converter',
        description: `Converted from ${file.name}`,
      });

      const blob = await Packer.toBlob(doc);
      setDocxBlob(blob);
      setStep('done');
      setProgress(100);

      // Scroll to result
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    } catch (e) {
      setError(`Failed to convert: ${(e as Error).message}. Ensure the file is a valid, non-encrypted PDF.`);
      setStep('idle');
    } finally {
      setLoading(false);
    }
  }

  function download() {
    if (!docxBlob) return;
    const name = file?.name.replace(/\.pdf$/i, '') || 'converted';
    const url = URL.createObjectURL(docxBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}-toolsarena.docx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    setFile(null);
    setPages([]);
    setDocxBlob(null);
    setError('');
    setStep('idle');
    setProgress(0);
    setTotalPages(0);
  }

  const totalChars = pages.reduce((sum, p) => sum + p.charCount, 0);
  const totalWords = pages.reduce((sum, p) => sum + (p.text ? p.text.split(/\s+/).filter(Boolean).length : 0), 0);

  return (
    <div className="space-y-6">
      {/* Feature badges */}
      {!file && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Shield, label: '100% Private', desc: 'Files never leave your browser' },
            { icon: Zap, label: 'Instant Convert', desc: 'No upload, no waiting' },
            { icon: Globe, label: 'Works Everywhere', desc: 'No software needed' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <Icon className="w-5 h-5 text-primary-700 dark:text-primary-400 mb-1.5" />
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{label}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {!file ? (
        <FileDropzone
          accept=".pdf,application/pdf"
          multiple={false}
          maxSizeMB={50}
          onFiles={handleFiles}
          description="Drop your PDF here or click to browse — max 50MB"
        />
      ) : (
        <div className="space-y-4">
          {/* File info bar */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">{file.name}</p>
                <p className="text-xs text-slate-500">{formatFileSize(file.size)}{totalPages > 0 ? ` · ${totalPages} page${totalPages > 1 ? 's' : ''}` : ''}</p>
              </div>
            </div>
            <button onClick={reset} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
              Change file
            </button>
          </div>

          {/* Progress bar */}
          {loading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary-700" />
                  {STEP_LABELS[step]}
                </p>
                <span className="text-xs font-bold text-primary-700 dark:text-primary-400">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-700 to-primary-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Convert button */}
          {!docxBlob && !loading && (
            <button
              onClick={convert}
              disabled={!pdfJsReady}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-primary-800 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm shadow-lg shadow-primary-800/20"
            >
              <FileText className="w-4 h-4" />
              {!pdfJsReady ? 'Loading PDF engine...' : 'Convert to Word Document'}
            </button>
          )}

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <FileWarning className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-300">Conversion Failed</p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Result section */}
          {docxBlob && (
            <div ref={resultRef} className="space-y-4">
              {/* Success card */}
              <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-bold text-green-800 dark:text-green-300 text-base">Conversion Complete!</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                        <span className="text-xs text-green-600 dark:text-green-400">{pages.length} page{pages.length > 1 ? 's' : ''}</span>
                        <span className="text-xs text-green-600 dark:text-green-400">{totalWords.toLocaleString()} words</span>
                        <span className="text-xs text-green-600 dark:text-green-400">{totalChars.toLocaleString()} characters</span>
                        <span className="text-xs text-green-600 dark:text-green-400">{formatFileSize(docxBlob.size)}</span>
                      </div>
                    </div>
                  </div>
                  <DownloadButton onClick={download} label="Download .docx" />
                </div>
              </div>

              {/* Text preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Extracted Text Preview</p>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {showPreview ? 'Hide' : 'Show'} preview
                  </button>
                </div>

                {showPreview && (
                  <div className="max-h-[28rem] overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                    {pages.map(pg => (
                      <div key={pg.pageNum} className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-md">
                            Page {pg.pageNum}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {pg.charCount.toLocaleString()} chars
                          </span>
                        </div>
                        {pg.text ? (
                          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-[system-ui]">
                            {pg.text.length > 600 ? pg.text.slice(0, 600) + '...' : pg.text}
                          </p>
                        ) : (
                          <p className="text-sm text-slate-400 italic">No text found on this page (may be an image-based page)</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Convert another */}
              <button
                onClick={reset}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium rounded-xl transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Convert Another PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
