'use client';
import { useState, useMemo } from 'react';

const CARD_CLASS = 'bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4';
const CELL_CLASS = 'w-16 h-12 text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100 font-mono';
const RESULT_CELL_CLASS = 'w-16 h-12 flex items-center justify-center rounded-lg border border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20 text-sm font-mono font-semibold text-primary-700 dark:text-primary-300';

type Size = 2 | 3;
type Operation = 'add' | 'subtract' | 'multiply' | 'determinant' | 'transpose' | 'inverse';
type Matrix = number[][];

function emptyMatrix(size: Size): Matrix {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function fmt(n: number): string {
  if (!isFinite(n)) return 'N/A';
  // Show fractions nicely as decimals rounded to 6 sig figs
  const rounded = parseFloat(n.toPrecision(6));
  if (Object.is(rounded, -0)) return '0';
  return rounded.toString();
}

function det2(m: Matrix): number {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

function det3(m: Matrix): number {
  return (
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  );
}

function addMat(a: Matrix, b: Matrix): Matrix {
  return a.map((row, i) => row.map((v, j) => v + b[i][j]));
}

function subMat(a: Matrix, b: Matrix): Matrix {
  return a.map((row, i) => row.map((v, j) => v - b[i][j]));
}

function mulMat(a: Matrix, b: Matrix): Matrix {
  const n = a.length;
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) =>
      Array.from({ length: n }, (_, k) => a[i][k] * b[k][j]).reduce((s, v) => s + v, 0)
    )
  );
}

function transposeMat(a: Matrix): Matrix {
  return a[0].map((_, j) => a.map(row => row[j]));
}

function inverse2(m: Matrix): Matrix | null {
  const d = det2(m);
  if (d === 0) return null;
  return [
    [m[1][1] / d, -m[0][1] / d],
    [-m[1][0] / d, m[0][0] / d],
  ];
}

interface Result {
  matrix?: Matrix;
  scalar?: number;
  steps: string[];
  error?: string;
}

