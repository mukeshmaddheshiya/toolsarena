'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  Plus,
  Trash2,
  ChevronDown,
  Sparkles,
  Clock,
  Layers,
  Code2,
  Eye,
  Settings2,
  ShieldCheck,
  History,
  Zap,
  X,
} from 'lucide-react';

/* ─────────────────────── Types ─────────────────────── */

interface KeyframeProperty {
  translateX: number;
  translateY: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
  opacity: number;
  backgroundColor: string;
  borderRadius: number;
  boxShadowBlur: number;
  boxShadowColor: string;
  filterBlur: number;
  filterBrightness: number;
}

interface KeyframeEntry {
  id: string;
  percentage: number;
  properties: KeyframeProperty;
}

type TimingFunction =
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'linear'
  | 'cubic-bezier';

type AnimationDirection =
  | 'normal'
  | 'reverse'
  | 'alternate'
  | 'alternate-reverse';

type FillMode = 'none' | 'forwards' | 'backwards' | 'both';

type PreviewShape = 'box' | 'circle' | 'text' | 'button' | 'card' | 'image';

type BackgroundMode = 'light' | 'dark' | 'checkered';

interface AnimationConfig {
  name: string;
  duration: number;
  timingFunction: TimingFunction;
  cubicBezier: [number, number, number, number];
  delay: number;
  iterationCount: number;
  infinite: boolean;
  direction: AnimationDirection;
  fillMode: FillMode;
  keyframes: KeyframeEntry[];
}

interface SavedAnimation {
  label: string;
  config: AnimationConfig;
  savedAt: number;
}

/* ─────────────────────── Constants ─────────────────────── */

const DEFAULT_KEYFRAME_PROPS: KeyframeProperty = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  scaleX: 1,
  scaleY: 1,
  skewX: 0,
  skewY: 0,
  opacity: 1,
  backgroundColor: '#6366f1',
  borderRadius: 12,
  boxShadowBlur: 0,
  boxShadowColor: 'rgba(0,0,0,0.3)',
  filterBlur: 0,
  filterBrightness: 100,
};

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function makeKeyframe(pct: number, overrides?: Partial<KeyframeProperty>): KeyframeEntry {
  return {
    id: uid(),
    percentage: pct,
    properties: { ...DEFAULT_KEYFRAME_PROPS, ...overrides },
  };
}

/* ── Presets ── */

interface Preset {
  name: string;
  keyframes: KeyframeEntry[];
  duration: number;
  timingFunction: TimingFunction;
  cubicBezier: [number, number, number, number];
  iterationCount: number;
  infinite: boolean;
  direction: AnimationDirection;
  fillMode: FillMode;
}

