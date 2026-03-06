'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { BarChart3, Download, Copy, Layers, Settings2, Type } from 'lucide-react';

type BarcodeType = 'CODE128' | 'CODE39' | 'EAN13';

/* ────────────────────── Code 128B Encoding Table ────────────────────── */
// Each entry: [pattern (string of bar widths), value]
// Pattern is 6 elements: bar, space, bar, space, bar, space (widths 1-4)
const CODE128B_PATTERNS: string[] = [
  '212222','222122','222221','121223','121322','131222','122213','122312',
  '132212','221213','221312','231212','112232','122132','122231','113222',
  '123122','123221','223211','221132','221231','213212','223112','312131',
  '311222','321122','321221','312212','322112','322211','212123','212321',
  '232121','111323','131123','131321','112313','132113','132311','211313',
  '231113','231311','112133','112331','132131','113123','113321','133121',
  '313121','211331','231131','213113','213311','213131','311123','311321',
  '331121','312113','312311','332111','314111','221411','431111','111224',
  '111422','121124','121421','141122','141221','112214','112412','122114',
  '122411','142112','142211','241211','221114','413111','241112','134111',
  '111242','121142','121241','114212','124112','124211','411212','421112',
  '421211','212141','214121','412121','111143','111341','131141','114113',
  '114311','411113','411311','113141','114131','311141','411131','211412',
  '211214','211232','2331112',
];

const CODE128B_START = 104;
const CODE128_STOP = 106;

/* ────────────────────── Code 39 Encoding ────────────────────── */
const CODE39_CHARS: Record<string, string> = {
  '0':'101001101101','1':'110100101011','2':'101100101011','3':'110110010101',
  '4':'101001101011','5':'110100110101','6':'101100110101','7':'101001011011',
  '8':'110100101101','9':'101100101101','A':'110101001011','B':'101101001011',
  'C':'110110100101','D':'101011001011','E':'110101100101','F':'101101100101',
  'G':'101010011011','H':'110101001101','I':'101101001101','J':'101011001101',
  'K':'110101010011','L':'101101010011','M':'110110101001','N':'101011010011',
  'O':'110101101001','P':'101101101001','Q':'101010110011','R':'110101011001',
  'S':'101101011001','T':'101011011001','U':'110010101011','V':'100110101011',
  'W':'110011010101','X':'100101101011','Y':'110010110101','Z':'100110110101',
  '-':'100101011011','.':'110010101101',' ':'100110101101','$':'100100100101',
  '/':'100100101001','+':'100101001001','%':'101001001001','*':'100101101101',
};

/* ────────────────────── EAN-13 Encoding ────────────────────── */
const EAN_L: string[] = ['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011'];
const EAN_G: string[] = ['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111'];
const EAN_R: string[] = ['1110010','1100110','1101100','1000010','1011100','1001110','1010000','1000100','1001000','1110100'];
const EAN_PARITY: string[] = ['LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG','LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL'];

function encodeEAN13(digits: string): string | null {
  if (!/^\d{13}$/.test(digits)) return null;
  const d = digits.split('').map(Number);
  // Verify check digit
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += d[i] * (i % 2 === 0 ? 1 : 3);
  const check = (10 - (sum % 10)) % 10;
  if (check !== d[12]) return null;
  const parity = EAN_PARITY[d[0]];
  let bits = '101'; // start guard
  for (let i = 1; i <= 6; i++) {
    bits += parity[i - 1] === 'L' ? EAN_L[d[i]] : EAN_G[d[i]];
  }
  bits += '01010'; // center guard
  for (let i = 7; i <= 12; i++) bits += EAN_R[d[i]];
  bits += '101'; // end guard
  return bits;
}

function expandCode128Pattern(pattern: string): string {
  let bits = '';
  for (let i = 0; i < pattern.length; i++) {
    const w = parseInt(pattern[i]);
    bits += (i % 2 === 0 ? '1' : '0').repeat(w);
  }
  return bits;
}