function compute(op: Operation, size: Size, a: Matrix, b: Matrix): Result {
  switch (op) {
    case 'add':
      return { matrix: addMat(a, b), steps: ['Result = A + B (element-wise addition)'] };
    case 'subtract':
      return { matrix: subMat(a, b), steps: ['Result = A - B (element-wise subtraction)'] };
    case 'multiply':
      return {
        matrix: mulMat(a, b),
        steps: [
          'Result = A × B (standard matrix multiplication)',
          'Each cell (i,j) = sum of row i of A × column j of B',
        ],
      };
    case 'transpose':
      return {
        matrix: transposeMat(a),
        steps: ['Transposed: rows become columns, columns become rows', 'Result[i][j] = A[j][i]'],
      };
    case 'determinant': {
      if (size === 2) {
        const d = det2(a);
        const steps = [
          `det(A) = ad - bc`,
          `= (${fmt(a[0][0])})(${fmt(a[1][1])}) - (${fmt(a[0][1])})(${fmt(a[1][0])})`,
          `= ${fmt(a[0][0] * a[1][1])} - ${fmt(a[0][1] * a[1][0])}`,
          `= ${fmt(d)}`,
        ];
        return { scalar: d, steps };
      } else {
        const m00 = a[1][1] * a[2][2] - a[1][2] * a[2][1];
        const m01 = a[1][0] * a[2][2] - a[1][2] * a[2][0];
        const m02 = a[1][0] * a[2][1] - a[1][1] * a[2][0];
        const d = a[0][0] * m00 - a[0][1] * m01 + a[0][2] * m02;
        const t0 = a[0][0] * m00;
        const t1 = a[0][1] * m01;
        const t2 = a[0][2] * m02;
        // Build the sum line avoiding "x - -y" style
        const term1 = fmt(t0);
        const term2 = t1 < 0 ? `+ ${fmt(-t1)}` : `- ${fmt(t1)}`;
        const term3 = t2 < 0 ? `- ${fmt(-t2)}` : `+ ${fmt(t2)}`;
        const steps = [
          `Expansion along row 1:`,
          `det(A) = a₁₁·M₁₁ - a₁₂·M₁₂ + a₁₃·M₁₃`,
          `M₁₁ = (${fmt(a[1][1])})(${fmt(a[2][2])}) - (${fmt(a[1][2])})(${fmt(a[2][1])}) = ${fmt(m00)}`,
          `M₁₂ = (${fmt(a[1][0])})(${fmt(a[2][2])}) - (${fmt(a[1][2])})(${fmt(a[2][0])}) = ${fmt(m01)}`,
          `M₁₃ = (${fmt(a[1][0])})(${fmt(a[2][1])}) - (${fmt(a[1][1])})(${fmt(a[2][0])}) = ${fmt(m02)}`,
          `det = (${fmt(a[0][0])})(${fmt(m00)}) - (${fmt(a[0][1])})(${fmt(m01)}) + (${fmt(a[0][2])})(${fmt(m02)})`,
          `det = ${term1} ${term2} ${term3}`,
          `det = ${fmt(d)}`,
        ];
        return { scalar: d, steps };
      }
    }
    case 'inverse': {
      if (size === 3) return { steps: [], error: 'Inverse is supported for 2×2 matrices only in this tool.' };
      const d = det2(a);
      if (d === 0) return { steps: [`det(A) = 0 — Matrix is singular, no inverse exists.`], error: 'No inverse (det = 0)' };
      const inv = inverse2(a)!;
      const steps = [
        `det(A) = (${fmt(a[0][0])})(${fmt(a[1][1])}) - (${fmt(a[0][1])})(${fmt(a[1][0])}) = ${fmt(d)}`,
        `A⁻¹ = (1/det) × [[d, -b], [-c, a]]`,
        `A⁻¹ = (1/${fmt(d)}) × [[${fmt(a[1][1])}, ${fmt(-a[0][1])}], [${fmt(-a[1][0])}, ${fmt(a[0][0])}]]`,
        `= [[${fmt(inv[0][0])}, ${fmt(inv[0][1])}], [${fmt(inv[1][0])}, ${fmt(inv[1][1])}]]`,
        d !== 1 && d !== -1 ? `Note: values shown as decimals (1/det = 1/${fmt(d)} = ${fmt(1 / d)})` : '',
      ].filter(Boolean);
      return { matrix: inv, steps };
    }
    default:
      return { steps: [] };
  }
}