const PRESETS: Preset[] = [
  {
    name: 'Bounce',
    duration: 1,
    timingFunction: 'ease',
    cubicBezier: [0.25, 0.1, 0.25, 1],
    iterationCount: 1,
    infinite: true,
    direction: 'normal',
    fillMode: 'both',
    keyframes: [
      makeKeyframe(0, { translateY: 0, scaleY: 1 }),
      makeKeyframe(20, { translateY: -30, scaleY: 1 }),
      makeKeyframe(40, { translateY: 0, scaleY: 0.9 }),
      makeKeyframe(60, { translateY: -15, scaleY: 1 }),
      makeKeyframe(80, { translateY: 0, scaleY: 0.95 }),
      makeKeyframe(100, { translateY: 0, scaleY: 1 }),
    ],
  },
  {
    name: 'Fade In',
    duration: 0.6,
    timingFunction: 'ease',
    cubicBezier: [0.25, 0.1, 0.25, 1],
    iterationCount: 1,
    infinite: false,
    direction: 'normal',
    fillMode: 'forwards',
    keyframes: [
      makeKeyframe(0, { opacity: 0 }),
      makeKeyframe(100, { opacity: 1 }),
    ],
  },
  {
    name: 'Fade Out',
    duration: 0.6,
    timingFunction: 'ease',
    cubicBezier: [0.25, 0.1, 0.25, 1],
    iterationCount: 1,
    infinite: false,
    direction: 'normal',
    fillMode: 'forwards',
    keyframes: [
      makeKeyframe(0, { opacity: 1 }),
      makeKeyframe(100, { opacity: 0 }),
    ],
  },
  {
    name: 'Slide In Left',
    duration: 0.5,
    timingFunction: 'ease-out',
    cubicBezier: [0.25, 0.1, 0.25, 1],
    iterationCount: 1,
    infinite: false,
    direction: 'normal',
    fillMode: 'forwards',
    keyframes: [
      makeKeyframe(0, { translateX: -200, opacity: 0 }),
      makeKeyframe(100, { translateX: 0, opacity: 1 }),
    ],
  },
  {
    name: 'Slide In Right',
    duration: 0.5,
    timingFunction: 'ease-out',
    cubicBezier: [0.25, 0.1, 0.25, 1],
    iterationCount: 1,
    infinite: false,
    direction: 'normal',
    fillMode: 'forwards',
    keyframes: [
      makeKeyframe(0, { translateX: 200, opacity: 0 }),
      makeKeyframe(100, { translateX: 0, opacity: 1 }),
    ],
  },
  {
    name: 'Slide In Up',
    duration: 0.5,
    timingFunction: 'ease-out',
    cubicBezier: [0.25, 0.1, 0.25, 1],
    iterationCount: 1,
    infinite: false,
    direction: 'normal',
    fillMode: 'forwards',
    keyframes: [
      makeKeyframe(0, { translateY: 200, opacity: 0 }),
      makeKeyframe(100, { translateY: 0, opacity: 1 }),
    ],
  },
  {
    name: 'Slide In Down',
    duration: 0.5,
    timingFunction: 'ease-out',
    cubicBezier: [0.25, 0.1, 0.25, 1],
    iterationCount: 1,
    infinite: false,
    direction: 'normal',
    fillMode: 'forwards',
    keyframes: [
      makeKeyframe(0, { translateY: -200, opacity: 0 }),
      makeKeyframe(100, { translateY: 0, opacity: 1 }),
    ],
  },
  {
    name: 'Spin',
    duration: 1,
    timingFunction: 'linear',
    cubicBezier: [0.25, 0.1, 0.25, 1],
    iterationCount: 1,
    infinite: true,
    direction: 'normal',
    fillMode: 'none',
    keyframes: [
      makeKeyframe(0, { rotate: 0 }),
      makeKeyframe(100, { rotate: 360 }),
    ],
  },
  {
    name: 'Pulse',
    duration: 1,
    timingFunction: 'ease-in-out',
    cubicBezier: [0.25, 0.1, 0.25, 1],
    iterationCount: 1,
    infinite: true,
    direction: 'normal',
    fillMode: 'none',
    keyframes: [
      makeKeyframe(0, { scaleX: 1, scaleY: 1 }),
      makeKeyframe(50, { scaleX: 1.1, scaleY: 1.1 }),
      makeKeyframe(100, { scaleX: 1, scaleY: 1 }),
    ],
  },
  {
    name: 'Shake',
    duration: 0.6,
    timingFunction: 'ease-in-out',
    cubicBezier: [0.25, 0.1, 0.25, 1],
    iterationCount: 1,
    infinite: false,
    direction: 'normal',
    fillMode: 'both',
    keyframes: [
      makeKeyframe(0, { translateX: 0 }),
      makeKeyframe(10, { translateX: -10 }),
      makeKeyframe(20, { translateX: 10 }),
      makeKeyframe(30, { translateX: -10 }),
      makeKeyframe(40, { translateX: 10 }),
      makeKeyframe(50, { translateX: -10 }),
      makeKeyframe(60, { translateX: 10 }),
      makeKeyframe(70, { translateX: -10 }),
      makeKeyframe(80, { translateX: 10 }),
      makeKeyframe(90, { translateX: -5 }),
      makeKeyframe(100, { translateX: 0 }),
    ],
  },
  {
    name: 'Flip',
    duration: 0.8,
    timingFunction: 'ease-in-out',
    cubicBezier: [0.25, 0.1, 0.25, 1],
    iterationCount: 1,
    infinite: false,
    direction: 'normal',
    fillMode: 'forwards',
    keyframes: [
      makeKeyframe(0, { rotate: 0, scaleX: 1 }),
      makeKeyframe(50, { rotate: 180, scaleX: 0.8 }),
      makeKeyframe(100, { rotate: 360, scaleX: 1 }),
    ],
  },
  {
    name: 'Swing',
    duration: 1,
    timingFunction: 'ease-in-out',
    cubicBezier: [0.25, 0.1, 0.25, 1],
    iterationCount: 1,
    infinite: true,
    direction: 'normal',
    fillMode: 'none',
    keyframes: [
      makeKeyframe(0, { rotate: 0 }),
      makeKeyframe(20, { rotate: 15 }),
      makeKeyframe(40, { rotate: -10 }),
      makeKeyframe(60, { rotate: 5 }),
      makeKeyframe(80, { rotate: -5 }),
      makeKeyframe(100, { rotate: 0 }),
    ],
  },
  {
    name: 'Rubber Band',
    duration: 1,
    timingFunction: 'ease-out',
    cubicBezier: [0.25, 0.1, 0.25, 1],
    iterationCount: 1,
    infinite: false,
    direction: 'normal',
    fillMode: 'both',
    keyframes: [
      makeKeyframe(0, { scaleX: 1, scaleY: 1 }),
      makeKeyframe(30, { scaleX: 1.25, scaleY: 0.75 }),
      makeKeyframe(40, { scaleX: 0.75, scaleY: 1.25 }),
      makeKeyframe(50, { scaleX: 1.15, scaleY: 0.85 }),
      makeKeyframe(65, { scaleX: 0.95, scaleY: 1.05 }),
      makeKeyframe(75, { scaleX: 1.05, scaleY: 0.95 }),
      makeKeyframe(100, { scaleX: 1, scaleY: 1 }),
    ],
  },
  {
    name: 'Jello',
    duration: 1,
    timingFunction: 'ease-in-out',
    cubicBezier: [0.25, 0.1, 0.25, 1],
    iterationCount: 1,
    infinite: false,
    direction: 'normal',
    fillMode: 'both',
    keyframes: [
      makeKeyframe(0, { skewX: 0, skewY: 0 }),
      makeKeyframe(11, { skewX: 0, skewY: 0 }),
      makeKeyframe(22, { skewX: -12.5, skewY: -12.5 }),
      makeKeyframe(33, { skewX: 6.25, skewY: 6.25 }),
      makeKeyframe(44, { skewX: -3.125, skewY: -3.125 }),
      makeKeyframe(55, { skewX: 1.5625, skewY: 1.5625 }),
      makeKeyframe(66, { skewX: -0.78, skewY: -0.78 }),
      makeKeyframe(77, { skewX: 0.39, skewY: 0.39 }),
      makeKeyframe(88, { skewX: -0.2, skewY: -0.2 }),
      makeKeyframe(100, { skewX: 0, skewY: 0 }),
    ],
  },
  {
    name: 'Heart Beat',
    duration: 1.3,
    timingFunction: 'ease-in-out',
    cubicBezier: [0.25, 0.1, 0.25, 1],
    iterationCount: 1,
    infinite: true,
    direction: 'normal',
    fillMode: 'none',
    keyframes: [
      makeKeyframe(0, { scaleX: 1, scaleY: 1 }),
      makeKeyframe(14, { scaleX: 1.3, scaleY: 1.3 }),
      makeKeyframe(28, { scaleX: 1, scaleY: 1 }),
      makeKeyframe(42, { scaleX: 1.3, scaleY: 1.3 }),
      makeKeyframe(70, { scaleX: 1, scaleY: 1 }),
      makeKeyframe(100, { scaleX: 1, scaleY: 1 }),
    ],
  },
  {
    name: 'Zoom In',
    duration: 0.5,
    timingFunction: 'ease',
    cubicBezier: [0.25, 0.1, 0.25, 1],
    iterationCount: 1,
    infinite: false,
    direction: 'normal',
    fillMode: 'forwards',
    keyframes: [
      makeKeyframe(0, { scaleX: 0, scaleY: 0, opacity: 0 }),
      makeKeyframe(100, { scaleX: 1, scaleY: 1, opacity: 1 }),
    ],
  },
  {
    name: 'Zoom Out',
    duration: 0.5,
    timingFunction: 'ease',
    cubicBezier: [0.25, 0.1, 0.25, 1],
    iterationCount: 1,
    infinite: false,
    direction: 'normal',
    fillMode: 'forwards',
    keyframes: [
      makeKeyframe(0, { scaleX: 1, scaleY: 1, opacity: 1 }),
      makeKeyframe(100, { scaleX: 0, scaleY: 0, opacity: 0 }),
    ],
  },
];