function encodeCode128(text: string): string | null {
  if (!text) return null;
  const values: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code < 32 || code > 127) return null;
    values.push(code - 32);
  }
  // Checksum: start value + sum(pos * value)
  let checksum = CODE128B_START;
  for (let i = 0; i < values.length; i++) checksum += (i + 1) * values[i];
  checksum = checksum % 103;

  let bits = expandCode128Pattern(CODE128B_PATTERNS[CODE128B_START]);
  for (const v of values) bits += expandCode128Pattern(CODE128B_PATTERNS[v]);
  bits += expandCode128Pattern(CODE128B_PATTERNS[checksum]);
  bits += expandCode128Pattern(CODE128B_PATTERNS[CODE128_STOP]);
  return bits;
}

function encodeCode39(text: string): string | null {
  const upper = text.toUpperCase();
  for (const ch of upper) {
    if (!CODE39_CHARS[ch]) return null;
  }
  let bits = CODE39_CHARS['*'] + '0'; // start + gap
  for (const ch of upper) bits += CODE39_CHARS[ch] + '0';
  bits += CODE39_CHARS['*']; // stop
  return bits;
}

function drawBarcode(
  canvas: HTMLCanvasElement,
  bits: string,
  barWidth: number,
  height: number,
  barColor: string,
  bgColor: string,
  showText: boolean,
  label: string,
) {
  const padding = 20;
  const textHeight = showText ? 24 : 0;
  const totalWidth = bits.length * barWidth + padding * 2;
  const totalHeight = height + padding * 2 + textHeight;
  canvas.width = totalWidth;
  canvas.height = totalHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, totalWidth, totalHeight);
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] === '1') {
      ctx.fillStyle = barColor;
      ctx.fillRect(padding + i * barWidth, padding, barWidth, height);
    }
  }
  if (showText && label) {
    ctx.fillStyle = barColor;
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, totalWidth / 2, padding + height + 18);
  }
}

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';

