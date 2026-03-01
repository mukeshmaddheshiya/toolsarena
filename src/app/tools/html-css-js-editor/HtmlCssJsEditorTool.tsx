'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, RefreshCw, Download, Copy, Check, Maximize2, Minimize2,
  Terminal, ChevronDown, Layout, Columns, Rows, Expand, Code2,
} from 'lucide-react';

// ─── Templates ────────────────────────────────────────────────────────────────
const TEMPLATES = {
  blank: {
    label: 'Blank',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Project</title>
</head>
<body>

</body>
</html>`,
    css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 2rem;
  background: #f9fafb;
  color: #111827;
}`,
    js: `// Your JavaScript here
`,
  },

  hello: {
    label: 'Hello World',
    html: `<div class="container">
  <h1>Hello, World! 👋</h1>
  <p>Edit this code and see live preview!</p>
  <button onclick="greet()">Say Hello</button>
  <p id="msg"></p>
</div>`,
    css: `body {
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.container {
  text-align: center;
  background: white;
  padding: 3rem;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px rgba(0,0,0,0.2);
}
h1 { font-size: 2.5rem; margin-bottom: 0.5rem; color: #1f2937; }
p { color: #6b7280; margin-bottom: 1.5rem; }
button {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
button:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(102,126,234,0.4); }
#msg { color: #764ba2; font-weight: 600; font-size: 1.1rem; }`,
    js: `function greet() {
  const messages = ['Hello! 😊', 'How are you? 🌟', 'Welcome! 🎉', 'Keep coding! 💻'];
  const msg = document.getElementById('msg');
  msg.textContent = messages[Math.floor(Math.random() * messages.length)];
}`,
  },

  counter: {
    label: 'Counter App',
    html: `<div class="app">
  <h1>Counter</h1>
  <div class="display" id="count">0</div>
  <div class="controls">
    <button class="btn minus" onclick="change(-1)">−</button>
    <button class="btn reset" onclick="reset()">Reset</button>
    <button class="btn plus" onclick="change(1)">+</button>
  </div>
</div>`,
    css: `body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  font-family: 'Segoe UI', sans-serif;
}
.app {
  text-align: center;
  color: white;
}
h1 {
  font-size: 1.2rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 1rem;
}
.display {
  font-size: 8rem;
  font-weight: 800;
  line-height: 1;
  margin: 1rem 0;
  color: #f1f5f9;
  transition: transform 0.1s, color 0.3s;
}
.display.positive { color: #4ade80; }
.display.negative { color: #f87171; }
.controls { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }
.btn {
  width: 64px; height: 64px;
  border: none; border-radius: 50%;
  font-size: 1.8rem; cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}
.btn:hover { transform: scale(1.1); }
.btn:active { transform: scale(0.95); }
.minus { background: #ef4444; color: white; }
.plus { background: #22c55e; color: white; }
.reset { background: #334155; color: #94a3b8; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em; }`,
    js: `let count = 0;

function change(val) {
  count += val;
  const el = document.getElementById('count');
  el.textContent = count;
  el.className = 'display' + (count > 0 ? ' positive' : count < 0 ? ' negative' : '');
  el.style.transform = 'scale(1.15)';
  setTimeout(() => el.style.transform = '', 100);
}

function reset() {
  count = 0;
  const el = document.getElementById('count');
  el.textContent = 0;
  el.className = 'display';
}`,
  },

  todo: {
    label: 'Todo App',
    html: `<div class="app">
  <h1>✅ Todo List</h1>
  <div class="input-row">
    <input id="inp" type="text" placeholder="Add a new task…" onkeydown="if(event.key==='Enter')add()">
    <button onclick="add()">Add</button>
  </div>
  <ul id="list"></ul>
  <p id="empty">No tasks yet. Add one above! 🎯</p>
</div>`,
    css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Segoe UI', sans-serif;
  background: #f0f4ff;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
}
.app {
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 10px 40px rgba(99,102,241,0.12);
  height: fit-content;
}
h1 { font-size: 1.5rem; margin-bottom: 1.25rem; color: #1e1b4b; }
.input-row { display: flex; gap: 0.5rem; margin-bottom: 1.25rem; }
input {
  flex: 1; padding: 0.65rem 1rem;
  border: 2px solid #e0e7ff; border-radius: 0.75rem;
  font-size: 0.95rem; outline: none; color: #1e1b4b;
  transition: border-color 0.2s;
}
input:focus { border-color: #6366f1; }
button {
  background: #6366f1; color: white; border: none;
  padding: 0.65rem 1.25rem; border-radius: 0.75rem;
  font-size: 0.95rem; font-weight: 600; cursor: pointer;
  transition: background 0.2s;
}
button:hover { background: #4f46e5; }
ul { list-style: none; }
li {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.75rem; border-radius: 0.75rem;
  margin-bottom: 0.5rem; background: #f8faff;
  border: 1px solid #e0e7ff; transition: all 0.2s;
}
li:hover { border-color: #6366f1; }
li.done span { text-decoration: line-through; color: #a5b4fc; }
li input[type=checkbox] { accent-color: #6366f1; width:18px; height:18px; cursor:pointer; flex-shrink:0; }
li span { flex: 1; color: #3730a3; font-size: 0.95rem; }
li .del { background: none; padding: 0.25rem 0.5rem; color: #94a3b8; font-size: 1rem; border-radius: 0.5rem; }
li .del:hover { background: #fee2e2; color: #ef4444; }
#empty { text-align: center; color: #a5b4fc; padding: 2rem 0; }`,
    js: `let tasks = [];

function add() {
  const inp = document.getElementById('inp');
  const text = inp.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text, done: false });
  inp.value = '';
  render();
}

function toggle(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  render();
}

function remove(id) {
  tasks = tasks.filter(t => t.id !== id);
  render();
}

function render() {
  const list = document.getElementById('list');
  const empty = document.getElementById('empty');
  empty.style.display = tasks.length ? 'none' : 'block';
  list.innerHTML = tasks.map(t => \`
    <li class="\${t.done ? 'done' : ''}">
      <input type="checkbox" \${t.done ? 'checked' : ''} onchange="toggle(\${t.id})">
      <span>\${t.text}</span>
      <button class="del" onclick="remove(\${t.id})">✕</button>
    </li>
  \`).join('');
}`,
  },

  card: {
    label: 'Profile Card',
    html: `<div class="card">
  <div class="avatar">MK</div>
  <h2>Mukesh Kumar</h2>
  <p class="role">Frontend Developer</p>
  <div class="stats">
    <div><strong>48</strong><span>Projects</span></div>
    <div><strong>12K</strong><span>Followers</span></div>
    <div><strong>256</strong><span>Stars</span></div>
  </div>
  <button onclick="this.textContent = this.textContent === 'Follow' ? 'Following ✓' : 'Follow'">Follow</button>
</div>`,
    css: `body {
  margin: 0; min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  font-family: 'Segoe UI', sans-serif;
}
.card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  text-align: center;
  width: 280px;
  box-shadow: 0 25px 60px rgba(0,0,0,0.5);
}
.avatar {
  width: 80px; height: 80px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 50%; display: flex;
  align-items: center; justify-content: center;
  font-size: 1.5rem; font-weight: 700; color: white;
  margin: 0 auto 1rem;
}
h2 { color: #f1f5f9; margin: 0 0 0.25rem; }
.role { color: #64748b; font-size: 0.9rem; margin: 0 0 1.5rem; }
.stats {
  display: flex; justify-content: space-around;
  padding: 1.25rem 0; border-top: 1px solid #334155;
  border-bottom: 1px solid #334155; margin-bottom: 1.5rem;
}
.stats div { display: flex; flex-direction: column; gap: 0.2rem; }
.stats strong { color: #f1f5f9; font-size: 1.1rem; }
.stats span { color: #64748b; font-size: 0.75rem; }
button {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white; border: none; padding: 0.75rem 2.5rem;
  border-radius: 9999px; font-size: 0.95rem; font-weight: 600;
  cursor: pointer; transition: opacity 0.2s, transform 0.2s;
}
button:hover { opacity: 0.85; transform: scale(1.03); }`,
    js: `// No JS needed for this example
console.log('Card component loaded!');`,
  },

  clock: {
    label: 'Digital Clock',
    html: `<div class="clock-wrap">
  <div class="clock" id="clock">00:00:00</div>
  <div class="date" id="date"></div>
</div>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  min-height: 100vh; display: flex;
  align-items: center; justify-content: center;
  background: #0a0a0a; font-family: 'Courier New', monospace;
}
.clock-wrap { text-align: center; }
.clock {
  font-size: clamp(3rem, 15vw, 8rem);
  font-weight: 700; letter-spacing: 0.05em;
  background: linear-gradient(135deg, #00f5ff, #0080ff, #8000ff);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 60px rgba(0, 245, 255, 0.3);
  filter: drop-shadow(0 0 20px rgba(0,200,255,0.5));
}
.date {
  color: #4a4a4a; font-size: 1rem;
  letter-spacing: 0.25em; text-transform: uppercase; margin-top: 1rem;
}`,
    js: `function tick() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').textContent = \`\${h}:\${m}:\${s}\`;

  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  document.getElementById('date').textContent =
    \`\${days[now.getDay()]}, \${months[now.getMonth()]} \${now.getDate()}, \${now.getFullYear()}\`;
}

tick();
setInterval(tick, 1000);`,
  },
};

// ─── Console Message Types ────────────────────────────────────────────────────
interface ConsoleMsg { type: 'log' | 'warn' | 'error' | 'info'; args: string[]; time: string; }

// ─── Layout Types ─────────────────────────────────────────────────────────────
type Layout = 'split-h' | 'split-v' | 'preview' | 'editor';
type ActivePanel = 'html' | 'css' | 'js';

// ─── Build iframe src ─────────────────────────────────────────────────────────
function buildSrc(html: string, css: string, js: string): string {
  const consoleProxy = `
<script>
(function() {
  const send = (type, args) => {
    try {
      window.parent.postMessage({ __editor: true, type, args: args.map(a => {
        try { return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a); } catch { return String(a); }
      }), time: new Date().toLocaleTimeString() }, '*');
    } catch(e) {}
  };
  ['log','warn','error','info'].forEach(m => {
    const orig = console[m].bind(console);
    console[m] = (...a) => { send(m, a); orig(...a); };
  });
  window.onerror = (msg, src, line, col) => {
    send('error', [\`\${msg} (line \${line})\`]);
    return false;
  };
  window.addEventListener('unhandledrejection', e => {
    send('error', [\`Unhandled Promise: \${e.reason}\`]);
  });
})();
<\/script>`;

  // Check if user wrote full HTML doc
  const isFullDoc = /<html/i.test(html);
  if (isFullDoc) {
    let doc = html;
    if (!/<\/head>/i.test(doc)) {
      doc = doc.replace(/<body/i, `<head>${consoleProxy}<style>${css}</style></head><body`);
    } else {
      doc = doc.replace(/<\/head>/i, `${consoleProxy}<style>${css}</style></head>`);
    }
    if (!/<\/body>/i.test(doc)) {
      doc += `<script>\n${js}\n<\/script>`;
    } else {
      doc = doc.replace(/<\/body>/i, `<script>\n${js}\n<\/script></body>`);
    }
    return doc;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${consoleProxy}
<style>${css}</style>
</head>
<body>
${html}
<script>
try { ${js} } catch(e) { console.error(e.message); }
<\/script>
</body>
</html>`;
}

// ─── Panel colors ─────────────────────────────────────────────────────────────
const PANEL_META = {
  html: { label: 'HTML', dot: 'bg-orange-500', color: 'text-orange-400' },
  css:  { label: 'CSS',  dot: 'bg-blue-500',   color: 'text-blue-400' },
  js:   { label: 'JS',   dot: 'bg-yellow-400',  color: 'text-yellow-400' },
};

// ─── Component ────────────────────────────────────────────────────────────────
export function HtmlCssJsEditorTool() {
  const [html, setHtml] = useState(TEMPLATES.hello.html);
  const [css, setCss] = useState(TEMPLATES.hello.css);
  const [js, setJs] = useState(TEMPLATES.hello.js);
  const [src, setSrc] = useState('');
  const [autoRun, setAutoRun] = useState(true);
  const [layout, setLayout] = useState<Layout>('split-h');
  const [activePanel, setActivePanel] = useState<ActivePanel>('html');
  const [consoleMsgs, setConsoleMsgs] = useState<ConsoleMsg[]>([]);
  const [showConsole, setShowConsole] = useState(false);
  const [fullPreview, setFullPreview] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Listen for console messages from iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data?.__editor) return;
      const msg = e.data as ConsoleMsg & { __editor: boolean };
      setConsoleMsgs(prev => [...prev.slice(-99), { type: msg.type, args: msg.args, time: msg.time }]);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Auto-run debounce
  const run = useCallback(() => {
    setSrc(buildSrc(html, css, js));
    setConsoleMsgs([]);
  }, [html, css, js]);

  useEffect(() => {
    if (!autoRun) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(run, 600);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [html, css, js, autoRun, run]);

  // Initial run
  useEffect(() => { run(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTemplate = (key: keyof typeof TEMPLATES) => {
    const t = TEMPLATES[key];
    setHtml(t.html); setCss(t.css); setJs(t.js);
    setShowTemplates(false);
    setConsoleMsgs([]);
  };

  const copyPanel = async (panel: 'html' | 'css' | 'js') => {
    const code = panel === 'html' ? html : panel === 'css' ? css : js;
    await navigator.clipboard.writeText(code);
    setCopied(panel);
    setTimeout(() => setCopied(null), 2000);
  };

  const download = () => {
    const blob = new Blob([buildSrc(html, css, js)], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'project.html'; a.click();
    URL.revokeObjectURL(url);
  };

  const errorCount = consoleMsgs.filter(m => m.type === 'error').length;

  // ── Editor pane ──────────────────────────────────────────────────────────
  const EditorPane = () => (
    <div className="flex flex-col h-full min-h-0 bg-[#1e1e2e]">
      {/* Tab bar */}
      <div className="flex items-center border-b border-[#313244] shrink-0">
        {(['html', 'css', 'js'] as const).map(p => (
          <button
            key={p}
            onClick={() => setActivePanel(p)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-r border-[#313244] transition-colors ${
              activePanel === p
                ? 'bg-[#181825] text-white border-t-2 border-t-[#cba6f7]'
                : 'text-[#6c7086] hover:text-white hover:bg-[#313244]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${PANEL_META[p].dot}`} />
            {PANEL_META[p].label}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => copyPanel(activePanel)}
          className="flex items-center gap-1 px-3 py-2 text-xs text-[#6c7086] hover:text-white transition-colors"
        >
          {copied === activePanel ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied === activePanel ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Active editor */}
      <div className="flex-1 relative min-h-0">
        {(['html', 'css', 'js'] as const).map(p => (
          <textarea
            key={p}
            value={p === 'html' ? html : p === 'css' ? css : js}
            onChange={e => p === 'html' ? setHtml(e.target.value) : p === 'css' ? setCss(e.target.value) : setJs(e.target.value)}
            spellCheck={false}
            className={`absolute inset-0 w-full h-full resize-none bg-[#1e1e2e] text-[#cdd6f4] font-mono text-sm leading-relaxed p-4 focus:outline-none ${activePanel === p ? 'block' : 'hidden'}`}
            onKeyDown={e => {
              // Tab key inserts spaces
              if (e.key === 'Tab') {
                e.preventDefault();
                const ta = e.currentTarget;
                const start = ta.selectionStart;
                const end = ta.selectionEnd;
                const val = ta.value;
                const newVal = val.substring(0, start) + '  ' + val.substring(end);
                const setter = p === 'html' ? setHtml : p === 'css' ? setCss : setJs;
                setter(newVal);
                requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + 2; });
              }
            }}
          />
        ))}
      </div>
    </div>
  );

  // ── Preview pane ─────────────────────────────────────────────────────────
  const PreviewPane = () => (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center px-3 py-2 bg-[#181825] border-b border-[#313244] shrink-0 gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#f38ba8]" />
          <div className="w-3 h-3 rounded-full bg-[#f9e2af]" />
          <div className="w-3 h-3 rounded-full bg-[#a6e3a1]" />
        </div>
        <span className="text-xs text-[#6c7086] flex-1 text-center">Preview</span>
        <button onClick={() => setFullPreview(f => !f)} className="text-[#6c7086] hover:text-white transition-colors">
          {fullPreview ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
      <div className="flex-1 bg-white min-h-0">
        <iframe
          srcDoc={src}
          sandbox="allow-scripts allow-modals allow-forms"
          className="w-full h-full border-0"
          title="preview"
        />
      </div>
    </div>
  );

  // ── Console panel ─────────────────────────────────────────────────────────
  const ConsolePanel = () => (
    <div className="flex flex-col bg-[#181825] border-t border-[#313244] shrink-0" style={{ height: showConsole ? 160 : 'auto' }}>
      <button
        onClick={() => setShowConsole(s => !s)}
        className="flex items-center gap-2 px-4 py-2 text-xs text-[#6c7086] hover:text-white border-b border-[#313244] transition-colors w-full text-left"
      >
        <Terminal className="w-3.5 h-3.5" />
        Console
        {errorCount > 0 && <span className="ml-1 px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold">{errorCount}</span>}
        {consoleMsgs.length > 0 && <span className="ml-1 px-1.5 py-0.5 rounded bg-[#313244] text-[#6c7086] text-[10px]">{consoleMsgs.length}</span>}
        <ChevronDown className={`w-3.5 h-3.5 ml-auto transition-transform ${showConsole ? 'rotate-180' : ''}`} />
        {consoleMsgs.length > 0 && (
          <span
            onClick={e => { e.stopPropagation(); setConsoleMsgs([]); }}
            className="text-[#6c7086] hover:text-white px-1"
            title="Clear"
          >✕</span>
        )}
      </button>
      {showConsole && (
        <div className="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-0.5">
          {consoleMsgs.length === 0 ? (
            <p className="text-[#45475a] italic px-1">No console output yet…</p>
          ) : (
            consoleMsgs.map((m, i) => (
              <div key={i} className={`flex gap-2 px-1 py-0.5 rounded ${
                m.type === 'error' ? 'text-red-400 bg-red-950/30' :
                m.type === 'warn' ? 'text-yellow-400 bg-yellow-950/20' :
                m.type === 'info' ? 'text-blue-400' : 'text-[#cdd6f4]'
              }`}>
                <span className="text-[#45475a] shrink-0">{m.time}</span>
                <span className="break-all">{m.args.join(' ')}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  // ── Full preview overlay ──────────────────────────────────────────────────
  if (fullPreview) return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex items-center px-4 py-2 bg-[#181825] gap-3 shrink-0">
        <button onClick={() => setFullPreview(false)} className="flex items-center gap-2 text-sm text-[#6c7086] hover:text-white transition-colors">
          <Minimize2 className="w-4 h-4" /> Exit Full Screen
        </button>
        <div className="flex-1" />
        {!autoRun && <button onClick={run} className="flex items-center gap-1.5 text-sm text-[#a6e3a1] hover:text-white"><Play className="w-3.5 h-3.5" /> Run</button>}
      </div>
      <iframe srcDoc={src} sandbox="allow-scripts allow-modals allow-forms" className="flex-1 border-0 bg-white" title="preview-full" />
    </div>
  );

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-[#313244] shadow-2xl" style={{ height: '75vh', minHeight: 500, background: '#1e1e2e' }}>
      {/* ── Top toolbar ── */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#181825] border-b border-[#313244] shrink-0 flex-wrap">
        {/* Template picker */}
        <div className="relative">
          <button
            onClick={() => setShowTemplates(s => !s)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#313244] text-[#cdd6f4] text-xs font-medium hover:bg-[#45475a] transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" /> Templates <ChevronDown className="w-3 h-3" />
          </button>
          {showTemplates && (
            <div className="absolute top-full left-0 mt-1 z-20 bg-[#181825] border border-[#313244] rounded-xl shadow-xl overflow-hidden">
              {Object.entries(TEMPLATES).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => loadTemplate(key as keyof typeof TEMPLATES)}
                  className="w-full text-left px-4 py-2 text-xs text-[#cdd6f4] hover:bg-[#313244] transition-colors whitespace-nowrap"
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Layout buttons */}
        <div className="flex rounded-lg overflow-hidden border border-[#313244]">
          {([
            { id: 'split-h', icon: <Columns className="w-3.5 h-3.5" />, title: 'Side by side' },
            { id: 'split-v', icon: <Rows className="w-3.5 h-3.5" />, title: 'Top / Bottom' },
            { id: 'editor', icon: <Code2 className="w-3.5 h-3.5" />, title: 'Editor only' },
            { id: 'preview', icon: <Expand className="w-3.5 h-3.5" />, title: 'Preview only' },
          ] as const).map(({ id, icon, title }) => (
            <button
              key={id}
              title={title}
              onClick={() => setLayout(id)}
              className={`px-2.5 py-1.5 transition-colors ${layout === id ? 'bg-[#cba6f7] text-[#1e1e2e]' : 'text-[#6c7086] hover:text-white hover:bg-[#313244]'}`}
            >
              {icon}
            </button>
          ))}
        </div>

        {/* Auto-run toggle */}
        <button
          onClick={() => setAutoRun(a => !a)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${autoRun ? 'bg-[#a6e3a1]/20 text-[#a6e3a1]' : 'bg-[#313244] text-[#6c7086] hover:text-white'}`}
        >
          <div className={`w-2 h-2 rounded-full ${autoRun ? 'bg-[#a6e3a1] animate-pulse' : 'bg-[#45475a]'}`} />
          {autoRun ? 'Auto' : 'Manual'}
        </button>

        <div className="flex-1" />

        {/* Run button */}
        {!autoRun && (
          <button
            onClick={run}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#a6e3a1] text-[#1e1e2e] text-xs font-bold hover:bg-[#94d8a0] transition-colors"
          >
            <Play className="w-3.5 h-3.5" /> Run
          </button>
        )}
        <button onClick={run} title="Refresh preview" className="p-1.5 text-[#6c7086] hover:text-white transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => setFullPreview(true)} title="Full screen preview" className="p-1.5 text-[#6c7086] hover:text-white transition-colors">
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <button onClick={download} title="Download HTML" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#313244] text-[#cdd6f4] text-xs hover:bg-[#45475a] transition-colors">
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Main area ── */}
      <div className={`flex-1 min-h-0 flex ${layout === 'split-v' ? 'flex-col' : 'flex-row'}`}>
        {/* Editor */}
        {layout !== 'preview' && (
          <div className={`min-h-0 min-w-0 ${layout === 'split-h' ? 'w-1/2 border-r border-[#313244]' : layout === 'split-v' ? 'h-1/2 border-b border-[#313244]' : 'flex-1'}`}>
            <EditorPane />
          </div>
        )}

        {/* Preview + Console */}
        {layout !== 'editor' && (
          <div className={`min-h-0 min-w-0 flex flex-col ${layout === 'split-h' ? 'w-1/2' : layout === 'split-v' ? 'h-1/2' : 'flex-1'}`}>
            <div className="flex-1 min-h-0">
              <PreviewPane />
            </div>
            <ConsolePanel />
          </div>
        )}
      </div>

      {/* Click outside to close template dropdown */}
      {showTemplates && <div className="fixed inset-0 z-10" onClick={() => setShowTemplates(false)} />}
    </div>
  );
}
