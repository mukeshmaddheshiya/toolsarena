'use client';
import { useState, useCallback } from 'react';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { downloadBlob } from '@/lib/utils';
import { FileText, Download, RotateCcw, Loader2, CheckCircle } from 'lucide-react';

interface ConversionResult {
  blob: Blob;
  filename: string;
  pageCount: number;
  wordCount: number;
}

type PageSize = 'A4' | 'Letter' | 'Legal';
type MarginSize = 'narrow' | 'normal' | 'wide';

const PAGE_DIMS: Record<PageSize, { w: number; h: number }> = {
  A4:     { w: 595.28, h: 841.89 },
  Letter: { w: 612,    h: 792 },
  Legal:  { w: 612,    h: 1008 },
};

const MARGINS: Record<MarginSize, number> = {
  narrow: 36,
  normal: 72,
  wide:   108,
};

async function convertDocxToPdf(
  file: File,
  options: { pageSize: PageSize; margin: MarginSize; fontSize: number; lineSpacing: number }
): Promise<ConversionResult> {
  const [mammoth, { PDFDocument, StandardFonts, rgb }] = await Promise.all([
    import('mammoth'),
    import('pdf-lib'),
  ]);

  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const htmlStr = result.value;

  // Parse the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlStr, 'text/html');

  // Extract blocks with formatting info
  interface Block {
    text: string;
    isBold: boolean;
    isItalic: boolean;
    headingLevel: 0 | 1 | 2 | 3;
    isListItem: boolean;
    listBullet: string;
    indent: number;
  }

  function getTextRuns(el: Element): { text: string; bold: boolean; italic: boolean }[] {
    const runs: { text: string; bold: boolean; italic: boolean }[] = [];
    el.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        if (text) runs.push({ text, bold: false, italic: false });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = (node as Element).tagName.toLowerCase();
        const isBold = ['strong', 'b'].includes(tag);
        const isItalic = ['em', 'i'].includes(tag);
        const sub = getTextRuns(node as Element);
        sub.forEach(r => runs.push({ text: r.text, bold: r.bold || isBold, italic: r.italic || isItalic }));
      }
    });
    return runs;
  }

  const blocks: Block[] = [];
  let wordCount = 0;

  doc.body.querySelectorAll('h1, h2, h3, p, li, ul, ol, blockquote, br').forEach(el => {
    const tag = el.tagName.toLowerCase();
    const textContent = el.textContent?.trim() || '';
    if (!textContent && tag !== 'br') return;

    wordCount += (textContent.match(/\S+/g) || []).length;

    const headingMap: Record<string, 0 | 1 | 2 | 3> = { h1: 1, h2: 2, h3: 3 };
    const headingLevel = (headingMap[tag] || 0) as 0 | 1 | 2 | 3;

    const runs = getTextRuns(el);
    const isBold = headingLevel > 0 || runs.some(r => r.bold);
    const isItalic = runs.some(r => r.italic);
    const isListItem = tag === 'li';
    const listBullet = el.closest('ol') ? '•' : '•';
    const indent = isListItem ? 1 : 0;

    if (tag === 'br' || !textContent) {
      blocks.push({ text: '', isBold: false, isItalic: false, headingLevel: 0, isListItem: false, listBullet: '', indent: 0 });
      return;
    }

    blocks.push({ text: textContent, isBold, isItalic, headingLevel, isListItem, listBullet, indent });
  });

  // Create PDF
  const pdfDoc = await PDFDocument.create();
  const dims = PAGE_DIMS[options.pageSize];
  const margin = MARGINS[options.margin];
  const contentW = dims.w - margin * 2;

  const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const fontBoldItalic = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);

  const baseFontSize = options.fontSize;
  const lineH = baseFontSize * options.lineSpacing;

  let page = pdfDoc.addPage([dims.w, dims.h]);
  let y = dims.h - margin;
  let pageCount = 1;

  function newPage() {
    page = pdfDoc.addPage([dims.w, dims.h]);
    y = dims.h - margin;
    pageCount++;
  }

  function ensureSpace(needed: number) {
    if (y - needed < margin) newPage();
  }

  function wrapText(text: string, font: typeof fontNormal, fontSize: number, maxWidth: number): string[] {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let current = '';
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(test, fontSize) <= maxWidth) {
        current = test;
      } else {
        if (current) lines.push(current);
        // Handle word longer than line
        if (font.widthOfTextAtSize(word, fontSize) > maxWidth) {
          let partial = '';
          for (const char of word) {
            if (font.widthOfTextAtSize(partial + char, fontSize) <= maxWidth) {
              partial += char;
            } else {
              lines.push(partial);
              partial = char;
            }
          }
          current = partial;
        } else {
          current = word;
        }
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  for (const block of blocks) {
    if (!block.text) {
      y -= lineH * 0.5;
      if (y < margin) newPage();
      continue;
    }

    const headingSizes: Record<number, number> = { 1: baseFontSize * 1.8, 2: baseFontSize * 1.4, 3: baseFontSize * 1.2, 0: baseFontSize };
    const fontSize = headingSizes[block.headingLevel];
    const font = block.isBold && block.isItalic ? fontBoldItalic
      : block.isBold ? fontBold
      : block.isItalic ? fontItalic
      : fontNormal;

    const indentPx = block.indent * 20;
    const effectiveWidth = contentW - indentPx;
    const x = margin + indentPx;
    const prefix = block.isListItem ? '• ' : '';
    const fullText = prefix + block.text;

    // Add spacing before headings
    if (block.headingLevel > 0) {
      y -= lineH * 0.5;
      if (y < margin) newPage();
    }

    const lines = wrapText(fullText, font, fontSize, effectiveWidth);
    ensureSpace(lines.length * lineH * options.lineSpacing);

    for (const line of lines) {
      if (y - fontSize < margin) newPage();
      page.drawText(line, {
        x, y: y - fontSize,
        size: fontSize,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });
      y -= fontSize * options.lineSpacing;
    }

    // Add spacing after headings
    if (block.headingLevel > 0) {
      y -= lineH * 0.3;
    }
  }

  const pdfBytes = await pdfDoc.save();
  return {
    blob: new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' }),
    filename: file.name.replace(/\.docx?$/, '') + '.pdf',
    pageCount,
    wordCount,
  };
}