const TIMING_FUNCTIONS: TimingFunction[] = [
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'linear',
  'cubic-bezier',
];

const DIRECTIONS: AnimationDirection[] = [
  'normal',
  'reverse',
  'alternate',
  'alternate-reverse',
];

const FILL_MODES: FillMode[] = ['none', 'forwards', 'backwards', 'both'];

const PREVIEW_SHAPES: { value: PreviewShape; label: string }[] = [
  { value: 'box', label: 'Box' },
  { value: 'circle', label: 'Circle' },
  { value: 'text', label: 'Text' },
  { value: 'button', label: 'Button' },
  { value: 'card', label: 'Card' },
  { value: 'image', label: 'Image' },
];

const SPEED_OPTIONS = [0.25, 0.5, 1, 2];

const STORAGE_KEY = 'css-anim-gen-history';

/* ─────────────────────── Helpers ─────────────────────── */

function buildKeyframeCss(kf: KeyframeEntry): string {
  const p = kf.properties;
  const transforms: string[] = [];
  if (p.translateX !== 0) transforms.push(`translateX(${p.translateX}px)`);
  if (p.translateY !== 0) transforms.push(`translateY(${p.translateY}px)`);
  if (p.rotate !== 0) transforms.push(`rotate(${p.rotate}deg)`);
  if (p.scaleX !== 1 || p.scaleY !== 1) transforms.push(`scale(${p.scaleX}, ${p.scaleY})`);
  if (p.skewX !== 0 || p.skewY !== 0) transforms.push(`skew(${p.skewX}deg, ${p.skewY}deg)`);

  const filters: string[] = [];
  if (p.filterBlur > 0) filters.push(`blur(${p.filterBlur}px)`);
  if (p.filterBrightness !== 100) filters.push(`brightness(${p.filterBrightness}%)`);

  const lines: string[] = [];
  if (transforms.length) lines.push(`    transform: ${transforms.join(' ')};`);
  if (p.opacity !== 1) lines.push(`    opacity: ${p.opacity};`);
  if (p.backgroundColor !== DEFAULT_KEYFRAME_PROPS.backgroundColor)
    lines.push(`    background-color: ${p.backgroundColor};`);
  if (p.borderRadius !== DEFAULT_KEYFRAME_PROPS.borderRadius)
    lines.push(`    border-radius: ${p.borderRadius}px;`);
  if (p.boxShadowBlur > 0)
    lines.push(`    box-shadow: 0 0 ${p.boxShadowBlur}px ${p.boxShadowColor};`);
  if (filters.length) lines.push(`    filter: ${filters.join(' ')};`);

  return `  ${kf.percentage}% {\n${lines.join('\n')}\n  }`;
}

function generateFullCss(config: AnimationConfig): string {
  const sorted = [...config.keyframes].sort((a, b) => a.percentage - b.percentage);
  const keyframeBlocks = sorted.map(buildKeyframeCss).join('\n');

  const timingValue =
    config.timingFunction === 'cubic-bezier'
      ? `cubic-bezier(${config.cubicBezier.join(', ')})`
      : config.timingFunction;

  const iterCount = config.infinite ? 'infinite' : String(config.iterationCount);

  const lines = [
    `@keyframes ${config.name || 'myAnimation'} {`,
    keyframeBlocks,
    `}`,
    ``,
    `.animated-element {`,
    `  animation-name: ${config.name || 'myAnimation'};`,
    `  animation-duration: ${config.duration}s;`,
    `  animation-timing-function: ${timingValue};`,
    `  animation-delay: ${config.delay}s;`,
    `  animation-iteration-count: ${iterCount};`,
    `  animation-direction: ${config.direction};`,
    `  animation-fill-mode: ${config.fillMode};`,
    `}`,
  ];

  return lines.join('\n');
}

