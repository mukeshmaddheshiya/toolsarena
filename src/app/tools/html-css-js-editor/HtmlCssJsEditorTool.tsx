'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, RefreshCw, Download, Maximize2, Minimize2,
  Terminal, ChevronDown, Columns, Rows, Expand, Code2,
} from 'lucide-react';

// ─── Autocomplete Data ────────────────────────────────────────────────────────
const HTML_TAGS = [
  'a','abbr','address','article','aside','audio','b','blockquote','body','br',
  'button','canvas','caption','cite','code','col','colgroup','datalist','dd',
  'del','details','dfn','dialog','div','dl','dt','em','embed','fieldset',
  'figcaption','figure','footer','form','h1','h2','h3','h4','h5','h6','head',
  'header','hr','html','i','iframe','img','input','ins','kbd','label','legend',
  'li','link','main','map','mark','menu','meta','meter','nav','noscript','ol',
  'optgroup','option','output','p','picture','pre','progress','q','script',
  'section','select','small','source','span','strong','style','sub','summary',
  'sup','svg','table','tbody','td','template','textarea','tfoot','th','thead',
  'time','title','tr','track','ul','var','video','wbr',
];

const HTML_GLOBAL_ATTRS = [
  'class','id','style','title','lang','dir','tabindex','hidden','contenteditable',
  'draggable','spellcheck','role','accesskey','data-',
];

const HTML_ATTRS: Record<string, string[]> = {
  a:        ['href','target','rel','download','hreflang','type'],
  img:      ['src','alt','width','height','loading','srcset','sizes','decoding'],
  input:    ['type','name','value','placeholder','required','disabled','readonly',
             'checked','min','max','maxlength','minlength','pattern','autocomplete',
             'autofocus','multiple','accept','step','list','form'],
  form:     ['action','method','enctype','target','novalidate','autocomplete'],
  button:   ['type','disabled','form','formaction','formmethod','name','value'],
  select:   ['name','multiple','disabled','required','size','form'],
  textarea: ['name','rows','cols','placeholder','disabled','readonly','required',
             'maxlength','minlength','autofocus','form','wrap'],
  link:     ['rel','href','type','media','crossorigin','integrity','as'],
  script:   ['src','type','defer','async','crossorigin','integrity','nomodule'],
  meta:     ['name','content','charset','http-equiv','property'],
  video:    ['src','controls','autoplay','loop','muted','preload','poster','width','height'],
  audio:    ['src','controls','autoplay','loop','muted','preload'],
  iframe:   ['src','width','height','frameborder','allowfullscreen','sandbox','title','loading'],
  table:    ['border','cellpadding','cellspacing','summary'],
  th:       ['colspan','rowspan','scope','headers'],
  td:       ['colspan','rowspan','headers'],
  col:      ['span'],
  colgroup: ['span'],
  li:       ['value'],
  ol:       ['type','start','reversed'],
  source:   ['src','type','srcset','media','sizes'],
  track:    ['kind','src','srclang','label','default'],
  label:    ['for','form'],
  option:   ['value','selected','disabled','label'],
  optgroup: ['label','disabled'],
};

const CSS_PROPS = [
  'align-content','align-items','align-self','animation','animation-delay',
  'animation-direction','animation-duration','animation-fill-mode',
  'animation-iteration-count','animation-name','animation-play-state',
  'animation-timing-function','backdrop-filter','background','background-attachment',
  'background-blend-mode','background-clip','background-color','background-image',
  'background-origin','background-position','background-repeat','background-size',
  'border','border-bottom','border-bottom-color','border-bottom-left-radius',
  'border-bottom-right-radius','border-bottom-style','border-bottom-width',
  'border-collapse','border-color','border-left','border-left-color',
  'border-left-style','border-left-width','border-radius','border-right',
  'border-right-color','border-right-style','border-right-width','border-spacing',
  'border-style','border-top','border-top-color','border-top-left-radius',
  'border-top-right-radius','border-top-style','border-top-width','border-width',
  'bottom','box-shadow','box-sizing','caption-side','clear','clip-path','color',
  'column-gap','columns','content','counter-increment','counter-reset','cursor',
  'direction','display','filter','flex','flex-basis','flex-direction','flex-flow',
  'flex-grow','flex-shrink','flex-wrap','float','font','font-family','font-size',
  'font-size-adjust','font-stretch','font-style','font-variant','font-weight',
  'gap','grid','grid-area','grid-auto-columns','grid-auto-flow','grid-auto-rows',
  'grid-column','grid-column-end','grid-column-gap','grid-column-start','grid-gap',
  'grid-row','grid-row-end','grid-row-gap','grid-row-start','grid-template',
  'grid-template-areas','grid-template-columns','grid-template-rows','height',
  'justify-content','justify-items','justify-self','left','letter-spacing',
  'line-height','list-style','list-style-image','list-style-position',
  'list-style-type','margin','margin-bottom','margin-left','margin-right',
  'margin-top','max-height','max-width','min-height','min-width','object-fit',
  'object-position','opacity','order','outline','outline-color','outline-offset',
  'outline-style','outline-width','overflow','overflow-x','overflow-y','padding',
  'padding-bottom','padding-left','padding-right','padding-top','place-content',
  'place-items','place-self','pointer-events','position','resize','right',
  'row-gap','scroll-behavior','text-align','text-decoration','text-decoration-color',
  'text-decoration-line','text-decoration-style','text-overflow','text-shadow',
  'text-transform','top','transform','transform-origin','transition',
  'transition-delay','transition-duration','transition-property',
  'transition-timing-function','user-select','vertical-align','visibility',
  'white-space','width','word-break','word-spacing','word-wrap','writing-mode',
  'z-index',
];