export function BarcodeGeneratorTool() {
  const [text, setText] = useState('Hello World');
  const [barcodeType, setBarcodeType] = useState<BarcodeType>('CODE128');
  const [barWidth, setBarWidth] = useState(2);
  const [height, setHeight] = useState(120);
  const [showText, setShowText] = useState(true);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [barColor, setBarColor] = useState('#000000');
  const [batchMode, setBatchMode] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const batchContainerRef = useRef<HTMLDivElement>(null);

  const generateSingle = useCallback(
    (canvas: HTMLCanvasElement, value: string): boolean => {
      let bits: string | null = null;
      if (barcodeType === 'CODE128') bits = encodeCode128(value);
      else if (barcodeType === 'CODE39') bits = encodeCode39(value);
      else if (barcodeType === 'EAN13') bits = encodeEAN13(value);
      if (!bits) return false;
      drawBarcode(canvas, bits, barWidth, height, barColor, bgColor, showText, value);
      return true;
    },
    [barcodeType, barWidth, height, barColor, bgColor, showText],
  );

  // Single mode rendering
  useEffect(() => {
    if (batchMode) return;
    const canvas = canvasRef.current;
    if (!canvas || !text.trim()) { setError(''); return; }
    const ok = generateSingle(canvas, text.trim());
    setError(ok ? '' : `Cannot encode "${text}" with ${barcodeType}. Check input validity.`);
  }, [text, barcodeType, barWidth, height, barColor, bgColor, showText, batchMode, generateSingle]);

  // Batch mode rendering
  useEffect(() => {
    if (!batchMode || !batchContainerRef.current) return;
    const container = batchContainerRef.current;
    container.innerHTML = '';
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    let hasError = false;
    for (const line of lines) {
      const c = document.createElement('canvas');
      const ok = generateSingle(c, line);
      if (!ok) { hasError = true; continue; }
      container.appendChild(c);
    }
    setError(hasError ? 'Some values could not be encoded and were skipped.' : '');
  }, [text, barcodeType, barWidth, height, barColor, bgColor, showText, batchMode, generateSingle]);

  function downloadPNG() {
    if (batchMode) {
      // Download each canvas in batch
      const canvases = batchContainerRef.current?.querySelectorAll('canvas');
      canvases?.forEach((c, i) => {
        const a = document.createElement('a');
        a.href = (c as HTMLCanvasElement).toDataURL('image/png');
        a.download = `barcode-${i + 1}.png`;
        a.click();
      });
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `barcode-${barcodeType.toLowerCase()}.png`;
    a.click();
  }

  async function copyToClipboard() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
      if (!blob) return;
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: ignore
    }
  }

  const typeHints: Record<BarcodeType, string> = {
    CODE128: 'Supports ASCII characters 32-127 (letters, numbers, symbols)',
    CODE39: 'Supports A-Z, 0-9, space, and - . $ / + %',
    EAN13: 'Exactly 13 digits with valid check digit',
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* ─── Hero ─── */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-6 text-white shadow-lg sm:p-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            <BarChart3 className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold sm:text-3xl">Barcode Generator</h2>
        </div>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
          Generate barcodes instantly in your browser. Supports Code 128, Code 39, and EAN-13 formats.
          No data leaves your device.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* ─── Controls ─── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Barcode Type */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <Type className="h-4 w-4" /> Barcode Type
            </label>
            <select
              value={barcodeType}
              onChange={(e) => setBarcodeType(e.target.value as BarcodeType)}
              className={inputClass}
            >
              <option value="CODE128">Code 128 (Alphanumeric)</option>
              <option value="CODE39">Code 39 (A-Z, 0-9)</option>
              <option value="EAN13">EAN-13 (13 digits)</option>
            </select>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{typeHints[barcodeType]}</p>
          </div>

          {/* Input */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <BarChart3 className="h-4 w-4" /> {batchMode ? 'Values (one per line)' : 'Value to Encode'}
            </label>
            {batchMode ? (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                placeholder={'Line 1\nLine 2\nLine 3'}
                className={inputClass + ' resize-y'}
              />
            ) : (
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text or numbers"
                className={inputClass}
              />
            )}
          </div>

          {/* Options */}
          <div>
            <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <Settings2 className="h-4 w-4" /> Options
            </label>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                  <span>Bar Width</span><span>{barWidth}px</span>
                </div>
                <input type="range" min={1} max={3} step={1} value={barWidth} onChange={(e) => setBarWidth(Number(e.target.value))} className="w-full accent-primary-600" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                  <span>Height</span><span>{height}px</span>
                </div>
                <input type="range" min={50} max={200} step={10} value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full accent-primary-600" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">Bar Color</span>
                  <input type="color" value={barColor} onChange={(e) => setBarColor(e.target.value)} className="mt-1 h-9 w-full cursor-pointer rounded-lg border border-slate-200 dark:border-slate-700" />
                </div>
                <div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">Background</span>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="mt-1 h-9 w-full cursor-pointer rounded-lg border border-slate-200 dark:border-slate-700" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={showText} onChange={(e) => setShowText(e.target.checked)} className="h-4 w-4 rounded accent-primary-600" />
                Show text below barcode
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={batchMode} onChange={(e) => setBatchMode(e.target.checked)} className="h-4 w-4 rounded accent-primary-600" />
                <Layers className="h-4 w-4" /> Batch mode (multiple values)
              </label>
            </div>
          </div>
        </div>

        {/* ─── Preview & Actions ─── */}
        <div className="lg:col-span-3 space-y-5">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 min-h-[200px] flex flex-col items-center justify-center">
            {error && (
              <p className="mb-3 text-sm text-red-500 dark:text-red-400 text-center">{error}</p>
            )}
            {!batchMode && (
              <canvas
                ref={canvasRef}
                className="max-w-full"
                style={{ imageRendering: 'pixelated' }}
              />
            )}
            {batchMode && (
              <div ref={batchContainerRef} className="flex flex-col gap-4 items-center w-full overflow-x-auto [&>canvas]:max-w-full" style={{ imageRendering: 'pixelated' }} />
            )}
            {!text.trim() && (
              <p className="text-slate-400 dark:text-slate-500 text-sm">Enter a value to generate a barcode</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={downloadPNG}
              disabled={!text.trim() || !!error}
              className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-primary-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" /> Download PNG
            </button>
            {!batchMode && (
              <button
                onClick={copyToClipboard}
                disabled={!text.trim() || !!error}
                className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Copy className="h-4 w-4" /> {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
