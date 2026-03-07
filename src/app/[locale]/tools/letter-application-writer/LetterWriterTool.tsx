'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Download, Copy, Check, RotateCcw, Search, ChevronDown,
  Lock, History, Trash2, Sparkles, Info, Keyboard, X,
} from 'lucide-react';
import { TEMPLATES, CATEGORIES, type LetterTemplate } from './templates';

/* ------------------------------------------------------------------ */
/*  CONSTANTS & TYPES                                                  */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'letter-writer-history';
const MAX_HISTORY = 5;

interface HistoryItem {
  id: string;
  templateId: string;
  templateName: string;
  data: Record<string, string>;
  timestamp: number;
}

/* ------------------------------------------------------------------ */
/*  ANIMATION VARIANTS                                                 */
/* ------------------------------------------------------------------ */

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 } };
const stagger = { animate: { transition: { staggerChildren: 0.04 } } };
const item = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } };

/* ------------------------------------------------------------------ */
/*  REUSABLE COMPONENTS                                                */
/* ------------------------------------------------------------------ */

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex">
      <button type="button" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)} aria-label="More info"
        className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-blue-100 hover:text-blue-600 transition-colors">
        <Info className="w-2.5 h-2.5" />
      </button>
      <AnimatePresence>
        {show && (
          <motion.span initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 text-xs rounded-lg shadow-lg whitespace-nowrap z-50 max-w-[200px] text-center">
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <motion.button onClick={handleCopy} whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        copied
          ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
      }`}>
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : label}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export function LetterWriterTool() {
  /* --- State --- */
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  /* --- Load history --- */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, []);

  const saveHistory = useCallback((template: LetterTemplate, data: Record<string, string>) => {
    setHistory(prev => {
      const newItem: HistoryItem = {
        id: Date.now().toString(36),
        templateId: template.id,
        templateName: template.name,
        data: { ...data },
        timestamp: Date.now(),
      };
      const updated = [newItem, ...prev.filter(h => h.templateId !== template.id || JSON.stringify(h.data) !== JSON.stringify(data))].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const loadFromHistory = useCallback((item: HistoryItem) => {
    const template = TEMPLATES.find(t => t.id === item.templateId);
    if (template) {
      setSelectedTemplate(template);
      setFormData(item.data);
      setShowHistory(false);
    }
  }, []);

  /* --- Filtered templates --- */
  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter(t => {
      const matchCat = selectedCategory === 'all' || t.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || t.name.toLowerCase().includes(q) || t.nameHi.includes(q) || t.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  /* --- Form handlers --- */
  const setField = useCallback((key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const generatedText = useMemo(() => {
    if (!selectedTemplate) return '';
    return selectedTemplate.generate(formData);
  }, [selectedTemplate, formData]);

  const tryExample = useCallback(() => {
    if (!selectedTemplate) return;
    const example: Record<string, string> = {};
    selectedTemplate.fields.forEach(f => {
      if (f.type === 'date') {
        example[f.key] = new Date().toISOString().slice(0, 10);
      } else if (f.type === 'select' && f.options?.length) {
        example[f.key] = f.options[0];
      } else {
        example[f.key] = f.placeholder;
      }
    });
    setFormData(example);
  }, [selectedTemplate]);

  const resetForm = useCallback(() => {
    setFormData({});
  }, []);

  const goBack = useCallback(() => {
    setSelectedTemplate(null);
    setFormData({});
  }, []);

  /* --- Downloads --- */
  const downloadTxt = useCallback(() => {
    if (!generatedText || !selectedTemplate) return;
    saveHistory(selectedTemplate, formData);
    const blob = new Blob([generatedText], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${selectedTemplate.name.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [generatedText, selectedTemplate, formData, saveHistory]);

  const downloadPDF = useCallback(async () => {
    if (!generatedText || !selectedTemplate) return;
    saveHistory(selectedTemplate, formData);
    const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await doc.embedFont(StandardFonts.TimesRomanBold);

    const pw = 595.28, ph = 841.89, m = 60;
    const maxW = pw - 2 * m;
    const fs = 12, lh = fs * 1.6;

    const lines = generatedText.split('\n');
    let page = doc.addPage([pw, ph]);
    let y = ph - m;
    const addPage = () => { page = doc.addPage([pw, ph]); y = ph - m; };

    for (const rawLine of lines) {
      const line = rawLine.trimEnd();
      if (y < m + lh) addPage();
      if (line.trim() === '') { y -= lh * 0.5; continue; }

      const isSubject = line.trim().startsWith('Subject:');
      const useFont = isSubject ? boldFont : font;

      const words = line.split(' ');
      let cur = '';
      for (const w of words) {
        const test = cur ? cur + ' ' + w : w;
        if (useFont.widthOfTextAtSize(test, fs) > maxW && cur) {
          if (y < m + lh) addPage();
          page.drawText(cur, { x: m, y, size: fs, font: useFont, color: rgb(0.1, 0.1, 0.1) });
          y -= lh;
          cur = w;
        } else cur = test;
      }
      if (cur) {
        if (y < m + lh) addPage();
        page.drawText(cur, { x: m, y, size: fs, font: useFont, color: rgb(0.1, 0.1, 0.1) });
        y -= lh;
      }
    }

    const pdfBytes = await doc.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${selectedTemplate.name.replace(/\s+/g, '-')}.pdf`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [generatedText, selectedTemplate, formData, saveHistory]);

  /* --- Keyboard shortcuts --- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (generatedText) downloadPDF();
      }
      if (e.key === 'Escape') {
        if (selectedTemplate) goBack();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [generatedText, downloadPDF, selectedTemplate, goBack]);

  /* ---------------------------------------------------------------- */
  /*  RENDER — Template Selector                                       */
  /* ---------------------------------------------------------------- */

  if (!selectedTemplate) {
    return (
      <div className="space-y-5">
        {/* Hero */}
        <div className="rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 text-white p-5 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">Letter & Application Writer</h2>
              <p className="text-violet-100 text-xs sm:text-sm mt-0.5 leading-relaxed">
                Generate professionally formatted letters for employment, banking, school, and official purposes. Just fill in the blanks.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-violet-200">
            <Lock className="w-3 h-3" />
            <span>100% private — all data stays in your browser</span>
          </div>
        </div>

        {/* Search + History */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search letters... e.g. leave, bank, resignation"
              aria-label="Search letter templates"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-100 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
            />
          </div>
          <div className="flex gap-2">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowHistory(!showHistory)}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
              {history.length > 0 && <span className="w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] flex items-center justify-center">{history.length}</span>}
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowShortcuts(!showShortcuts)}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              aria-label="Keyboard shortcuts">
              <Keyboard className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <AnimatePresence>
          {showShortcuts && (
            <motion.div {...fadeIn} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 text-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700 dark:text-slate-300">Keyboard Shortcuts</span>
                <button onClick={() => setShowShortcuts(false)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="flex gap-6 text-xs text-slate-500 dark:text-slate-400">
                <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-600 rounded border text-[10px]">Ctrl+Enter</kbd> Download PDF</span>
                <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-600 rounded border text-[10px]">Esc</kbd> Go back</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Dropdown */}
        <AnimatePresence>
          {showHistory && history.length > 0 && (
            <motion.div {...fadeIn} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Recent Letters</span>
                <button onClick={clearHistory} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Clear All
                </button>
              </div>
              {history.map(h => (
                <motion.button key={h.id} onClick={() => loadFromHistory(h)} whileHover={{ backgroundColor: 'rgba(139,92,246,0.05)' }}
                  className="w-full flex items-center justify-between px-4 py-3 text-left border-b border-slate-50 dark:border-slate-700/50 last:border-0 transition">
                  <div>
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{h.templateName}</div>
                    <div className="text-xs text-slate-400">{new Date(h.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 -rotate-90" />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
          {CATEGORIES.map(cat => (
            <motion.button key={cat.id} whileTap={{ scale: 0.95 }} onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}>
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Template Grid */}
        <motion.div className="grid sm:grid-cols-2 gap-3" variants={stagger} initial="initial" animate="animate">
          {filteredTemplates.length === 0 ? (
            <div className="sm:col-span-2 text-center py-12 text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No letters found. Try a different search.</p>
            </div>
          ) : (
            filteredTemplates.map(t => (
              <motion.button key={t.id} variants={item} onClick={() => { setSelectedTemplate(t); setFormData({}); }}
                whileHover={{ y: -2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                whileTap={{ scale: 0.98 }}
                className="group text-left p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-violet-300 dark:hover:border-violet-500 transition-all">
                <div className="flex items-start gap-3">
                  <span className="text-2xl" role="img" aria-label={t.name}>{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors">
                      {t.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{t.description}</div>
                    <div className="text-[10px] text-violet-600 dark:text-violet-400 mt-1.5 font-medium uppercase tracking-wider">
                      {CATEGORIES.find(c => c.id === t.category)?.label}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))
          )}
        </motion.div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  RENDER — Editor                                                  */
  /* ---------------------------------------------------------------- */

  const hasContent = Object.values(formData).some(v => v.trim());

  return (
    <motion.div className="space-y-5" {...fadeIn}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <motion.button onClick={goBack} whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
          <ChevronDown className="w-4 h-4 rotate-90" /> All Letters
        </motion.button>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Lock className="w-3 h-3" /> Private
        </div>
      </div>

      {/* Template Info */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
        <span className="text-3xl">{selectedTemplate.icon}</span>
        <div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{selectedTemplate.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{selectedTemplate.description}</p>
        </div>
      </div>

      {/* Actions Row */}
      <div className="flex flex-wrap gap-2">
        <motion.button onClick={tryExample} whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-sm font-medium hover:bg-violet-100 dark:hover:bg-violet-900/50 transition">
          <Sparkles className="w-3.5 h-3.5" /> Try Example
        </motion.button>
        {hasContent && (
          <motion.button onClick={resetForm} whileTap={{ scale: 0.95 }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-red-600 transition">
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </motion.button>
        )}
      </div>

      {/* Two-Column Layout */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Left: Form */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-violet-600" /> Fill Details
          </h4>
          <motion.div className="space-y-3" variants={stagger} initial="initial" animate="animate">
            {selectedTemplate.fields.map(field => (
              <motion.div key={field.key} variants={item}>
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-400 text-xs">*</span>}
                  {field.hint && <Tooltip text={field.hint} />}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.key] || ''} onChange={e => setField(field.key, e.target.value)}
                    placeholder={field.placeholder} rows={3}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-100 px-3 py-2.5 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition resize-none"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.key] || ''} onChange={e => setField(field.key, e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-100 px-3 py-2.5 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition">
                    <option value="">Select {field.label}...</option>
                    {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    type={field.type} value={formData[field.key] || ''}
                    onChange={e => setField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-100 px-3 py-2.5 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right: Preview */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-violet-600" /> Live Preview
          </h4>

          {/* Output */}
          <div ref={outputRef}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 min-h-[300px] max-h-[60vh] overflow-y-auto">
            <pre className="whitespace-pre-wrap font-serif text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 break-words">
              {generatedText || (
                <span className="text-slate-300 dark:text-slate-600 italic">
                  Start filling the form to see your letter here...
                </span>
              )}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <motion.button onClick={downloadPDF} whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition shadow-sm">
              <Download className="w-4 h-4" /> Download PDF
            </motion.button>
            <motion.button onClick={downloadTxt} whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition">
              <FileText className="w-4 h-4" /> TXT
            </motion.button>
            <CopyButton text={generatedText} />
          </div>

          {/* Keyboard hint */}
          <div className="text-[10px] text-slate-400 flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">Ctrl+Enter</kbd>
            <span>Download PDF</span>
            <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 ml-2">Esc</kbd>
            <span>Back</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