function MatrixInput({
  label,
  size,
  values,
  onChange,
}: {
  label: string;
  size: Size;
  values: Matrix;
  onChange: (r: number, c: number, v: string) => void;
}) {
  return (
    <div>
      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{label}</div>
      <div className="inline-flex flex-col gap-1">
        {Array.from({ length: size }).map((_, r) => (
          <div key={r} className="flex gap-1">
            {Array.from({ length: size }).map((_, c) => (
              <input
                key={c}
                type="number"
                value={values[r]?.[c] ?? 0}
                onChange={e => onChange(r, c, e.target.value)}
                className={CELL_CLASS}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function MatrixDisplay({ label, matrix }: { label: string; matrix: Matrix }) {
  return (
    <div>
      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{label}</div>
      <div className="inline-flex flex-col gap-1">
        {matrix.map((row, r) => (
          <div key={r} className="flex gap-1">
            {row.map((v, c) => (
              <div key={c} className={RESULT_CELL_CLASS}>{fmt(v)}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const OPERATIONS: { key: Operation; label: string; needsB: boolean }[] = [
  { key: 'add', label: 'Add (A+B)', needsB: true },
  { key: 'subtract', label: 'Subtract (A-B)', needsB: true },
  { key: 'multiply', label: 'Multiply (A×B)', needsB: true },
  { key: 'determinant', label: 'Determinant', needsB: false },
  { key: 'transpose', label: 'Transpose', needsB: false },
  { key: 'inverse', label: 'Inverse (2×2)', needsB: false },
];

export function MatrixCalculatorTool() {
  const [size, setSize] = useState<Size>(2);
  const [op, setOp] = useState<Operation>('add');
  const [matA, setMatA] = useState<Matrix>(emptyMatrix(2));
  const [matB, setMatB] = useState<Matrix>(emptyMatrix(2));

  function updateSize(newSize: Size) {
    setSize(newSize);
    setMatA(emptyMatrix(newSize));
    setMatB(emptyMatrix(newSize));
  }

  function updateA(r: number, c: number, v: string) {
    setMatA(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = parseFloat(v) || 0;
      return next;
    });
  }

  function updateB(r: number, c: number, v: string) {
    setMatB(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = parseFloat(v) || 0;
      return next;
    });
  }

  const currentOp = OPERATIONS.find(o => o.key === op)!;

  const result = useMemo(() => compute(op, size, matA, matB), [op, size, matA, matB]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-2">Matrix Size:</span>
          <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {([2, 3] as Size[]).map(s => (
              <button
                key={s}
                onClick={() => updateSize(s)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${size === s ? 'bg-primary-800 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                {s}×{s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Operation selector */}
      <div>
        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Operation</div>
        <div className="flex flex-wrap gap-2">
          {OPERATIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setOp(key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${op === key ? 'bg-primary-800 text-white border-primary-800' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Matrix inputs */}
      <div className="flex flex-wrap gap-8">
        <MatrixInput label="Matrix A" size={size} values={matA} onChange={updateA} />
        {currentOp.needsB && (
          <>
            <div className="flex items-center text-2xl font-bold text-slate-400 dark:text-slate-500 self-center">
              {op === 'add' ? '+' : op === 'subtract' ? '−' : '×'}
            </div>
            <MatrixInput label="Matrix B" size={size} values={matB} onChange={updateB} />
          </>
        )}
      </div>

      {/* Result */}
      <div className={CARD_CLASS}>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Result</h3>

        {result.error && (
          <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-3 mb-3">
            {result.error}
          </div>
        )}

        {result.matrix && !result.error && (
          <div className="mb-4">
            <MatrixDisplay label="Result Matrix" matrix={result.matrix} />
          </div>
        )}

        {result.scalar !== undefined && !result.error && (
          <div className="mb-4">
            <span className="text-sm text-slate-500 dark:text-slate-400">det(A) = </span>
            <span className="text-3xl font-heading font-bold text-primary-700 dark:text-primary-300 ml-2">{fmt(result.scalar)}</span>
          </div>
        )}

        {/* Steps */}
        {result.steps.length > 0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
              {op === 'determinant' ? 'Step-by-step Calculation' : 'How it works'}
            </div>
            <ol className="space-y-1">
              {result.steps.map((step, i) => (
                <li key={i} className="text-sm font-mono text-slate-600 dark:text-slate-400">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div className={CARD_CLASS}>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Operation Reference</h3>
        <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
          <div><span className="font-semibold text-slate-700 dark:text-slate-300">Add / Subtract:</span> Element-wise, same size matrices</div>
          <div><span className="font-semibold text-slate-700 dark:text-slate-300">Multiply:</span> C[i][j] = Σ A[i][k] × B[k][j]</div>
          <div><span className="font-semibold text-slate-700 dark:text-slate-300">Determinant 2×2:</span> ad − bc</div>
          <div><span className="font-semibold text-slate-700 dark:text-slate-300">Determinant 3×3:</span> Cofactor expansion along row 1</div>
          <div><span className="font-semibold text-slate-700 dark:text-slate-300">Transpose:</span> Result[i][j] = A[j][i]</div>
          <div><span className="font-semibold text-slate-700 dark:text-slate-300">Inverse 2×2:</span> (1/det) × [[d, −b], [−c, a]] — requires det ≠ 0</div>
        </div>
      </div>
    </div>
  );
}
