'use client';
import { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */
type AngleUnit = 'deg' | 'rad';

interface HistoryEntry {
  expression: string;
  result: string;
}

/* ------------------------------------------------------------------ */
/*  MATH HELPERS                                                       */
/* ------------------------------------------------------------------ */
const toRad = (v: number, unit: AngleUnit) => (unit === 'deg' ? (v * Math.PI) / 180 : v);
const fromRad = (v: number, unit: AngleUnit) => (unit === 'deg' ? (v * 180) / Math.PI : v);

function factorial(n: number): number {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity;
  let result = 1;
  for (let i = 2; i <= Math.floor(n); i++) result *= i;
  return result;
}

/* ------------------------------------------------------------------ */
/*  SAFE EVAL — no eval(), uses a simple expression parser             */
/* ------------------------------------------------------------------ */
function tokenize(expr: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < expr.length) {
    if (' ' === expr[i]) { i++; continue; }
    // Number (including decimals, negative after operator)
    if (/[0-9.]/.test(expr[i]) || (expr[i] === '-' && (tokens.length === 0 || /[(\+\-\*\/\^%,]/.test(tokens[tokens.length - 1])))) {
      let num = '';
      if (expr[i] === '-') { num += '-'; i++; }
      while (i < expr.length && /[0-9.eE]/.test(expr[i])) { num += expr[i]; i++; }
      tokens.push(num);
    } else if (/[a-zA-Zπ]/.test(expr[i])) {
      let name = '';
      while (i < expr.length && /[a-zA-Zπ⁻¹]/.test(expr[i])) { name += expr[i]; i++; }
      tokens.push(name);
    } else {
      tokens.push(expr[i]);
      i++;
    }
  }
  return tokens;
}

function parseExpression(tokens: string[], pos: { i: number }, angleUnit: AngleUnit): number {
  let left = parseTerm(tokens, pos, angleUnit);
  while (pos.i < tokens.length && (tokens[pos.i] === '+' || tokens[pos.i] === '-')) {
    const op = tokens[pos.i]; pos.i++;
    const right = parseTerm(tokens, pos, angleUnit);
    left = op === '+' ? left + right : left - right;
  }
  return left;
}

function parseTerm(tokens: string[], pos: { i: number }, angleUnit: AngleUnit): number {
  let left = parsePower(tokens, pos, angleUnit);
  while (pos.i < tokens.length && (tokens[pos.i] === '*' || tokens[pos.i] === '/' || tokens[pos.i] === '%')) {
    const op = tokens[pos.i]; pos.i++;
    const right = parsePower(tokens, pos, angleUnit);
    if (op === '*') left *= right;
    else if (op === '/') left /= right;
    else left %= right;
  }
  return left;
}

function parsePower(tokens: string[], pos: { i: number }, angleUnit: AngleUnit): number {
  let base = parseUnary(tokens, pos, angleUnit);
  while (pos.i < tokens.length && tokens[pos.i] === '^') {
    pos.i++;
    const exp = parseUnary(tokens, pos, angleUnit);
    base = Math.pow(base, exp);
  }
  return base;
}

function parseUnary(tokens: string[], pos: { i: number }, angleUnit: AngleUnit): number {
  if (pos.i < tokens.length && tokens[pos.i] === '-') {
    pos.i++;
    return -parseAtom(tokens, pos, angleUnit);
  }
  if (pos.i < tokens.length && tokens[pos.i] === '+') {
    pos.i++;
  }
  return parseAtom(tokens, pos, angleUnit);
}

function parseAtom(tokens: string[], pos: { i: number }, angleUnit: AngleUnit): number {
  const t = tokens[pos.i];
  if (t === undefined) return NaN;

  // Parenthesized expression
  if (t === '(') {
    pos.i++;
    const val = parseExpression(tokens, pos, angleUnit);
    if (tokens[pos.i] === ')') pos.i++;
    return val;
  }

  // Number
  if (/^-?[0-9.]/.test(t)) {
    pos.i++;
    return parseFloat(t);
  }

  // Constants
  if (t === 'π' || t === 'pi') { pos.i++; return Math.PI; }
  if (t === 'e') { pos.i++; return Math.E; }

  // Functions
  const funcName = t.toLowerCase();
  pos.i++;
  // Expect '(' after function
  if (tokens[pos.i] === '(') {
    pos.i++;
    const arg = parseExpression(tokens, pos, angleUnit);
    // Handle two-arg functions
    let arg2: number | undefined;
    if (tokens[pos.i] === ',') {
      pos.i++;
      arg2 = parseExpression(tokens, pos, angleUnit);
    }
    if (tokens[pos.i] === ')') pos.i++;

    switch (funcName) {
      case 'sin': return Math.sin(toRad(arg, angleUnit));
      case 'cos': return Math.cos(toRad(arg, angleUnit));
      case 'tan': return Math.tan(toRad(arg, angleUnit));
      case 'asin': case 'arcsin': return fromRad(Math.asin(arg), angleUnit);
      case 'acos': case 'arccos': return fromRad(Math.acos(arg), angleUnit);
      case 'atan': case 'arctan': return fromRad(Math.atan(arg), angleUnit);
      case 'sinh': return Math.sinh(arg);
      case 'cosh': return Math.cosh(arg);
      case 'tanh': return Math.tanh(arg);
      case 'log': return Math.log10(arg);
      case 'ln': return Math.log(arg);
      case 'log2': return Math.log2(arg);
      case 'sqrt': case '√': return Math.sqrt(arg);
      case 'cbrt': return Math.cbrt(arg);
      case 'abs': return Math.abs(arg);
      case 'ceil': return Math.ceil(arg);
      case 'floor': return Math.floor(arg);
      case 'round': return Math.round(arg);
      case 'exp': return Math.exp(arg);
      case 'pow': return Math.pow(arg, arg2 ?? 2);
      case 'fact': return factorial(arg);
      default: return NaN;
    }
  }

  return NaN;
}

function safeEval(expr: string, angleUnit: AngleUnit): string {
  try {
    // Pre-process: handle implicit multiplication, ×, ÷ etc
    let processed = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/mod/gi, '%')
      .replace(/(\d)(π|pi|e|sin|cos|tan|log|ln|sqrt|abs|exp|asin|acos|atan|sinh|cosh|tanh|cbrt|log2|fact)/gi, '$1*$2')
      .replace(/(π|e)(\d)/g, '$1*$2')
      .replace(/\)\(/g, ')*(')
      .replace(/(\d)\(/g, '$1*(');

    const tokens = tokenize(processed);
    const pos = { i: 0 };
    const result = parseExpression(tokens, pos, angleUnit);

    if (isNaN(result)) return 'Error';
    if (!isFinite(result)) return result > 0 ? 'Infinity' : '-Infinity';

    // Format result
    const str = result.toPrecision(12);
    // Remove trailing zeros
    const num = parseFloat(str);
    if (Math.abs(num) < 1e-14 && Math.abs(num) > 0) return '0';
    return String(num);
  } catch {
    return 'Error';
  }
}

/* ------------------------------------------------------------------ */
/*  BUTTON DEFINITIONS                                                 */
/* ------------------------------------------------------------------ */
interface CalcButton {
  label: string;
  display?: string;
  action: string;
  type: 'num' | 'op' | 'func' | 'action' | 'eq';
  span?: number;
}

const SCIENTIFIC_BUTTONS: CalcButton[][] = [
  // Row 1 - Memory & Clear
  [
    { label: 'Rad', action: 'toggle-angle', type: 'action' },
    { label: '(', action: 'input:(', type: 'op' },
    { label: ')', action: 'input:)', type: 'op' },
    { label: '%', action: 'input:%', type: 'op' },
    { label: 'AC', action: 'clear', type: 'action' },
  ],
  // Row 2 - Scientific functions
  [
    { label: 'sin', action: 'input:sin(', type: 'func' },
    { label: 'cos', action: 'input:cos(', type: 'func' },
    { label: 'tan', action: 'input:tan(', type: 'func' },
    { label: 'x!', action: 'input:fact(', type: 'func' },
    { label: '⌫', action: 'backspace', type: 'action' },
  ],
  // Row 3 - More functions
  [
    { label: 'sin⁻¹', action: 'input:asin(', type: 'func' },
    { label: 'cos⁻¹', action: 'input:acos(', type: 'func' },
    { label: 'tan⁻¹', action: 'input:atan(', type: 'func' },
    { label: 'π', action: 'input:π', type: 'func' },
    { label: 'e', action: 'input:e', type: 'func' },
  ],
  // Row 4 - Powers & roots
  [
    { label: 'x²', action: 'input:^2', type: 'func' },
    { label: 'xʸ', action: 'input:^', type: 'func' },
    { label: '√', action: 'input:sqrt(', type: 'func' },
    { label: 'log', action: 'input:log(', type: 'func' },
    { label: 'ln', action: 'input:ln(', type: 'func' },
  ],
  // Row 5 - Numbers 7-9
  [
    { label: '7', action: 'input:7', type: 'num' },
    { label: '8', action: 'input:8', type: 'num' },
    { label: '9', action: 'input:9', type: 'num' },
    { label: '÷', display: '÷', action: 'input:÷', type: 'op' },
    { label: '1/x', action: 'reciprocal', type: 'func' },
  ],
  // Row 6 - Numbers 4-6
  [
    { label: '4', action: 'input:4', type: 'num' },
    { label: '5', action: 'input:5', type: 'num' },
    { label: '6', action: 'input:6', type: 'num' },
    { label: '×', display: '×', action: 'input:×', type: 'op' },
    { label: '|x|', action: 'input:abs(', type: 'func' },
  ],
  // Row 7 - Numbers 1-3
  [
    { label: '1', action: 'input:1', type: 'num' },
    { label: '2', action: 'input:2', type: 'num' },
    { label: '3', action: 'input:3', type: 'num' },
    { label: '−', display: '−', action: 'input:-', type: 'op' },
    { label: '10ˣ', action: 'input:10^', type: 'func' },
  ],
  // Row 8 - 0, dot, equals
  [
    { label: '0', action: 'input:0', type: 'num', span: 2 },
    { label: '.', action: 'input:.', type: 'num' },
    { label: '+', action: 'input:+', type: 'op' },
    { label: '=', action: 'evaluate', type: 'eq' },
  ],
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */
export function ScientificCalculatorTool() {
  const [expression, setExpression] = useState('');
  const [display, setDisplay] = useState('0');
  const [angleUnit, setAngleUnit] = useState<AngleUnit>('deg');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [justEvaluated, setJustEvaluated] = useState(false);

  const handleButton = useCallback((btn: CalcButton) => {
    if (btn.action === 'clear') {
      setExpression('');
      setDisplay('0');
      setJustEvaluated(false);
      return;
    }

    if (btn.action === 'backspace') {
      setExpression(prev => {
        const next = prev.slice(0, -1);
        setDisplay(next || '0');
        return next;
      });
      setJustEvaluated(false);
      return;
    }

    if (btn.action === 'toggle-angle') {
      setAngleUnit(prev => (prev === 'deg' ? 'rad' : 'deg'));
      return;
    }

    if (btn.action === 'reciprocal') {
      if (expression) {
        const newExpr = `1/(${expression})`;
        setExpression(newExpr);
        setDisplay(newExpr);
      }
      return;
    }

    if (btn.action === 'evaluate') {
      if (!expression) return;
      const result = safeEval(expression, angleUnit);
      setHistory(prev => [{ expression, result }, ...prev].slice(0, 20));
      setDisplay(result);
      setExpression(result === 'Error' ? '' : result);
      setJustEvaluated(true);
      return;
    }

    // Input
    if (btn.action.startsWith('input:')) {
      const val = btn.action.slice(6);
      setExpression(prev => {
        // If just evaluated and user types a number, start fresh
        if (justEvaluated && /^[0-9.]$/.test(val)) {
          setDisplay(val);
          setJustEvaluated(false);
          return val;
        }
        setJustEvaluated(false);
        const next = prev + val;
        setDisplay(next);
        return next;
      });
    }
  }, [expression, angleUnit, justEvaluated]);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't capture if user is typing in another input
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

      if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleButton({ label: '=', action: 'evaluate', type: 'eq' });
      } else if (e.key === 'Escape') {
        handleButton({ label: 'AC', action: 'clear', type: 'action' });
      } else if (e.key === 'Backspace') {
        handleButton({ label: '⌫', action: 'backspace', type: 'action' });
      } else if (/^[0-9.+\-*/%^()e]$/.test(e.key)) {
        const mapped = e.key === '*' ? '×' : e.key === '/' ? '÷' : e.key;
        handleButton({ label: mapped, action: `input:${e.key === '*' ? '×' : e.key === '/' ? '÷' : e.key}`, type: 'num' });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleButton]);

  const btnClass = (type: CalcButton['type']) => cn(
    'flex items-center justify-center rounded-xl font-medium transition-all active:scale-95 select-none',
    'h-14 sm:h-16 text-sm sm:text-base',
    type === 'num' && 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm',
    type === 'op' && 'bg-slate-200 dark:bg-slate-700 text-primary-700 dark:text-primary-400 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold text-lg border border-slate-200 dark:border-slate-600',
    type === 'func' && 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs sm:text-sm border border-slate-200 dark:border-slate-700',
    type === 'action' && 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700',
    type === 'eq' && 'bg-primary-700 hover:bg-primary-800 text-white font-bold text-xl shadow-md shadow-primary-700/30',
  );

  return (
    <div className="space-y-5">
      {/* Calculator body */}
      <div className="max-w-md mx-auto">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xl">
          {/* Display */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 mb-4 border border-slate-200 dark:border-slate-700 shadow-inner">
            {/* Angle unit indicator */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {angleUnit === 'deg' ? 'DEG' : 'RAD'}
              </span>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-[10px] font-medium text-primary-600 dark:text-primary-400 hover:underline"
              >
                {showHistory ? 'Calculator' : `History (${history.length})`}
              </button>
            </div>

            {showHistory ? (
              <div className="h-28 overflow-y-auto space-y-1.5">
                {history.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-6">No calculations yet</p>
                )}
                {history.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setExpression(h.result === 'Error' ? h.expression : h.result);
                      setDisplay(h.result === 'Error' ? h.expression : h.result);
                      setShowHistory(false);
                    }}
                    className="w-full text-right hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg px-2 py-1 transition-colors"
                  >
                    <div className="text-[11px] text-slate-400 font-mono truncate">{h.expression}</div>
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-200 font-mono">= {h.result}</div>
                  </button>
                ))}
              </div>
            ) : (
              <>
                {/* Expression line */}
                <div className="text-right text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-mono h-5 truncate">
                  {expression && !justEvaluated ? expression : '\u00A0'}
                </div>
                {/* Result / current display */}
                <div
                  className={cn(
                    'text-right font-mono font-bold truncate mt-1 transition-all',
                    display.length > 16 ? 'text-xl sm:text-2xl' : display.length > 10 ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl',
                    justEvaluated ? 'text-primary-700 dark:text-primary-400' : 'text-slate-900 dark:text-slate-100',
                  )}
                >
                  {display}
                </div>
              </>
            )}
          </div>

          {/* Button grid */}
          {!showHistory && (
            <div className="space-y-2">
              {SCIENTIFIC_BUTTONS.map((row, ri) => (
                <div key={ri} className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {row.map((btn, bi) => (
                    <button
                      key={bi}
                      onClick={() => handleButton(btn)}
                      className={cn(
                        btnClass(btn.type),
                        btn.span === 2 && 'col-span-2',
                        btn.action === 'toggle-angle' && (angleUnit === 'rad' ? 'ring-2 ring-primary-400' : ''),
                      )}
                    >
                      {btn.action === 'toggle-angle' ? (angleUnit === 'deg' ? 'DEG' : 'RAD') : (btn.display || btn.label)}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Keyboard hint */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3">
          Type with keyboard &mdash; numbers, operators, Enter to calculate, Esc to clear
        </p>
      </div>

      {/* Quick Reference */}
      <div className="max-w-md mx-auto bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Quick Reference</h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex justify-between"><span>sin, cos, tan</span><span className="text-slate-400">Trigonometry</span></div>
          <div className="flex justify-between"><span>sin⁻¹, cos⁻¹, tan⁻¹</span><span className="text-slate-400">Inverse trig</span></div>
          <div className="flex justify-between"><span>log</span><span className="text-slate-400">Log base 10</span></div>
          <div className="flex justify-between"><span>ln</span><span className="text-slate-400">Natural log</span></div>
          <div className="flex justify-between"><span>x², xʸ</span><span className="text-slate-400">Powers</span></div>
          <div className="flex justify-between"><span>√</span><span className="text-slate-400">Square root</span></div>
          <div className="flex justify-between"><span>x!</span><span className="text-slate-400">Factorial</span></div>
          <div className="flex justify-between"><span>π, e</span><span className="text-slate-400">Constants</span></div>
          <div className="flex justify-between"><span>1/x</span><span className="text-slate-400">Reciprocal</span></div>
          <div className="flex justify-between"><span>|x|</span><span className="text-slate-400">Absolute value</span></div>
          <div className="flex justify-between"><span>10ˣ</span><span className="text-slate-400">Power of 10</span></div>
          <div className="flex justify-between"><span>DEG / RAD</span><span className="text-slate-400">Angle toggle</span></div>
        </div>
      </div>

      {/* Common formulas */}
      <div className="max-w-md mx-auto bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Common Formulas</h3>
        <div className="space-y-2">
          {[
            { label: 'Area of circle', formula: 'π × r²', example: 'π×5^2 = 78.54' },
            { label: 'Pythagorean theorem', formula: '√(a² + b²)', example: 'sqrt(3^2+4^2) = 5' },
            { label: 'Compound interest', formula: 'P(1 + r)ⁿ', example: '1000×(1+0.05)^10' },
            { label: 'Sine rule', formula: 'sin(θ)', example: 'sin(30) = 0.5 (DEG mode)' },
          ].map(f => (
            <div key={f.label} className="flex items-start gap-3 text-xs">
              <span className="text-slate-500 dark:text-slate-400 w-28 shrink-0">{f.label}</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{f.formula}</span>
              <span className="text-slate-400 ml-auto text-[10px]">{f.example}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
