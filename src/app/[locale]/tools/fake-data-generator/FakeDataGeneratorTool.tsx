'use client';
import { useState, useCallback } from 'react';
import { Database, Copy, Check, Download, RefreshCw, Table, Code, Shuffle } from 'lucide-react';

/* ─── Data Pools ─── */
const FIRST_NAMES = ['James','Mary','Robert','Patricia','John','Jennifer','Michael','Linda','David','Elizabeth','William','Barbara','Richard','Susan','Joseph','Jessica','Thomas','Sarah','Charles','Karen','Christopher','Lisa','Daniel','Nancy','Matthew','Betty','Anthony','Margaret','Mark','Sandra','Donald','Ashley','Steven','Kimberly','Paul','Emily','Andrew','Donna','Joshua','Michelle','Kenneth','Carol','Kevin','Amanda','Brian','Dorothy','George','Melissa','Timothy','Deborah','Aarav','Priya','Rahul','Ananya','Vikram','Pooja','Amit','Shreya','Raj','Neha','Sanjay','Kavya','Arjun','Ishita','Rohan','Divya'];
const LAST_NAMES = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Thompson','White','Harris','Clark','Lewis','Robinson','Walker','Young','Allen','King','Wright','Scott','Sharma','Patel','Singh','Kumar','Gupta','Shah','Mehta','Joshi','Verma','Yadav','Mishra','Thapa','Adhikari','Bhandari','Shrestha','Tamang','Rai','Gurung'];
const DOMAINS = ['gmail.com','yahoo.com','outlook.com','hotmail.com','protonmail.com','icloud.com','mail.com','zoho.com','fastmail.com','aol.com'];
const STREETS = ['Main St','Oak Ave','Maple Dr','Cedar Ln','Pine Rd','Elm St','Park Ave','Lake Dr','Hill Rd','River Rd','Church St','Market St','School Rd','Forest Ave','Garden Ln','Sunset Blvd','Broadway','Highland Ave','Valley Rd','Spring St'];
const CITIES = ['New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego','Dallas','Austin','Mumbai','Delhi','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Kathmandu','Pokhara','London','Toronto','Sydney','Berlin','Tokyo','Paris','Dubai'];
const STATES = ['CA','TX','NY','FL','IL','PA','OH','GA','NC','MI','MH','DL','KA','TN','UP','WB','GJ','Bagmati','Gandaki','Province 1'];
const COUNTRIES = ['United States','India','Nepal','United Kingdom','Canada','Australia','Germany','Japan','France','Brazil','UAE','Singapore'];
const COMPANIES = ['Acme Corp','Globex Inc','Initech','Umbrella Corp','Stark Industries','Wayne Enterprises','Cyberdyne','Oscorp','Aperture Science','Soylent','NovaTech','Zenith Labs','BlueWave','Pinnacle Solutions','EcoStar','CloudNine','DataPrime','AlphaForge','TechNova','QuantumLeap'];
const JOB_TITLES = ['Software Engineer','Product Manager','Data Analyst','UX Designer','Marketing Manager','Sales Executive','DevOps Engineer','Project Manager','Business Analyst','Full Stack Developer','Frontend Developer','Backend Developer','QA Engineer','Data Scientist','Content Writer','HR Manager','Financial Analyst','Operations Manager','Graphic Designer','CTO'];

/* ─── Field config ─── */
interface Field {
  id: string;
  label: string;
  emoji: string;
  generate: () => string;
}

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
function uuid(): string { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16); }); }
function luhn(prefix: string, len: number): string {
  let num = prefix;
  while (num.length < len - 1) num += randInt(0, 9);
  const digits = num.split('').reverse().map(Number);
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = digits[i];
    if (i % 2 === 0) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  num += (10 - (sum % 10)) % 10;
  return num;
}

