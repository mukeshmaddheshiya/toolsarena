'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Download, RotateCcw, FileCode, Eye, Printer } from 'lucide-react';

type PageSize = 'a4' | 'letter' | 'legal';
type Orientation = 'portrait' | 'landscape';

const PAGE_SIZES: Record<PageSize, { label: string; width: number; height: number }> = {
  a4: { label: 'A4', width: 595.28, height: 841.89 },
  letter: { label: 'Letter', width: 612, height: 792 },
  legal: { label: 'Legal', width: 612, height: 1008 },
};

export function HtmlToPdfTool() {
  const [htmlCode, setHtmlCode] = useState('');
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [generating, setGenerating] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';
  const selectClass = 'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';

  const handleFileUpload = useCallback((file: File) => {
    if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) setHtmlCode(text);
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handlePrint = () => {
    const iframe = iframeRef.current;
    if (!iframe || !htmlCode) return;
    try {
      iframe.contentWindow?.print();
    } catch {
      alert('Print failed. Please try the Download PDF option instead.');
    }
  };

  const handleDownloadPdf = async () => {
    if (!htmlCode) return;
    setGenerating(true);

    try {
      const { default: jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas-pro')).default;

      // Create a temporary container with proper dimensions
      const size = PAGE_SIZES[pageSize];
      const pxWidth = orientation === 'portrait' ? size.width : size.height;
      const pxHeight = orientation === 'portrait' ? size.height : size.width;

      const container = document.createElement('div');
      container.style.width = `${pxWidth}px`;
      container.style.minHeight = `${pxHeight}px`;
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.background = 'white';
      container.style.color = 'black';
      container.style.padding = '40px';
      container.style.boxSizing = 'border-box';

      // Create a shadow DOM to isolate styles
      const shadowRoot = container.attachShadow({ mode: 'open' });
      const innerDiv = document.createElement('div');
      innerDiv.innerHTML = htmlCode;
      shadowRoot.appendChild(innerDiv);

      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: pxWidth,
      });

      document.body.removeChild(container);

      const imgData = canvas.toDataURL('image/png');
      const pdfOrientation = orientation === 'portrait' ? 'p' : 'l';
      const pdf = new jsPDF({
        orientation: pdfOrientation,
        unit: 'pt',
        format: pageSize,
      });

      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const imgW = canvas.width;
      const imgH = canvas.height;
      const ratio = pdfW / imgW;
      const scaledH = imgH * ratio;

      // Handle multi-page content
      let yOffset = 0;
      let pageNum = 0;
      while (yOffset < scaledH) {
        if (pageNum > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -yOffset, pdfW, scaledH);
        yOffset += pdfH;
        pageNum++;
      }

      pdf.save(fileName ? fileName.replace(/\.(html|htm)$/i, '.pdf') : 'converted.pdf');
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. Try the Print to PDF option instead.');
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = () => {
    setHtmlCode('');
    setFileName('');
    setPageSize('a4');
    setOrientation('portrait');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const iframeSrcDoc = htmlCode
    ? `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:16px;font-family:system-ui,-apple-system,sans-serif;}</style></head><body>${htmlCode}</body></html>`
    : '';

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: HTML Input */}
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Paste HTML Code</label>
            <textarea
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              placeholder="<html>\n  <body>\n    <h1>Hello World</h1>\n    <p>Paste your HTML here...</p>\n  </body>\n</html>"
              className="w-full h-64 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100 resize-y"
              spellCheck={false}
            />
          </div>

          {/* File Upload */}
          <div>
            <label className={labelClass}>Or Upload an HTML File</label>
            <div
              ref={dropRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-12 text-center cursor-pointer hover:border-primary-500 transition-colors"
            >
              <Upload className="w-8 h-8 mx-auto mb-3 text-slate-400 dark:text-slate-500" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {fileName ? (
                  <span className="flex items-center justify-center gap-2">
                    <FileCode className="w-4 h-4" />
                    {fileName}
                  </span>
                ) : (
                  <>
                    Drag & drop an <strong>.html</strong> file here, or <span className="text-primary-600 dark:text-primary-400 font-medium">click to browse</span>
                  </>
                )}
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".html,.htm"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Page Size</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as PageSize)}
                className={selectClass}
              >
                {Object.entries(PAGE_SIZES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Orientation</label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as Orientation)}
                className={selectClass}
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handlePrint}
              disabled={!htmlCode}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print to PDF
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={!htmlCode || generating}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4" />
              {generating ? 'Generating...' : 'Download PDF'}
            </button>
            {htmlCode && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Right: Live Preview */}
        <div>
          <label className={labelClass}>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> Live Preview
            </span>
          </label>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800" style={{ minHeight: '400px' }}>
            {htmlCode ? (
              <iframe
                ref={iframeRef}
                srcDoc={iframeSrcDoc}
                title="HTML Preview"
                className="w-full border-0"
                style={{ minHeight: '400px', height: '100%' }}
                sandbox="allow-same-origin allow-scripts allow-modals"
              />
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px] text-slate-400 dark:text-slate-500 text-sm">
                <div className="text-center">
                  <FileCode className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>Paste HTML code or upload a file to see a preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 text-xs text-blue-800 dark:text-blue-300">
        <strong>Privacy First:</strong> Your HTML code is processed entirely in your browser. Nothing is uploaded to any server. Use &quot;Print to PDF&quot; for the best quality (uses your browser&apos;s built-in PDF engine) or &quot;Download PDF&quot; for a direct file download.
      </div>
    </div>
  );
}