export function WordToPdfTool() {
  const [pageSize, setPageSize] = useState<PageSize>('A4');
  const [margin, setMargin] = useState<MarginSize>('normal');
  const [fontSize, setFontSize] = useState(11);
  const [lineSpacing, setLineSpacing] = useState(1.4);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const processFile = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);
    setFileName(file.name);
    setProgress('Loading document…');
    try {
      setProgress('Parsing Word document…');
      const res = await convertDocxToPdf(file, { pageSize, margin, fontSize, lineSpacing });
      setProgress('Finalizing PDF…');
      setResult(res);
    } catch (e) {
      setError(`Conversion failed: ${(e as Error).message}. Make sure it is a valid .docx file.`);
    } finally {
      setLoading(false);
      setProgress('');
    }
  }, [pageSize, margin, fontSize, lineSpacing]);

  function reset() { setResult(null); setError(''); setFileName(''); }

  const selectClass = 'w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500';

  return (
    <div className="space-y-5">
      {/* Settings */}
      <div className="grid sm:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Page Size</label>
          <select value={pageSize} onChange={e => setPageSize(e.target.value as PageSize)} className={selectClass}>
            <option value="A4">A4 (210 × 297 mm)</option>
            <option value="Letter">US Letter (8.5 × 11 in)</option>
            <option value="Legal">US Legal (8.5 × 14 in)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Margins</label>
          <select value={margin} onChange={e => setMargin(e.target.value as MarginSize)} className={selectClass}>
            <option value="narrow">Narrow (0.5 in)</option>
            <option value="normal">Normal (1 in)</option>
            <option value="wide">Wide (1.5 in)</option>
          </select>
        </div>
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Font Size</label>
            <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{fontSize}pt</span>
          </div>
          <input type="range" min={8} max={18} step={1} value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800" />
          <div className="flex justify-between text-xs text-slate-400 mt-1"><span>8pt</span><span>11pt (default)</span><span>18pt</span></div>
        </div>
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Line Spacing</label>
            <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{lineSpacing}×</span>
          </div>
          <input type="range" min={1.0} max={2.5} step={0.1} value={lineSpacing} onChange={e => setLineSpacing(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800" />
          <div className="flex justify-between text-xs text-slate-400 mt-1"><span>Single</span><span>1.4× (default)</span><span>Double</span></div>
        </div>
      </div>

      {/* Format note */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-700 dark:text-blue-300">
        <FileText className="w-4 h-4 shrink-0 mt-0.5" />
        <span>Supports <strong>.docx</strong> files. Preserves headings (H1–H3), bold, italic, paragraphs, and bullet lists. Complex tables and images are converted to text.</span>
      </div>

      {/* Upload */}
      {!result && !loading && (
        <FileDropzone
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          multiple={false}
          maxSizeMB={20}
          onFiles={processFile}
          description=".docx files only — max 20MB — 100% processed locally in your browser"
        />
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-12">
          <Loader2 className="w-10 h-10 text-primary-700 animate-spin" />
          <p className="text-sm text-slate-600 dark:text-slate-400">{progress}</p>
          <p className="text-xs text-slate-400">{fileName}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          <button onClick={reset} className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:underline">Try another file →</button>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-green-800 dark:text-green-200">{result.filename}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-0.5">
                {result.pageCount} page{result.pageCount !== 1 ? 's' : ''} · ~{result.wordCount.toLocaleString()} words · {(result.blob.size / 1024).toFixed(0)} KB
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Page Size', value: pageSize },
              { label: 'Pages', value: result.pageCount },
              { label: 'File Size', value: `${(result.blob.size / 1024).toFixed(0)} KB` },
            ].map(s => (
              <div key={s.label} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100">{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => downloadBlob(result.blob, result.filename)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-800 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors">
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button onClick={reset} className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors">
              <RotateCcw className="w-4 h-4" /> Convert Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