function buildLiveStyle(config: AnimationConfig, speed: number): string {
  const sorted = [...config.keyframes].sort((a, b) => a.percentage - b.percentage);
  const keyframeBlocks = sorted.map(buildKeyframeCss).join('\n');
  const timingValue =
    config.timingFunction === 'cubic-bezier'
      ? `cubic-bezier(${config.cubicBezier.join(', ')})`
      : config.timingFunction;
  const iterCount = config.infinite ? 'infinite' : String(config.iterationCount);
  const effectiveDuration = config.duration / speed;

  return `
@keyframes __preview_anim__ {
${keyframeBlocks}
}
.__preview_target__ {
  animation-name: __preview_anim__;
  animation-duration: ${effectiveDuration}s;
  animation-timing-function: ${timingValue};
  animation-delay: ${config.delay / speed}s;
  animation-iteration-count: ${iterCount};
  animation-direction: ${config.direction};
  animation-fill-mode: ${config.fillMode};
}
`;
}

/* ── Syntax highlight helper ── */

function highlightCss(code: string): React.ReactNode[] {
  return code.split('\n').map((line, i) => {
    let highlighted = line
      // properties (word before colon)
      .replace(
        /^(\s*)([\w-]+)(\s*:\s*)/,
        (_, ws, prop, col) =>
          `${ws}<span class="text-sky-400">${prop}</span><span class="text-gray-400">${col}</span>`,
      )
      // brackets
      .replace(/([{}])/g, '<span class="text-yellow-300">$1</span>')
      // @keyframes
      .replace(
        /(@keyframes)\s+(\S+)/,
        '<span class="text-purple-400">$1</span> <span class="text-green-400">$2</span>',
      )
      // percentages
      .replace(/(\d+%)/g, '<span class="text-amber-300">$1</span>')
      // numeric values with units
      .replace(
        /:\s*([^;{}<]*)(;?)/,
        (match) => {
          if (match.includes('class=')) return match; // already highlighted
          return match.replace(
            /(-?[\d.]+(?:px|deg|s|%)?)/g,
            '<span class="text-orange-300">$1</span>',
          );
        },
      )
      // .animated-element
      .replace(
        /(\.[\w-]+)/,
        (m) => (m.includes('class=') ? m : `<span class="text-green-400">${m}</span>`),
      );

    // remove double-highlighting artefacts – just use the raw replacement
    return (
      <span key={i}>
        <span dangerouslySetInnerHTML={{ __html: highlighted }} />
        {'\n'}
      </span>
    );
  });
}

/* ─────────────────── Cubic Bezier Editor ─────────────────── */