const JS_KEYWORDS = [
  // Keywords
  'async','await','break','case','catch','class','const','continue','debugger',
  'default','delete','do','else','export','extends','finally','for','from',
  'function','if','import','in','instanceof','let','new','null','of','return',
  'static','super','switch','this','throw','try','typeof','undefined','var',
  'void','while','with','yield',
  // Globals / built-ins
  'Array','Boolean','console','clearInterval','clearTimeout','Date','decodeURI',
  'document','encodeURI','Error','event','fetch','Infinity','isNaN','JSON',
  'localStorage','Math','NaN','Number','Object','parseFloat','parseInt','Promise',
  'RegExp','sessionStorage','Set','setTimeout','setInterval','String','Symbol',
  'true','false','window','WeakMap','WeakSet',
];

const CONSOLE_METHODS = ['log','error','warn','info','table','clear','group','groupEnd','dir','assert','count','time','timeEnd'];
const DOCUMENT_METHODS = ['getElementById','getElementsByClassName','getElementsByTagName','querySelector','querySelectorAll','createElement','createTextNode','createDocumentFragment','addEventListener','removeEventListener','appendChild','removeChild','insertBefore','replaceChild','getAttribute','setAttribute','removeAttribute','classList','dataset','innerHTML','innerText','textContent','style','parentElement','children','childNodes','firstChild','lastChild','nextSibling','previousSibling','closest','matches','scrollIntoView','focus','blur','click','dispatchEvent'];
const MATH_METHODS = ['abs','ceil','floor','round','max','min','pow','sqrt','random','PI','E','log','sin','cos','tan','atan2','hypot','sign','trunc'];
const ARRAY_METHODS = ['push','pop','shift','unshift','splice','slice','map','filter','reduce','forEach','find','findIndex','some','every','includes','indexOf','join','concat','flat','flatMap','sort','reverse','fill','copyWithin','keys','values','entries','from','isArray','of'];

interface AcResult {
  suggestions: string[];
  replace: { start: number; end: number };
  type: string;
}