const FIELDS: Field[] = [
  { id: 'name', label: 'Full Name', emoji: '👤', generate: () => `${rand(FIRST_NAMES)} ${rand(LAST_NAMES)}` },
  { id: 'first_name', label: 'First Name', emoji: '🅰️', generate: () => rand(FIRST_NAMES) },
  { id: 'last_name', label: 'Last Name', emoji: '🅱️', generate: () => rand(LAST_NAMES) },
  { id: 'email', label: 'Email', emoji: '📧', generate: () => { const f = rand(FIRST_NAMES).toLowerCase(); const l = rand(LAST_NAMES).toLowerCase(); return `${f}.${l}${randInt(1, 99)}@${rand(DOMAINS)}`; }},
  { id: 'phone', label: 'Phone', emoji: '📱', generate: () => `+1 (${randInt(200, 999)}) ${randInt(200, 999)}-${String(randInt(1000, 9999))}` },
  { id: 'address', label: 'Address', emoji: '🏠', generate: () => `${randInt(1, 9999)} ${rand(STREETS)}, ${rand(CITIES)}, ${rand(STATES)}` },
  { id: 'city', label: 'City', emoji: '🌆', generate: () => rand(CITIES) },
  { id: 'country', label: 'Country', emoji: '🌍', generate: () => rand(COUNTRIES) },
  { id: 'company', label: 'Company', emoji: '🏢', generate: () => rand(COMPANIES) },
  { id: 'job', label: 'Job Title', emoji: '💼', generate: () => rand(JOB_TITLES) },
  { id: 'username', label: 'Username', emoji: '🔑', generate: () => `${rand(FIRST_NAMES).toLowerCase()}${randInt(10, 999)}` },
  { id: 'password', label: 'Password', emoji: '🔒', generate: () => { const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%'; let p = ''; for (let i = 0; i < 12; i++) p += chars[randInt(0, chars.length - 1)]; return p; }},
  { id: 'uuid', label: 'UUID', emoji: '🆔', generate: uuid },
  { id: 'date', label: 'Date of Birth', emoji: '🎂', generate: () => { const y = randInt(1960, 2005); const m = String(randInt(1, 12)).padStart(2, '0'); const d = String(randInt(1, 28)).padStart(2, '0'); return `${y}-${m}-${d}`; }},
  { id: 'credit_card', label: 'Credit Card', emoji: '💳', generate: () => { const prefixes = ['4', '51', '52', '53', '37']; return luhn(rand(prefixes), 16).replace(/(.{4})/g, '$1 ').trim(); }},
  { id: 'ip', label: 'IP Address', emoji: '🌐', generate: () => `${randInt(1, 255)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}` },
  { id: 'color', label: 'Hex Color', emoji: '🎨', generate: () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}` },
  { id: 'url', label: 'Website URL', emoji: '🔗', generate: () => `https://www.${rand(LAST_NAMES).toLowerCase()}${rand(['tech', 'dev', 'app', 'io', 'co'])}.com` },
];

const DEFAULT_FIELDS = ['name', 'email', 'phone', 'address', 'company', 'job'];

type ExportFormat = 'json' | 'csv';

export function FakeDataGeneratorTool() {
  const [selectedFields, setSelectedFields] = useState<string[]>(DEFAULT_FIELDS);
  const [count, setCount] = useState(10);
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');

  function toggleField(id: string) {
    setSelectedFields(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  }

  function generate() {
    const rows: Record<string, string>[] = [];
    for (let i = 0; i < count; i++) {
      const row: Record<string, string> = {};
      for (const fid of selectedFields) {
        const field = FIELDS.find(f => f.id === fid);
        if (field) row[field.id] = field.generate();
      }
      rows.push(row);
    }
    setData(rows);
  }

  const copyText = useCallback(async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  function exportData(format: ExportFormat) {
    if (data.length === 0) return;
    let content: string;
    let mime: string;
    let ext: string;

    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      mime = 'application/json';
      ext = 'json';
    } else {
      const headers = selectedFields.join(',');
      const rows = data.map(row => selectedFields.map(f => `"${(row[f] || '').replace(/"/g, '""')}"`).join(','));
      content = [headers, ...rows].join('\n');
      mime = 'text/csv';
      ext = 'csv';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fake-data-toolsarena.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyAll(format: ExportFormat) {
    if (data.length === 0) return;
    let content: string;
    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
    } else {
      const headers = selectedFields.join(',');
      const rows = data.map(row => selectedFields.map(f => `"${(row[f] || '').replace(/"/g, '""')}"`).join(','));
      content = [headers, ...rows].join('\n');
    }
    await navigator.clipboard.writeText(content);
    setCopied('all');
    setTimeout(() => setCopied(null), 2000);
  }

  const activeFields = FIELDS.filter(f => selectedFields.includes(f.id));

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Fake Data Generator</h2>
            <p className="text-teal-100 text-xs">Generate realistic test data — names, emails, addresses & more</p>
          </div>
        </div>
      </div>

      {/* Field Selector */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Select Data Fields</p>
          <div className="flex gap-2">
            <button onClick={() => setSelectedFields(FIELDS.map(f => f.id))} className="text-[10px] text-teal-600 hover:underline font-medium">Select All</button>
            <button onClick={() => setSelectedFields(DEFAULT_FIELDS)} className="text-[10px] text-slate-400 hover:underline font-medium">Reset</button>
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {FIELDS.map(f => (
            <button
              key={f.id}
              onClick={() => toggleField(f.id)}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-left transition-all text-xs ${
                selectedFields.includes(f.id)
                  ? 'bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-400 font-bold'
                  : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500'
              }`}
            >
              <span className="text-sm">{f.emoji}</span>
              <span className="truncate">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Rows:</label>
          <select
            value={count}
            onChange={e => setCount(parseInt(e.target.value))}
            className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 font-mono"
          >
            {[1, 5, 10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <button
          onClick={generate}
          disabled={selectedFields.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-semibold rounded-xl transition-colors text-sm shadow-lg shadow-teal-600/20"
        >
          <Shuffle className="w-4 h-4" />
          Generate {count} Rows
        </button>
        {data.length > 0 && (
          <button
            onClick={generate}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-teal-600 rounded-lg text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Regenerate
          </button>
        )}
      </div>

      {/* Results */}
      {data.length > 0 && (
        <div className="space-y-3">
          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-sm' : 'text-slate-400'}`}
              >
                <Table className="w-3.5 h-3.5" /> Table
              </button>
              <button
                onClick={() => setViewMode('json')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === 'json' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-sm' : 'text-slate-400'}`}
              >
                <Code className="w-3.5 h-3.5" /> JSON
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => copyAll(viewMode === 'json' ? 'json' : 'csv')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${copied === 'all' ? 'bg-green-100 text-green-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-teal-600'}`}
              >
                {copied === 'all' ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy All</>}
              </button>
              <button
                onClick={() => exportData('json')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-medium hover:bg-teal-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> JSON
              </button>
              <button
                onClick={() => exportData('csv')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
          </div>

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900">
                    <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider w-8">#</th>
                    {activeFields.map(f => (
                      <th key={f.id} className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                        {f.emoji} {f.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-3 py-2 text-xs text-slate-300 font-mono">{i + 1}</td>
                      {activeFields.map(f => (
                        <td key={f.id} className="px-3 py-2 text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-nowrap">
                          <button
                            onClick={() => copyText(row[f.id] || '', `${i}-${f.id}`)}
                            className="hover:text-teal-600 transition-colors text-left"
                            title="Click to copy"
                          >
                            {copied === `${i}-${f.id}` ? (
                              <span className="text-green-600 font-bold">Copied!</span>
                            ) : (
                              row[f.id]
                            )}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* JSON View */}
          {viewMode === 'json' && (
            <pre className="p-4 bg-slate-900 text-green-400 rounded-xl text-xs font-mono overflow-x-auto max-h-[32rem] overflow-y-auto leading-relaxed">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}

          <p className="text-[10px] text-slate-400 text-center">
            {data.length} rows × {activeFields.length} fields = {data.length * activeFields.length} data points generated
          </p>
        </div>
      )}

      {data.length === 0 && (
        <div className="text-center py-6 text-sm text-slate-400">
          Select fields above and click &quot;Generate&quot; to create fake data
        </div>
      )}
    </div>
  );
}