function CubicBezierEditor({
  value,
  onChange,
}: {
  value: [number, number, number, number];
  onChange: (v: [number, number, number, number]) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<1 | 2 | null>(null);

  const W = 200;
  const H = 200;
  const PAD = 16;
  const toSvg = (x: number, y: number) => ({
    cx: PAD + x * (W - 2 * PAD),
    cy: H - PAD - y * (H - 2 * PAD),
  });

  const p1 = toSvg(value[0], value[1]);
  const p2 = toSvg(value[2], value[3]);
  const start = toSvg(0, 0);
  const end = toSvg(1, 1);

  const fromSvg = useCallback(
    (clientX: number, clientY: number): [number, number] => {
      const svg = svgRef.current;
      if (!svg) return [0, 0];
      const rect = svg.getBoundingClientRect();
      const x = (clientX - rect.left - PAD) / (W - 2 * PAD);
      const y = 1 - (clientY - rect.top - PAD) / (H - 2 * PAD);
      return [Math.min(1, Math.max(0, Math.round(x * 100) / 100)), Math.min(1.5, Math.max(-0.5, Math.round(y * 100) / 100))];
    },
    [],
  );

  const handlePointerDown = useCallback((point: 1 | 2) => {
    setDragging(point);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => {
      const [x, y] = fromSvg(e.clientX, e.clientY);
      if (dragging === 1) onChange([x, y, value[2], value[3]]);
      else onChange([value[0], value[1], x, y]);
    };
    const onUp = () => setDragging(null);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [dragging, fromSvg, onChange, value]);

  return (
    <div className="bg-gray-900 rounded-xl p-3 border border-gray-700">
      <p className="text-xs text-gray-400 mb-2 font-mono">
        cubic-bezier({value.join(', ')})
      </p>
      <svg
        ref={svgRef}
        width={W}
        height={H}
        className="bg-gray-800 rounded-lg cursor-crosshair touch-none"
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((t) => {
          const gx = PAD + t * (W - 2 * PAD);
          const gy = H - PAD - t * (H - 2 * PAD);
          return (
            <g key={t}>
              <line x1={gx} y1={PAD} x2={gx} y2={H - PAD} stroke="#374151" strokeWidth={0.5} />
              <line x1={PAD} y1={gy} x2={W - PAD} y2={gy} stroke="#374151" strokeWidth={0.5} />
            </g>
          );
        })}
        {/* Diagonal (linear) */}
        <line
          x1={start.cx}
          y1={start.cy}
          x2={end.cx}
          y2={end.cy}
          stroke="#4b5563"
          strokeWidth={1}
          strokeDasharray="4"
        />
        {/* Control lines */}
        <line x1={start.cx} y1={start.cy} x2={p1.cx} y2={p1.cy} stroke="#818cf8" strokeWidth={1} />
        <line x1={end.cx} y1={end.cy} x2={p2.cx} y2={p2.cy} stroke="#f472b6" strokeWidth={1} />
        {/* Curve */}
        <path
          d={`M ${start.cx} ${start.cy} C ${p1.cx} ${p1.cy}, ${p2.cx} ${p2.cy}, ${end.cx} ${end.cy}`}
          fill="none"
          stroke="#a78bfa"
          strokeWidth={2.5}
        />
        {/* Control points */}
        <circle
          cx={p1.cx}
          cy={p1.cy}
          r={7}
          fill="#818cf8"
          stroke="white"
          strokeWidth={2}
          className="cursor-grab"
          onPointerDown={() => handlePointerDown(1)}
        />
        <circle
          cx={p2.cx}
          cy={p2.cy}
          r={7}
          fill="#f472b6"
          stroke="white"
          strokeWidth={2}
          className="cursor-grab"
          onPointerDown={() => handlePointerDown(2)}
        />
      </svg>
    </div>
  );
}

/* ─────────────────── Main Component ─────────────────── */

export function CssAnimationGeneratorTool() {
  /* ── State ── */
  const [config, setConfig] = useState<AnimationConfig>(() => ({
    name: 'bounce',
    duration: 1,
    timingFunction: 'ease',
    cubicBezier: [0.25, 0.1, 0.25, 1],
    delay: 0,
    iterationCount: 1,
    infinite: true,
    direction: 'normal',
    fillMode: 'both',
    keyframes: PRESETS[0].keyframes.map((k) => ({ ...k, id: uid() })),
  }));

  const [selectedKeyframeId, setSelectedKeyframeId] = useState<string>(
    config.keyframes[0]?.id ?? '',
  );
  const [previewShape, setPreviewShape] = useState<PreviewShape>('box');
  const [bgMode, setBgMode] = useState<BackgroundMode>('dark');
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [copied, setCopied] = useState(false);
  const [restartKey, setRestartKey] = useState(0);
  const [activePreset, setActivePreset] = useState<string>('Bounce');
  const [history, setHistory] = useState<SavedAnimation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'controls' | 'keyframes'>('controls');

  /* ── Load history from localStorage ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw) as SavedAnimation[]);
    } catch {
      /* ignore */
    }
  }, []);

  /* ── Derived ── */
  const selectedKeyframe = useMemo(
    () => config.keyframes.find((k) => k.id === selectedKeyframeId) ?? config.keyframes[0],
    [config.keyframes, selectedKeyframeId],
  );

  const cssOutput = useMemo(() => generateFullCss(config), [config]);

  const liveStyleTag = useMemo(
    () => buildLiveStyle(config, speed),
    [config, speed],
  );

  /* ── Updaters ── */
  const patchConfig = useCallback(
    (partial: Partial<AnimationConfig>) =>
      setConfig((prev) => ({ ...prev, ...partial })),
    [],
  );

  const patchKeyframe = useCallback(
    (id: string, props: Partial<KeyframeProperty>) => {
      setConfig((prev) => ({
        ...prev,
        keyframes: prev.keyframes.map((k) =>
          k.id === id ? { ...k, properties: { ...k.properties, ...props } } : k,
        ),
      }));
    },
    [],
  );

  const addKeyframe = useCallback(() => {
    const existing = config.keyframes.map((k) => k.percentage).sort((a, b) => a - b);
    // Find biggest gap
    let bestPct = 50;
    let bestGap = 0;
    for (let i = 0; i < existing.length - 1; i++) {
      const gap = existing[i + 1] - existing[i];
      if (gap > bestGap) {
        bestGap = gap;
        bestPct = Math.round((existing[i] + existing[i + 1]) / 2);
      }
    }
    const newKf = makeKeyframe(bestPct);
    setConfig((prev) => ({ ...prev, keyframes: [...prev.keyframes, newKf] }));
    setSelectedKeyframeId(newKf.id);
  }, [config.keyframes]);

  const removeKeyframe = useCallback(
    (id: string) => {
      if (config.keyframes.length <= 2) return;
      setConfig((prev) => ({
        ...prev,
        keyframes: prev.keyframes.filter((k) => k.id !== id),
      }));
      if (selectedKeyframeId === id) {
        setSelectedKeyframeId(config.keyframes.find((k) => k.id !== id)?.id ?? '');
      }
    },
    [config.keyframes, selectedKeyframeId],
  );

  const setKeyframePercentage = useCallback((id: string, pct: number) => {
    setConfig((prev) => ({
      ...prev,
      keyframes: prev.keyframes.map((k) =>
        k.id === id ? { ...k, percentage: Math.min(100, Math.max(0, pct)) } : k,
      ),
    }));
  }, []);

  const applyPreset = useCallback((preset: Preset) => {
    const newKeyframes = preset.keyframes.map((k) => ({ ...k, id: uid() }));
    setConfig({
      name: preset.name.toLowerCase().replace(/\s+/g, '-'),
      duration: preset.duration,
      timingFunction: preset.timingFunction,
      cubicBezier: preset.cubicBezier,
      delay: 0,
      iterationCount: preset.iterationCount,
      infinite: preset.infinite,
      direction: preset.direction,
      fillMode: preset.fillMode,
      keyframes: newKeyframes,
    });
    setSelectedKeyframeId(newKeyframes[0].id);
    setActivePreset(preset.name);
    setRestartKey((k) => k + 1);
    setPlaying(true);
  }, []);

  const restart = useCallback(() => {
    setRestartKey((k) => k + 1);
    setPlaying(true);
  }, []);

  const copyCode = useCallback(async () => {
    await navigator.clipboard.writeText(cssOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [cssOutput]);

  const saveToHistory = useCallback(() => {
    const entry: SavedAnimation = {
      label: config.name || 'Untitled',
      config: structuredClone(config),
      savedAt: Date.now(),
    };
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, 5);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, [config]);

  const loadFromHistory = useCallback((saved: SavedAnimation) => {
    const newKeyframes = saved.config.keyframes.map((k) => ({ ...k, id: uid() }));
    setConfig({ ...saved.config, keyframes: newKeyframes });
    setSelectedKeyframeId(newKeyframes[0]?.id ?? '');
    setActivePreset('');
    setRestartKey((k) => k + 1);
    setPlaying(true);
    setShowHistory(false);
  }, []);

  const resetAll = useCallback(() => {
    applyPreset(PRESETS[0]);
  }, [applyPreset]);

  /* ── Preview element renderer ── */
  const renderPreviewElement = () => {
    const base = '__preview_target__';
    switch (previewShape) {
      case 'box':
        return (
          <div
            key={restartKey}
            className={`${base} w-24 h-24 bg-indigo-500 rounded-xl shadow-lg`}
            style={!playing ? { animationPlayState: 'paused' } : undefined}
          />
        );
      case 'circle':
        return (
          <div
            key={restartKey}
            className={`${base} w-24 h-24 bg-pink-500 rounded-full shadow-lg`}
            style={!playing ? { animationPlayState: 'paused' } : undefined}
          />
        );
      case 'text':
        return (
          <div
            key={restartKey}
            className={`${base} text-3xl font-bold text-white select-none`}
            style={!playing ? { animationPlayState: 'paused' } : undefined}
          >
            Hello World
          </div>
        );
      case 'button':
        return (
          <button
            key={restartKey}
            className={`${base} px-8 py-3 bg-emerald-500 text-white font-semibold rounded-lg shadow-lg`}
            style={!playing ? { animationPlayState: 'paused' } : undefined}
          >
            Click Me
          </button>
        );
      case 'card':
        return (
          <div
            key={restartKey}
            className={`${base} w-40 bg-white rounded-xl shadow-xl overflow-hidden`}
            style={!playing ? { animationPlayState: 'paused' } : undefined}
          >
            <div className="h-16 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
            <div className="p-3">
              <div className="h-2 bg-gray-300 rounded mb-2 w-3/4" />
              <div className="h-2 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        );
      case 'image':
        return (
          <div
            key={restartKey}
            className={`${base} w-28 h-28 bg-gray-600 rounded-xl flex items-center justify-center shadow-lg`}
            style={!playing ? { animationPlayState: 'paused' } : undefined}
          >
            <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        );
    }
  };

  const bgClass =
    bgMode === 'light'
      ? 'bg-white'
      : bgMode === 'dark'
        ? 'bg-gray-900'
        : 'bg-[length:20px_20px] bg-[image:linear-gradient(45deg,#1e1e2e_25%,transparent_25%,transparent_75%,#1e1e2e_75%),linear-gradient(45deg,#1e1e2e_25%,transparent_25%,transparent_75%,#1e1e2e_75%)] bg-[position:0_0,10px_10px] bg-gray-800';

  /* ── Slider helper ── */
  const SliderRow = ({
    label,
    value,
    min,
    max,
    step,
    onChange,
    suffix,
  }: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
    suffix?: string;
  }) => (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-300">{label}</span>
        <span className="text-indigo-400 font-mono">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-indigo-500 h-2 rounded-lg bg-gray-700 cursor-pointer"
      />
    </div>
  );

  /* ── Select helper ── */
  const SelectRow = <T extends string>({
    label,
    value,
    options,
    onChange,
  }: {
    label: string;
    value: T;
    options: T[];
    onChange: (v: T) => void;
  }) => (
    <div>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-200 appearance-none cursor-pointer focus:border-indigo-500 focus:outline-none"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );

  /* ── Keyframe property editor ── */
  const KeyframePropertyEditor = () => {
    if (!selectedKeyframe) return null;
    const p = selectedKeyframe.properties;
    const patch = (props: Partial<KeyframeProperty>) =>
      patchKeyframe(selectedKeyframe.id, props);

    return (
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          Keyframe {selectedKeyframe.percentage}% Properties
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <SliderRow label="Translate X" value={p.translateX} min={-300} max={300} step={1} onChange={(v) => patch({ translateX: v })} suffix="px" />
          <SliderRow label="Translate Y" value={p.translateY} min={-300} max={300} step={1} onChange={(v) => patch({ translateY: v })} suffix="px" />
          <SliderRow label="Rotate" value={p.rotate} min={-360} max={360} step={1} onChange={(v) => patch({ rotate: v })} suffix="deg" />
          <SliderRow label="Scale X" value={p.scaleX} min={0} max={3} step={0.05} onChange={(v) => patch({ scaleX: v })} />
          <SliderRow label="Scale Y" value={p.scaleY} min={0} max={3} step={0.05} onChange={(v) => patch({ scaleY: v })} />
          <SliderRow label="Skew X" value={p.skewX} min={-45} max={45} step={0.5} onChange={(v) => patch({ skewX: v })} suffix="deg" />
          <SliderRow label="Skew Y" value={p.skewY} min={-45} max={45} step={0.5} onChange={(v) => patch({ skewY: v })} suffix="deg" />
          <SliderRow label="Opacity" value={p.opacity} min={0} max={1} step={0.01} onChange={(v) => patch({ opacity: v })} />
          <SliderRow label="Border Radius" value={p.borderRadius} min={0} max={100} step={1} onChange={(v) => patch({ borderRadius: v })} suffix="px" />
          <SliderRow label="Shadow Blur" value={p.boxShadowBlur} min={0} max={50} step={1} onChange={(v) => patch({ boxShadowBlur: v })} suffix="px" />
          <SliderRow label="Filter Blur" value={p.filterBlur} min={0} max={20} step={0.5} onChange={(v) => patch({ filterBlur: v })} suffix="px" />
          <SliderRow label="Brightness" value={p.filterBrightness} min={0} max={200} step={1} onChange={(v) => patch({ filterBrightness: v })} suffix="%" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Background Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={p.backgroundColor}
                onChange={(e) => patch({ backgroundColor: e.target.value })}
                className="w-9 h-9 rounded-lg border border-gray-600 bg-transparent cursor-pointer"
              />
              <span className="text-xs font-mono text-gray-400">{p.backgroundColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Shadow Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={p.boxShadowColor.startsWith('rgba') ? '#000000' : p.boxShadowColor}
                onChange={(e) => patch({ boxShadowColor: e.target.value })}
                className="w-9 h-9 rounded-lg border border-gray-600 bg-transparent cursor-pointer"
              />
              <span className="text-xs font-mono text-gray-400">{p.boxShadowColor}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────── Render ─────────────────── */
  return (
    <div className="space-y-5">
      {/* ── Injected live style ── */}
      <style>{liveStyleTag}</style>

      {/* ── Hero ── */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">CSS Animation Generator</h1>
            <p className="text-sm text-white/80 mt-0.5">
              Build keyframe animations visually, preview in real-time, and export production-ready CSS.
            </p>
          </div>
        </div>
      </div>

      {/* ── Presets Row ── */}
      <div className="bg-gray-800/60 backdrop-blur rounded-xl border border-gray-700/50 p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          Animation Presets
        </h3>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePreset === preset.name
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/80 hover:text-white'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Three-panel layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr_380px] gap-4">
        {/* ─── LEFT: Controls ─── */}
        <div className="bg-gray-800/60 backdrop-blur rounded-xl border border-gray-700/50 p-4 space-y-4 overflow-y-auto max-h-[80vh]">
          {/* Tab switcher */}
          <div className="flex rounded-lg bg-gray-900/80 p-1">
            <button
              onClick={() => setActiveTab('controls')}
              className={`flex-1 text-xs font-medium py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'controls'
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" /> Animation
            </button>
            <button
              onClick={() => setActiveTab('keyframes')}
              className={`flex-1 text-xs font-medium py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'keyframes'
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Keyframes
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'controls' ? (
              <motion.div
                key="controls"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                {/* Animation name */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Animation Name</label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) =>
                      patchConfig({
                        name: e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''),
                      })
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none font-mono"
                    placeholder="myAnimation"
                  />
                </div>

                <SliderRow
                  label="Duration"
                  value={config.duration}
                  min={0.1}
                  max={10}
                  step={0.1}
                  onChange={(v) => patchConfig({ duration: v })}
                  suffix="s"
                />

                <SelectRow
                  label="Timing Function"
                  value={config.timingFunction}
                  options={TIMING_FUNCTIONS}
                  onChange={(v) => patchConfig({ timingFunction: v })}
                />

                {config.timingFunction === 'cubic-bezier' && (
                  <CubicBezierEditor
                    value={config.cubicBezier}
                    onChange={(v) => patchConfig({ cubicBezier: v })}
                  />
                )}

                <SliderRow
                  label="Delay"
                  value={config.delay}
                  min={0}
                  max={5}
                  step={0.1}
                  onChange={(v) => patchConfig({ delay: v })}
                  suffix="s"
                />

                {/* Iteration count */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-300">Iteration Count</span>
                    <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.infinite}
                        onChange={(e) => patchConfig({ infinite: e.target.checked })}
                        className="accent-indigo-500 rounded"
                      />
                      Infinite
                    </label>
                  </div>
                  {!config.infinite && (
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={config.iterationCount}
                      onChange={(e) =>
                        patchConfig({
                          iterationCount: Math.max(1, parseInt(e.target.value) || 1),
                        })
                      }
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none"
                    />
                  )}
                </div>

                <SelectRow
                  label="Direction"
                  value={config.direction}
                  options={DIRECTIONS}
                  onChange={(v) => patchConfig({ direction: v })}
                />

                <SelectRow
                  label="Fill Mode"
                  value={config.fillMode}
                  options={FILL_MODES}
                  onChange={(v) => patchConfig({ fillMode: v })}
                />
              </motion.div>
            ) : (
              <motion.div
                key="keyframes"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <KeyframePropertyEditor />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── CENTER: Preview ─── */}
        <div className="space-y-4">
          {/* Preview panel */}
          <div className="bg-gray-800/60 backdrop-blur rounded-xl border border-gray-700/50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-700/50">
              <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-400" />
                Live Preview
              </h3>
              <div className="flex items-center gap-2">
                {/* Shape selector */}
                <div className="relative">
                  <select
                    value={previewShape}
                    onChange={(e) => setPreviewShape(e.target.value as PreviewShape)}
                    className="bg-gray-700 border border-gray-600 rounded-md pl-2 pr-7 py-1 text-xs text-gray-200 appearance-none cursor-pointer focus:outline-none"
                  >
                    {PREVIEW_SHAPES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                </div>
                {/* Background toggle */}
                <div className="flex rounded-md overflow-hidden border border-gray-600">
                  {(['light', 'dark', 'checkered'] as BackgroundMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setBgMode(m)}
                      className={`px-2 py-1 text-xs ${
                        bgMode === m
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-700 text-gray-400 hover:text-gray-200'
                      }`}
                      title={m}
                    >
                      {m === 'light' ? 'L' : m === 'dark' ? 'D' : 'C'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div
              className={`${bgClass} flex items-center justify-center transition-colors`}
              style={{ minHeight: 320 }}
            >
              {renderPreviewElement()}
            </div>

            {/* Playback controls */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-700/50 bg-gray-800/80">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors"
                  title={playing ? 'Pause' : 'Play'}
                >
                  {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={restart}
                  className="p-1.5 rounded-lg bg-gray-700/60 text-gray-400 hover:text-white transition-colors"
                  title="Restart"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speed */}
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                {SPEED_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSpeed(s);
                      setRestartKey((k) => k + 1);
                    }}
                    className={`px-2 py-0.5 rounded text-xs font-mono ${
                      speed === s
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-700 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Timeline ── */}
          <div className="bg-gray-800/60 backdrop-blur rounded-xl border border-gray-700/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-pink-400" />
                Keyframe Timeline
              </h3>
              <button
                onClick={addKeyframe}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 text-xs font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {/* Timeline bar */}
            <div className="relative">
              {/* Track */}
              <div className="h-2 bg-gray-700 rounded-full relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-pink-500/40 rounded-full" />
              </div>

              {/* Percentage labels */}
              <div className="flex justify-between mt-1 px-0">
                {[0, 25, 50, 75, 100].map((p) => (
                  <span key={p} className="text-[10px] text-gray-500 font-mono">
                    {p}%
                  </span>
                ))}
              </div>

              {/* Keyframe dots */}
              {[...config.keyframes]
                .sort((a, b) => a.percentage - b.percentage)
                .map((kf) => (
                  <button
                    key={kf.id}
                    onClick={() => {
                      setSelectedKeyframeId(kf.id);
                      setActiveTab('keyframes');
                    }}
                    className={`absolute top-0 -translate-y-[3px] w-4 h-4 rounded-full border-2 transition-all cursor-pointer ${
                      selectedKeyframeId === kf.id
                        ? 'bg-indigo-400 border-white scale-125 shadow-lg shadow-indigo-500/50 z-10'
                        : 'bg-gray-500 border-gray-400 hover:bg-indigo-400 hover:border-white'
                    }`}
                    style={{
                      left: `calc(${kf.percentage}% - 8px)`,
                    }}
                    title={`${kf.percentage}%`}
                  />
                ))}
            </div>

            {/* Keyframe list */}
            <div className="mt-4 space-y-1.5 max-h-40 overflow-y-auto">
              {[...config.keyframes]
                .sort((a, b) => a.percentage - b.percentage)
                .map((kf) => (
                  <div
                    key={kf.id}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                      selectedKeyframeId === kf.id
                        ? 'bg-indigo-500/20 border border-indigo-500/40'
                        : 'bg-gray-700/40 border border-transparent hover:bg-gray-700/60'
                    }`}
                    onClick={() => {
                      setSelectedKeyframeId(kf.id);
                      setActiveTab('keyframes');
                    }}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        selectedKeyframeId === kf.id ? 'bg-indigo-400' : 'bg-gray-500'
                      }`}
                    />
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={kf.percentage}
                        onChange={(e) =>
                          setKeyframePercentage(kf.id, parseInt(e.target.value) || 0)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="w-14 bg-gray-800 border border-gray-600 rounded px-2 py-0.5 text-xs font-mono text-gray-200 focus:border-indigo-500 focus:outline-none"
                      />
                      <span className="text-xs text-gray-500">%</span>
                      <span className="text-[10px] text-gray-500 truncate">
                        {kf.properties.translateX !== 0 && `tX:${kf.properties.translateX} `}
                        {kf.properties.translateY !== 0 && `tY:${kf.properties.translateY} `}
                        {kf.properties.rotate !== 0 && `r:${kf.properties.rotate} `}
                        {kf.properties.opacity !== 1 && `o:${kf.properties.opacity} `}
                        {(kf.properties.scaleX !== 1 || kf.properties.scaleY !== 1) &&
                          `s:${kf.properties.scaleX},${kf.properties.scaleY}`}
                      </span>
                    </div>
                    {config.keyframes.length > 2 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeKeyframe(kf.id);
                        }}
                        className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Remove keyframe"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Code Output ─── */}
        <div className="space-y-4">
          <div className="bg-gray-800/60 backdrop-blur rounded-xl border border-gray-700/50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-700/50">
              <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                Generated CSS
              </h3>
              <button
                onClick={copyCode}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  copied
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="p-4 max-h-[50vh] overflow-auto">
              <pre className="text-xs font-mono leading-relaxed text-gray-300 whitespace-pre-wrap">
                {highlightCss(cssOutput)}
              </pre>
            </div>
          </div>

          {/* ── Action Buttons ── */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={saveToHistory}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-medium transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              Save to History
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-700/60 text-gray-300 hover:bg-gray-600/80 text-xs font-medium transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              History ({history.length})
            </button>
            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-700/60 text-gray-300 hover:bg-gray-600/80 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* ── History Drawer ── */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-gray-800/60 backdrop-blur rounded-xl border border-gray-700/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-300">Saved Animations</h4>
                    <button
                      onClick={() => setShowHistory(false)}
                      className="p-1 rounded text-gray-500 hover:text-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {history.length === 0 ? (
                    <p className="text-xs text-gray-500 py-4 text-center">
                      No saved animations yet. Click &quot;Save to History&quot; to store your work.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {history.map((h, i) => (
                        <button
                          key={`${h.savedAt}-${i}`}
                          onClick={() => loadFromHistory(h)}
                          className="w-full text-left px-3 py-2 rounded-lg bg-gray-700/40 hover:bg-gray-700/70 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-200 font-mono">{h.label}</span>
                            <span className="text-[10px] text-gray-500">
                              {new Date(h.savedAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-500 mt-0.5">
                            {h.config.duration}s / {h.config.keyframes.length} keyframes /{' '}
                            {h.config.timingFunction}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Shorthand ── */}
          <div className="bg-gray-800/60 backdrop-blur rounded-xl border border-gray-700/50 p-4">
            <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              Shorthand
            </h4>
            <code className="block text-xs font-mono text-indigo-300 bg-gray-900/60 rounded-lg p-3 break-all">
              animation: {config.name || 'myAnimation'} {config.duration}s{' '}
              {config.timingFunction === 'cubic-bezier'
                ? `cubic-bezier(${config.cubicBezier.join(', ')})`
                : config.timingFunction}{' '}
              {config.delay}s {config.infinite ? 'infinite' : config.iterationCount}{' '}
              {config.direction} {config.fillMode};
            </code>
          </div>

          {/* ── Privacy badge ── */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-xs text-gray-400">
              Everything runs locally in your browser. No data is sent to any server.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