function getSuggestions(value: string, pos: number, panel: 'html' | 'css' | 'js'): AcResult | null {
  const before = value.substring(0, pos);

  if (panel === 'html') {
    const lastOpen = before.lastIndexOf('<');
    const lastClose = before.lastIndexOf('>');
    if (lastOpen <= lastClose) return null;
    const tagContent = before.substring(lastOpen + 1);
    if (tagContent.startsWith('/') || tagContent.startsWith('!')) return null;

    // Typing attribute value — don't interfere
    const inQuote = (tagContent.match(/"/g) || []).length % 2 !== 0 ||
                    (tagContent.match(/'/g) || []).length % 2 !== 0;
    if (inQuote) return null;

    // Suggest tag name: only letters after <
    const tagNameOnly = tagContent.match(/^([a-z]*)$/i);
    if (tagNameOnly) {
      const partial = tagNameOnly[1];
      const filtered = HTML_TAGS.filter(t => t.startsWith(partial) && t !== partial);
      if (!filtered.length) return null;
      return { suggestions: filtered.slice(0, 12), replace: { start: pos - partial.length, end: pos }, type: 'tag' };
    }

    // Suggest attribute: after tag name + space, typing attr
    const attrCtx = tagContent.match(/^([a-z][a-z0-9]*)\s+((?:[\w-]+=(?:"[^"]*"|'[^']*')\s+)*)([a-z-]*)$/i);
    if (attrCtx) {
      const tagName = attrCtx[1].toLowerCase();
      const partial = attrCtx[3] || '';
      const tagAttrs = HTML_ATTRS[tagName] || [];
      const all = [...new Set([...HTML_GLOBAL_ATTRS, ...tagAttrs])];
      const filtered = all.filter(a => a.startsWith(partial));
      if (!filtered.length || (!partial && tagContent.slice(-1) !== ' ')) return null;
      return { suggestions: filtered.slice(0, 12), replace: { start: pos - partial.length, end: pos }, type: 'attr' };
    }
    return null;
  }

  if (panel === 'css') {
    const lines = before.split('\n');
    const line = lines[lines.length - 1];

    // After colon — could suggest values, skip for now to avoid noise
    if (line.includes(':')) return null;

    // Typing a CSS property name (after { or on new indented line)
    const propMatch = line.match(/^(\s*)([\w-]*)$/);
    if (propMatch && propMatch[2].length >= 1) {
      const partial = propMatch[2];
      const filtered = CSS_PROPS.filter(p => p.startsWith(partial) && p !== partial);
      if (!filtered.length) return null;
      return { suggestions: filtered.slice(0, 12), replace: { start: pos - partial.length, end: pos }, type: 'prop' };
    }
    return null;
  }

  if (panel === 'js') {
    // After `console.`
    const consoleMatch = before.match(/console\.(\w*)$/);
    if (consoleMatch) {
      const partial = consoleMatch[1];
      const filtered = CONSOLE_METHODS.filter(m => m.startsWith(partial));
      if (!filtered.length && partial.length === 0) return { suggestions: CONSOLE_METHODS, replace: { start: pos, end: pos }, type: 'method' };
      if (!filtered.length) return null;
      return { suggestions: filtered, replace: { start: pos - partial.length, end: pos }, type: 'method' };
    }

    // After `document.`
    const docMatch = before.match(/document\.(\w*)$/);
    if (docMatch) {
      const partial = docMatch[1];
      const filtered = DOCUMENT_METHODS.filter(m => m.startsWith(partial));
      if (!filtered.length && partial.length === 0) return { suggestions: DOCUMENT_METHODS.slice(0, 12), replace: { start: pos, end: pos }, type: 'method' };
      if (!filtered.length) return null;
      return { suggestions: filtered.slice(0, 12), replace: { start: pos - partial.length, end: pos }, type: 'method' };
    }

    // After `Math.`
    const mathMatch = before.match(/Math\.(\w*)$/);
    if (mathMatch) {
      const partial = mathMatch[1];
      const filtered = MATH_METHODS.filter(m => m.startsWith(partial));
      if (!filtered.length && partial.length === 0) return { suggestions: MATH_METHODS, replace: { start: pos, end: pos }, type: 'method' };
      if (!filtered.length) return null;
      return { suggestions: filtered, replace: { start: pos - partial.length, end: pos }, type: 'method' };
    }

    // After `.` (array methods)
    const arrMatch = before.match(/\.(\w*)$/);
    if (arrMatch && !before.match(/\w+\.\w+\.\w*$/)) {
      const partial = arrMatch[1];
      if (partial.length >= 1) {
        const filtered = ARRAY_METHODS.filter(m => m.startsWith(partial));
        if (filtered.length) return { suggestions: filtered.slice(0, 10), replace: { start: pos - partial.length, end: pos }, type: 'method' };
      }
    }

    // JS keywords
    const kwMatch = before.match(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)$/);
    if (kwMatch && kwMatch[1].length >= 2) {
      const partial = kwMatch[1];
      const filtered = JS_KEYWORDS.filter(k => k.startsWith(partial) && k !== partial);
      if (!filtered.length) return null;
      return { suggestions: filtered.slice(0, 10), replace: { start: pos - partial.length, end: pos }, type: 'keyword' };
    }
    return null;
  }

  return null;
}

function getCaretPixelPos(textarea: HTMLTextAreaElement): { top: number; left: number } {
  const pos = textarea.selectionStart;
  const text = textarea.value.substring(0, pos);
  const lines = text.split('\n');
  const lineNum = lines.length - 1;
  const colNum = lines[lines.length - 1].length;
  const rect = textarea.getBoundingClientRect();
  const scrollTop = textarea.scrollTop;
  const lineHeight = 21;
  const charWidth = 8.15;
  const padTop = 16;
  const padLeft = 16;
  return {
    top: rect.top + padTop + lineNum * lineHeight - scrollTop + lineHeight + 4,
    left: Math.min(rect.left + padLeft + colNum * charWidth, rect.right - 220),
  };
}

// ─── Templates ────────────────────────────────────────────────────────────────
const TEMPLATES = {
  blank: {
    label: 'Blank',
    html: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Project</title>\n</head>\n<body>\n\n</body>\n</html>`,
    css:  `* { box-sizing: border-box; margin: 0; padding: 0; }\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;\n  padding: 2rem;\n  background: #f9fafb;\n  color: #111827;\n}`,
    js:   `// Your JavaScript here\n`,
  },
  hello: {
    label: 'Hello World',
    html: `<div class="container">\n  <h1>Hello, World! 👋</h1>\n  <p>Edit this code and see live preview!</p>\n  <button onclick="greet()">Say Hello</button>\n  <p id="msg"></p>\n</div>`,
    css:  `body {\n  font-family: 'Segoe UI', sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  margin: 0;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n}\n.container {\n  text-align: center;\n  background: white;\n  padding: 3rem;\n  border-radius: 1.5rem;\n  box-shadow: 0 25px 50px rgba(0,0,0,0.2);\n}\nh1 { font-size: 2.5rem; margin-bottom: 0.5rem; color: #1f2937; }\np { color: #6b7280; margin-bottom: 1.5rem; }\nbutton {\n  background: linear-gradient(135deg, #667eea, #764ba2);\n  color: white; border: none; padding: 0.75rem 2rem;\n  border-radius: 9999px; font-size: 1rem; cursor: pointer;\n  transition: transform 0.2s;\n}\nbutton:hover { transform: translateY(-2px); }\n#msg { color: #764ba2; font-weight: 600; font-size: 1.1rem; }`,
    js:   `function greet() {\n  const msgs = ['Hello! 😊', 'How are you? 🌟', 'Welcome! 🎉', 'Keep coding! 💻'];\n  document.getElementById('msg').textContent = msgs[Math.floor(Math.random() * msgs.length)];\n}`,
  },
  counter: {
    label: 'Counter App',
    html: `<div class="app">\n  <h1>Counter</h1>\n  <div class="display" id="count">0</div>\n  <div class="controls">\n    <button class="btn minus" onclick="change(-1)">−</button>\n    <button class="btn reset" onclick="reset()">Reset</button>\n    <button class="btn plus" onclick="change(1)">+</button>\n  </div>\n</div>`,
    css:  `body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; background:#0f172a; font-family:'Segoe UI',sans-serif; }\n.app { text-align:center; color:white; }\nh1 { font-size:1.2rem; letter-spacing:.2em; text-transform:uppercase; color:#64748b; }\n.display { font-size:8rem; font-weight:800; color:#f1f5f9; transition:transform .1s,color .3s; }\n.display.positive { color:#4ade80; }\n.display.negative { color:#f87171; }\n.controls { display:flex; gap:1rem; justify-content:center; margin-top:2rem; }\n.btn { width:64px; height:64px; border:none; border-radius:50%; font-size:1.8rem; cursor:pointer; transition:transform .15s; }\n.btn:hover { transform:scale(1.1); }\n.btn:active { transform:scale(.95); }\n.minus { background:#ef4444; color:white; }\n.plus { background:#22c55e; color:white; }\n.reset { background:#334155; color:#94a3b8; font-size:.75rem; font-weight:600; }`,
    js:   `let count = 0;\nfunction change(val) {\n  count += val;\n  const el = document.getElementById('count');\n  el.textContent = count;\n  el.className = 'display' + (count>0?' positive':count<0?' negative':'');\n  el.style.transform = 'scale(1.15)';\n  setTimeout(()=>el.style.transform='',100);\n}\nfunction reset() { count=0; const el=document.getElementById('count'); el.textContent=0; el.className='display'; }`,
  },
  todo: {
    label: 'Todo App',
    html: `<div class="app">\n  <h1>✅ Todo List</h1>\n  <div class="input-row">\n    <input id="inp" type="text" placeholder="Add a task…" onkeydown="if(event.key==='Enter')add()">\n    <button onclick="add()">Add</button>\n  </div>\n  <ul id="list"></ul>\n  <p id="empty">No tasks yet 🎯</p>\n</div>`,
    css:  `*{box-sizing:border-box;margin:0;padding:0}\nbody{font-family:'Segoe UI',sans-serif;background:#f0f4ff;min-height:100vh;display:flex;justify-content:center;padding:2rem 1rem}\n.app{background:white;border-radius:1.5rem;padding:2rem;width:100%;max-width:480px;box-shadow:0 10px 40px rgba(99,102,241,.12);height:fit-content}\nh1{font-size:1.5rem;margin-bottom:1.25rem;color:#1e1b4b}\n.input-row{display:flex;gap:.5rem;margin-bottom:1.25rem}\ninput{flex:1;padding:.65rem 1rem;border:2px solid #e0e7ff;border-radius:.75rem;font-size:.95rem;outline:none;color:#1e1b4b;transition:border-color .2s}\ninput:focus{border-color:#6366f1}\nbutton{background:#6366f1;color:white;border:none;padding:.65rem 1.25rem;border-radius:.75rem;font-size:.95rem;font-weight:600;cursor:pointer}\nbutton:hover{background:#4f46e5}\nul{list-style:none}\nli{display:flex;align-items:center;gap:.75rem;padding:.75rem;border-radius:.75rem;margin-bottom:.5rem;background:#f8faff;border:1px solid #e0e7ff}\nli.done span{text-decoration:line-through;color:#a5b4fc}\nli input[type=checkbox]{accent-color:#6366f1;width:18px;height:18px;cursor:pointer;flex-shrink:0}\nli span{flex:1;color:#3730a3;font-size:.95rem}\n.del{background:none;padding:.25rem .5rem;color:#94a3b8;border-radius:.5rem;font-size:1rem}\n.del:hover{background:#fee2e2;color:#ef4444}\n#empty{text-align:center;color:#a5b4fc;padding:2rem 0}`,
    js:   `let tasks=[];\nfunction add(){const inp=document.getElementById('inp');const text=inp.value.trim();if(!text)return;tasks.push({id:Date.now(),text,done:false});inp.value='';render();}\nfunction toggle(id){tasks=tasks.map(t=>t.id===id?{...t,done:!t.done}:t);render();}\nfunction remove(id){tasks=tasks.filter(t=>t.id!==id);render();}\nfunction render(){const list=document.getElementById('list');document.getElementById('empty').style.display=tasks.length?'none':'block';list.innerHTML=tasks.map(t=>\`<li class="\${t.done?'done':''}">\n  <input type="checkbox" \${t.done?'checked':''} onchange="toggle(\${t.id})">\n  <span>\${t.text}</span><button class="del" onclick="remove(\${t.id})">✕</button></li>\`).join('');}`,
  },
  card: {
    label: 'Profile Card',
    html: `<div class="card">\n  <div class="avatar">MK</div>\n  <h2>Mukesh Kumar</h2>\n  <p class="role">Frontend Developer</p>\n  <div class="stats">\n    <div><strong>48</strong><span>Projects</span></div>\n    <div><strong>12K</strong><span>Followers</span></div>\n    <div><strong>256</strong><span>Stars</span></div>\n  </div>\n  <button onclick="this.textContent=this.textContent==='Follow'?'Following ✓':'Follow'">Follow</button>\n</div>`,
    css:  `body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1e293b,#0f172a);font-family:'Segoe UI',sans-serif}\n.card{background:#1e293b;border:1px solid #334155;border-radius:1.5rem;padding:2.5rem 2rem;text-align:center;width:280px;box-shadow:0 25px 60px rgba(0,0,0,.5)}\n.avatar{width:80px;height:80px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;color:white;margin:0 auto 1rem}\nh2{color:#f1f5f9;margin:0 0 .25rem}\n.role{color:#64748b;font-size:.9rem;margin:0 0 1.5rem}\n.stats{display:flex;justify-content:space-around;padding:1.25rem 0;border-top:1px solid #334155;border-bottom:1px solid #334155;margin-bottom:1.5rem}\n.stats div{display:flex;flex-direction:column;gap:.2rem}\n.stats strong{color:#f1f5f9;font-size:1.1rem}\n.stats span{color:#64748b;font-size:.75rem}\nbutton{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;border:none;padding:.75rem 2.5rem;border-radius:9999px;font-size:.95rem;font-weight:600;cursor:pointer;transition:opacity .2s,transform .2s}\nbutton:hover{opacity:.85;transform:scale(1.03)}`,
    js:   `console.log('Card loaded!');`,
  },
  clock: {
    label: 'Digital Clock',
    html: `<div class="wrap">\n  <div class="clock" id="clock">00:00:00</div>\n  <div class="date" id="date"></div>\n</div>`,
    css:  `*{margin:0;padding:0;box-sizing:border-box}\nbody{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a0a;font-family:'Courier New',monospace}\n.wrap{text-align:center}\n.clock{font-size:clamp(3rem,15vw,8rem);font-weight:700;letter-spacing:.05em;background:linear-gradient(135deg,#00f5ff,#0080ff,#8000ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 0 20px rgba(0,200,255,.5))}\n.date{color:#4a4a4a;font-size:1rem;letter-spacing:.25em;text-transform:uppercase;margin-top:1rem}`,
    js:   `function tick(){\n  const now=new Date();\n  const h=String(now.getHours()).padStart(2,'0');\n  const m=String(now.getMinutes()).padStart(2,'0');\n  const s=String(now.getSeconds()).padStart(2,'0');\n  document.getElementById('clock').textContent=\`\${h}:\${m}:\${s}\`;\n  const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];\n  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];\n  document.getElementById('date').textContent=\`\${days[now.getDay()]}, \${months[now.getMonth()]} \${now.getDate()}, \${now.getFullYear()}\`;\n}\ntick();setInterval(tick,1000);`,
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface ConsoleMsg { type: 'log'|'warn'|'error'|'info'; args: string[]; time: string; }
type Layout = 'split-h'|'split-v'|'preview'|'editor';
type ActivePanel = 'html'|'css'|'js';

const PANEL_META = {
  html: { label: 'HTML', dot: 'bg-orange-500' },
  css:  { label: 'CSS',  dot: 'bg-blue-500' },
  js:   { label: 'JS',   dot: 'bg-yellow-400' },
};

// ─── Build preview src ────────────────────────────────────────────────────────
function buildSrc(html: string, css: string, js: string): string {
  const proxy = `<script>(function(){const s=(t,a)=>{try{parent.postMessage({__ed:true,type:t,args:a.map(x=>{try{return typeof x==='object'?JSON.stringify(x,null,2):String(x)}catch{return String(x)}}),time:new Date().toLocaleTimeString()},'*')}catch(e){}};['log','warn','error','info'].forEach(m=>{const o=console[m].bind(console);console[m]=(...a)=>{s(m,a);o(...a)}});window.onerror=(msg,_,line)=>{s('error',[msg+' (line '+line+')']);return false};window.addEventListener('unhandledrejection',e=>{s('error',['Promise: '+e.reason])})})()<\/script>`;
  const isFullDoc = /<html/i.test(html);
  if (isFullDoc) {
    let d = html;
    d = d.replace(/<\/head>/i, `${proxy}<style>${css}</style></head>`);
    d = d.replace(/<\/body>/i, `<script>try{${js}}catch(e){console.error(e.message)}<\/script></body>`);
    return d;
  }
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${proxy}<style>${css}</style></head><body>${html}<script>try{${js}}catch(e){console.error(e.message)}<\/script></body></html>`;
}

// ─── Autocomplete Dropdown ────────────────────────────────────────────────────
interface DropdownProps {
  suggestions: string[];
  index: number;
  pos: { top: number; left: number };
  type: string;
  onSelect: (s: string) => void;
  onHover: (i: number) => void;
}
function AcDropdown({ suggestions, index, pos, type, onSelect, onHover }: DropdownProps) {
  const colors: Record<string, string> = {
    tag: 'text-orange-400', attr: 'text-blue-400',
    prop: 'text-purple-400', method: 'text-green-400', keyword: 'text-yellow-400',
  };
  const badges: Record<string, string> = {
    tag: 'tag', attr: 'attr', prop: 'css', method: 'fn()', keyword: 'kw',
  };
  return (
    <div
      style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999 }}
      className="w-52 bg-[#1a1a2e] border border-[#3d3d5c] rounded-xl shadow-2xl overflow-hidden"
      onMouseDown={e => e.preventDefault()}
    >
      <div className="px-2.5 py-1.5 border-b border-[#3d3d5c] flex items-center gap-1.5">
        <span className={`text-[10px] font-bold uppercase ${colors[type] || 'text-gray-400'}`}>{badges[type]}</span>
        <span className="text-[10px] text-[#6c7086]">↑↓ navigate · Tab accept</span>
      </div>
      <div className="max-h-48 overflow-y-auto">
        {suggestions.map((s, i) => (
          <div
            key={s}
            onMouseEnter={() => onHover(i)}
            onMouseDown={() => onSelect(s)}
            className={`flex items-center justify-between px-3 py-1.5 cursor-pointer text-sm font-mono transition-colors ${
              i === index ? 'bg-[#cba6f7]/20 text-white' : 'text-[#cdd6f4] hover:bg-[#313244]'
            }`}
          >
            <span className={i === index ? colors[type] || 'text-white' : ''}>{s}</span>
            {type === 'tag' && <span className="text-[10px] text-[#45475a]">&lt;&gt;</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function HtmlCssJsEditorTool() {
  const [html, setHtml] = useState(TEMPLATES.hello.html);
  const [css,  setCss]  = useState(TEMPLATES.hello.css);
  const [js,   setJs]   = useState(TEMPLATES.hello.js);
  const [src, setSrc] = useState('');
  const [autoRun, setAutoRun] = useState(true);
  const [layout, setLayout] = useState<Layout>('split-h');
  const [activePanel, setActivePanel] = useState<ActivePanel>('html');
  const [consoleMsgs, setConsoleMsgs] = useState<ConsoleMsg[]>([]);
  const [showConsole, setShowConsole] = useState(false);
  const [fullPreview, setFullPreview] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Autocomplete state
  const [acSuggestions, setAcSuggestions] = useState<string[]>([]);
  const [acIndex, setAcIndex] = useState(0);
  const [acPos, setAcPos] = useState({ top: 0, left: 0 });
  const [acReplace, setAcReplace] = useState({ start: 0, end: 0 });
  const [acType, setAcType] = useState('');

  const textareaRefs = {
    html: useRef<HTMLTextAreaElement>(null),
    css:  useRef<HTMLTextAreaElement>(null),
    js:   useRef<HTMLTextAreaElement>(null),
  };
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Console listener
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data?.__ed) return;
      const m = e.data;
      setConsoleMsgs(prev => [...prev.slice(-99), { type: m.type, args: m.args, time: m.time }]);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

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

  useEffect(() => { run(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTemplate = (key: keyof typeof TEMPLATES) => {
    const t = TEMPLATES[key];
    setHtml(t.html); setCss(t.css); setJs(t.js);
    setShowTemplates(false); setConsoleMsgs([]); setAcSuggestions([]);
  };

  // ── Autocomplete handlers ──
  const dismissAc = useCallback(() => setAcSuggestions([]), []);

  const acceptSuggestion = useCallback((suggestion: string) => {
    const panel = activePanel;
    const ta = textareaRefs[panel].current;
    if (!ta) return;
    const value = ta.value;
    let insert = suggestion;
    // Smart insert: add closing '>' for tags, '=""' for attrs, ':' for css props
    if (acType === 'tag') insert = suggestion + (suggestion === 'br' || suggestion === 'hr' || suggestion === 'img' || suggestion === 'input' || suggestion === 'meta' || suggestion === 'link' ? ' ' : '>');
    if (acType === 'attr') insert = suggestion + '="';
    if (acType === 'prop') insert = suggestion + ': ';
    if (acType === 'method') insert = suggestion + '(';

    const newValue = value.substring(0, acReplace.start) + insert + value.substring(acReplace.end);
    const newPos = acReplace.start + insert.length;

    if (panel === 'html') setHtml(newValue);
    if (panel === 'css')  setCss(newValue);
    if (panel === 'js')   setJs(newValue);

    setAcSuggestions([]);
    requestAnimationFrame(() => {
      const t2 = textareaRefs[panel].current;
      if (t2) { t2.focus(); t2.selectionStart = t2.selectionEnd = newPos; }
    });
  }, [activePanel, acReplace, acType, textareaRefs]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>, panel: ActivePanel, setter: (v: string) => void) => {
    setter(e.target.value);
    const ta = e.target;
    const pos = ta.selectionStart;
    const result = getSuggestions(ta.value, pos, panel);
    if (result && result.suggestions.length > 0) {
      setAcSuggestions(result.suggestions);
      setAcIndex(0);
      setAcReplace(result.replace);
      setAcType(result.type);
      setAcPos(getCaretPixelPos(ta));
    } else {
      setAcSuggestions([]);
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>, panel: ActivePanel, setter: (v: string) => void) => {
    // Handle autocomplete navigation
    if (acSuggestions.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setAcIndex(i => Math.min(i + 1, acSuggestions.length - 1)); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setAcIndex(i => Math.max(i - 1, 0)); return; }
      if (e.key === 'Tab' || e.key === 'Enter') {
        if (e.key === 'Tab') e.preventDefault();
        acceptSuggestion(acSuggestions[acIndex]);
        return;
      }
      if (e.key === 'Escape') { setAcSuggestions([]); return; }
    }

    // Tab inserts 2 spaces (only when no autocomplete)
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const val = ta.value;
      const newVal = val.substring(0, start) + '  ' + val.substring(end);
      setter(newVal);
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + 2; });
    }
  }, [acSuggestions, acIndex, acceptSuggestion]);

  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>, panel: ActivePanel) => {
    // Recheck suggestions on cursor move
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key)) {
      const ta = e.currentTarget;
      const result = getSuggestions(ta.value, ta.selectionStart, panel);
      if (result && result.suggestions.length > 0) {
        setAcSuggestions(result.suggestions); setAcIndex(0);
        setAcReplace(result.replace); setAcType(result.type);
        setAcPos(getCaretPixelPos(ta));
      } else { setAcSuggestions([]); }
    }
  }, []);

  const download = () => {
    const blob = new Blob([buildSrc(html, css, js)], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'project.html'; a.click();
    URL.revokeObjectURL(url);
  };

  const errorCount = consoleMsgs.filter(m => m.type === 'error').length;

  // ── Editor pane ──────────────────────────────────────────────────────────
  const EditorPane = () => (
    <div className="flex flex-col h-full min-h-0 bg-[#1e1e2e]">
      <div className="flex items-center border-b border-[#313244] shrink-0">
        {(['html','css','js'] as const).map(p => (
          <button
            key={p}
            onClick={() => { setActivePanel(p); setAcSuggestions([]); }}
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
        <span className="text-[10px] text-[#45475a] px-3 hidden sm:block">Ctrl+Space for hints</span>
      </div>

      <div className="flex-1 relative min-h-0">
        {(['html','css','js'] as const).map(p => {
          const value = p === 'html' ? html : p === 'css' ? css : js;
          const setter = p === 'html' ? setHtml : p === 'css' ? setCss : setJs;
          return (
            <textarea
              key={p}
              ref={textareaRefs[p]}
              value={value}
              onChange={e => handleTextareaChange(e, p, setter)}
              onKeyDown={e => handleKeyDown(e, p, setter)}
              onKeyUp={e => handleKeyUp(e, p)}
              onBlur={() => setTimeout(dismissAc, 150)}
              onFocus={() => setActivePanel(p)}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              className={`absolute inset-0 w-full h-full resize-none bg-[#1e1e2e] text-[#cdd6f4] font-mono text-sm leading-relaxed p-4 focus:outline-none ${activePanel === p ? 'block' : 'hidden'}`}
            />
          );
        })}

        {/* Autocomplete dropdown */}
        {acSuggestions.length > 0 && (
          <AcDropdown
            suggestions={acSuggestions}
            index={acIndex}
            pos={acPos}
            type={acType}
            onSelect={acceptSuggestion}
            onHover={setAcIndex}
          />
        )}
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
        <button onClick={() => setFullPreview(true)} className="text-[#6c7086] hover:text-white transition-colors">
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex-1 bg-white min-h-0">
        <iframe srcDoc={src} sandbox="allow-scripts allow-modals allow-forms" className="w-full h-full border-0" title="preview" />
      </div>
    </div>
  );

  // ── Console ──────────────────────────────────────────────────────────────
  const ConsolePanel = () => (
    <div className="flex flex-col bg-[#181825] border-t border-[#313244] shrink-0" style={{ height: showConsole ? 150 : 'auto' }}>
      <button
        onClick={() => setShowConsole(s => !s)}
        className="flex items-center gap-2 px-4 py-2 text-xs text-[#6c7086] hover:text-white border-b border-[#313244] transition-colors w-full text-left"
      >
        <Terminal className="w-3.5 h-3.5" />
        Console
        {errorCount > 0 && <span className="ml-1 px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold">{errorCount} error{errorCount>1?'s':''}</span>}
        {consoleMsgs.length > 0 && <span className="ml-1 px-1.5 rounded bg-[#313244] text-[#6c7086] text-[10px]">{consoleMsgs.length}</span>}
        <ChevronDown className={`w-3.5 h-3.5 ml-auto transition-transform ${showConsole ? 'rotate-180' : ''}`} />
        {consoleMsgs.length > 0 && <span onMouseDown={e=>{e.stopPropagation();setConsoleMsgs([])}} className="text-[#6c7086] hover:text-white px-1">✕</span>}
      </button>
      {showConsole && (
        <div className="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-0.5">
          {consoleMsgs.length === 0
            ? <p className="text-[#45475a] italic px-1">No output yet…</p>
            : consoleMsgs.map((m, i) => (
              <div key={i} className={`flex gap-2 px-1 py-0.5 rounded ${m.type==='error'?'text-red-400 bg-red-950/30':m.type==='warn'?'text-yellow-400 bg-yellow-950/20':m.type==='info'?'text-blue-400':'text-[#cdd6f4]'}`}>
                <span className="text-[#45475a] shrink-0">{m.time}</span>
                <span className="break-all">{m.args.join(' ')}</span>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );

  if (fullPreview) return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex items-center px-4 py-2 bg-[#181825] gap-3 shrink-0">
        <button onClick={() => setFullPreview(false)} className="flex items-center gap-2 text-sm text-[#6c7086] hover:text-white">
          <Minimize2 className="w-4 h-4" /> Exit Full Screen
        </button>
        <div className="flex-1" />
        <button onClick={run} className="flex items-center gap-1.5 text-sm text-[#a6e3a1] hover:text-white"><Play className="w-3.5 h-3.5" /> Refresh</button>
      </div>
      <iframe srcDoc={src} sandbox="allow-scripts allow-modals allow-forms" className="flex-1 border-0 bg-white" title="preview-full" />
    </div>
  );

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-[#313244] shadow-2xl" style={{ height: '75vh', minHeight: 500, background: '#1e1e2e' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#181825] border-b border-[#313244] shrink-0 flex-wrap">
        {/* Templates */}
        <div className="relative">
          <button onClick={() => setShowTemplates(s => !s)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#313244] text-[#cdd6f4] text-xs font-medium hover:bg-[#45475a] transition-colors">
            <Code2 className="w-3.5 h-3.5" /> Templates <ChevronDown className="w-3 h-3" />
          </button>
          {showTemplates && (
            <div className="absolute top-full left-0 mt-1 z-20 bg-[#181825] border border-[#313244] rounded-xl shadow-xl overflow-hidden">
              {Object.entries(TEMPLATES).map(([key, t]) => (
                <button key={key} onClick={() => loadTemplate(key as keyof typeof TEMPLATES)} className="w-full text-left px-4 py-2 text-xs text-[#cdd6f4] hover:bg-[#313244] transition-colors whitespace-nowrap">
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Layout */}
        <div className="flex rounded-lg overflow-hidden border border-[#313244]">
          {([
            { id:'split-h', icon:<Columns className="w-3.5 h-3.5"/>, title:'Side by side' },
            { id:'split-v', icon:<Rows className="w-3.5 h-3.5"/>, title:'Top / Bottom' },
            { id:'editor',  icon:<Code2 className="w-3.5 h-3.5"/>, title:'Editor only' },
            { id:'preview', icon:<Expand className="w-3.5 h-3.5"/>, title:'Preview only' },
          ] as const).map(({ id, icon, title }) => (
            <button key={id} title={title} onClick={() => setLayout(id)} className={`px-2.5 py-1.5 transition-colors ${layout===id?'bg-[#cba6f7] text-[#1e1e2e]':'text-[#6c7086] hover:text-white hover:bg-[#313244]'}`}>
              {icon}
            </button>
          ))}
        </div>

        {/* Auto-run */}
        <button onClick={() => setAutoRun(a => !a)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${autoRun?'bg-[#a6e3a1]/20 text-[#a6e3a1]':'bg-[#313244] text-[#6c7086] hover:text-white'}`}>
          <div className={`w-2 h-2 rounded-full ${autoRun?'bg-[#a6e3a1] animate-pulse':'bg-[#45475a]'}`} />
          {autoRun ? 'Auto' : 'Manual'}
        </button>

        <div className="flex-1" />

        {!autoRun && (
          <button onClick={run} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#a6e3a1] text-[#1e1e2e] text-xs font-bold hover:bg-[#94d8a0] transition-colors">
            <Play className="w-3.5 h-3.5" /> Run
          </button>
        )}
        <button onClick={run} title="Refresh" className="p-1.5 text-[#6c7086] hover:text-white transition-colors"><RefreshCw className="w-3.5 h-3.5" /></button>
        <button onClick={() => setFullPreview(true)} title="Full screen" className="p-1.5 text-[#6c7086] hover:text-white transition-colors"><Maximize2 className="w-3.5 h-3.5" /></button>
        <button onClick={download} title="Download HTML" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#313244] text-[#cdd6f4] text-xs hover:bg-[#45475a] transition-colors">
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main area */}
      <div className={`flex-1 min-h-0 flex ${layout === 'split-v' ? 'flex-col' : 'flex-row'}`}>
        {layout !== 'preview' && (
          <div className={`min-h-0 min-w-0 ${layout==='split-h'?'w-1/2 border-r border-[#313244]':layout==='split-v'?'h-1/2 border-b border-[#313244]':'flex-1'}`}>
            <EditorPane />
          </div>
        )}
        {layout !== 'editor' && (
          <div className={`min-h-0 min-w-0 flex flex-col ${layout==='split-h'?'w-1/2':layout==='split-v'?'h-1/2':'flex-1'}`}>
            <div className="flex-1 min-h-0"><PreviewPane /></div>
            <ConsolePanel />
          </div>
        )}
      </div>

      {showTemplates && <div className="fixed inset-0 z-10" onClick={() => setShowTemplates(false)} />}
    </div>
  );
}
