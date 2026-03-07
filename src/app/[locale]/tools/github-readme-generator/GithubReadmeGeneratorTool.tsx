'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Copy, Download, RotateCcw, Sparkles, Eye, Code2,
  ChevronDown, ChevronRight, Check, Github, Linkedin,
  Twitter, Globe, Mail, Youtube, PenTool, BookOpen,
  Coffee, User, Briefcase, GraduationCap, MessageCircle,
  Zap, BarChart3, FileText,
} from 'lucide-react';

// ── Badge Data ──────────────────────────────────────────────────────────────
interface Badge { name: string; logo: string; color: string }

const TECH_BADGES: Record<string, Badge[]> = {
  Languages: [
    { name: 'JavaScript', logo: 'javascript', color: 'F7DF1E' },
    { name: 'TypeScript', logo: 'typescript', color: '3178C6' },
    { name: 'Python', logo: 'python', color: '3776AB' },
    { name: 'Java', logo: 'java', color: 'ED8B00' },
    { name: 'C++', logo: 'cplusplus', color: '00599C' },
    { name: 'Go', logo: 'go', color: '00ADD8' },
    { name: 'Rust', logo: 'rust', color: '000000' },
    { name: 'PHP', logo: 'php', color: '777BB4' },
    { name: 'Ruby', logo: 'ruby', color: 'CC342D' },
    { name: 'Swift', logo: 'swift', color: 'F05138' },
    { name: 'Kotlin', logo: 'kotlin', color: '7F52FF' },
    { name: 'C#', logo: 'csharp', color: '239120' },
    { name: 'Dart', logo: 'dart', color: '0175C2' },
    { name: 'R', logo: 'r', color: '276DC3' },
    { name: 'Scala', logo: 'scala', color: 'DC322F' },
    { name: 'Lua', logo: 'lua', color: '2C2D72' },
    { name: 'Perl', logo: 'perl', color: '39457E' },
    { name: 'Haskell', logo: 'haskell', color: '5D4F85' },
    { name: 'Elixir', logo: 'elixir', color: '4B275F' },
    { name: 'Clojure', logo: 'clojure', color: '5881D8' },
  ],
  Frontend: [
    { name: 'React', logo: 'react', color: '61DAFB' },
    { name: 'Next.js', logo: 'nextdotjs', color: '000000' },
    { name: 'Vue.js', logo: 'vuedotjs', color: '4FC08D' },
    { name: 'Angular', logo: 'angular', color: 'DD0031' },
    { name: 'Svelte', logo: 'svelte', color: 'FF3E00' },
    { name: 'Tailwind CSS', logo: 'tailwindcss', color: '06B6D4' },
    { name: 'Bootstrap', logo: 'bootstrap', color: '7952B3' },
    { name: 'SASS', logo: 'sass', color: 'CC6699' },
    { name: 'HTML5', logo: 'html5', color: 'E34F26' },
    { name: 'CSS3', logo: 'css3', color: '1572B6' },
    { name: 'jQuery', logo: 'jquery', color: '0769AD' },
    { name: 'Astro', logo: 'astro', color: 'BC52EE' },
    { name: 'Gatsby', logo: 'gatsby', color: '663399' },
    { name: 'Remix', logo: 'remix', color: '000000' },
    { name: 'Material UI', logo: 'mui', color: '007FFF' },
  ],
  Backend: [
    { name: 'Node.js', logo: 'nodedotjs', color: '339933' },
    { name: 'Express', logo: 'express', color: '000000' },
    { name: 'Django', logo: 'django', color: '092E20' },
    { name: 'Flask', logo: 'flask', color: '000000' },
    { name: 'Spring', logo: 'spring', color: '6DB33F' },
    { name: 'FastAPI', logo: 'fastapi', color: '009688' },
    { name: 'NestJS', logo: 'nestjs', color: 'E0234E' },
    { name: 'Laravel', logo: 'laravel', color: 'FF2D20' },
    { name: 'Rails', logo: 'rubyonrails', color: 'CC0000' },
    { name: 'GraphQL', logo: 'graphql', color: 'E10098' },
    { name: '.NET', logo: 'dotnet', color: '512BD4' },
    { name: 'Gin', logo: 'gin', color: '00ADD8' },
    { name: 'Fiber', logo: 'fiber', color: '00ACD7' },
  ],
  Database: [
    { name: 'MongoDB', logo: 'mongodb', color: '47A248' },
    { name: 'PostgreSQL', logo: 'postgresql', color: '4169E1' },
    { name: 'MySQL', logo: 'mysql', color: '4479A1' },
    { name: 'Redis', logo: 'redis', color: 'DC382D' },
    { name: 'Firebase', logo: 'firebase', color: 'FFCA28' },
    { name: 'Supabase', logo: 'supabase', color: '3FCF8E' },
    { name: 'SQLite', logo: 'sqlite', color: '003B57' },
    { name: 'Prisma', logo: 'prisma', color: '2D3748' },
    { name: 'DynamoDB', logo: 'amazondynamodb', color: '4053D6' },
    { name: 'Cassandra', logo: 'apachecassandra', color: '1287B1' },
    { name: 'Elasticsearch', logo: 'elasticsearch', color: '005571' },
  ],
  DevOps: [
    { name: 'Docker', logo: 'docker', color: '2496ED' },
    { name: 'Kubernetes', logo: 'kubernetes', color: '326CE5' },
    { name: 'AWS', logo: 'amazonaws', color: '232F3E' },
    { name: 'GCP', logo: 'googlecloud', color: '4285F4' },
    { name: 'Azure', logo: 'microsoftazure', color: '0078D4' },
    { name: 'Vercel', logo: 'vercel', color: '000000' },
    { name: 'Netlify', logo: 'netlify', color: '00C7B7' },
    { name: 'GitHub Actions', logo: 'githubactions', color: '2088FF' },
    { name: 'Jenkins', logo: 'jenkins', color: 'D24939' },
    { name: 'Terraform', logo: 'terraform', color: '7B42BC' },
    { name: 'Nginx', logo: 'nginx', color: '009639' },
    { name: 'CircleCI', logo: 'circleci', color: '343434' },
    { name: 'Ansible', logo: 'ansible', color: 'EE0000' },
    { name: 'Heroku', logo: 'heroku', color: '430098' },
  ],
  Tools: [
    { name: 'Git', logo: 'git', color: 'F05032' },
    { name: 'VS Code', logo: 'visualstudiocode', color: '007ACC' },
    { name: 'Figma', logo: 'figma', color: 'F24E1E' },
    { name: 'Postman', logo: 'postman', color: 'FF6C37' },
    { name: 'Linux', logo: 'linux', color: 'FCC624' },
    { name: 'Vim', logo: 'vim', color: '019733' },
    { name: 'Jira', logo: 'jira', color: '0052CC' },
    { name: 'Notion', logo: 'notion', color: '000000' },
    { name: 'Webpack', logo: 'webpack', color: '8DD6F9' },
    { name: 'Vite', logo: 'vite', color: '646CFF' },
    { name: 'npm', logo: 'npm', color: 'CB3837' },
    { name: 'Yarn', logo: 'yarn', color: '2C8EBB' },
    { name: 'pnpm', logo: 'pnpm', color: 'F69220' },
    { name: 'ESLint', logo: 'eslint', color: '4B32C3' },
    { name: 'Prettier', logo: 'prettier', color: 'F7B93E' },
  ],
};

function badgeUrl(b: Badge) {
  const label = b.name.replace(/-/g, '--').replace(/ /g, '%20');
  return `https://img.shields.io/badge/${label}-${b.color}?style=for-the-badge&logo=${b.logo}&logoColor=white`;
}

// ── Example Data ────────────────────────────────────────────────────────────
const EXAMPLE_DATA = {
  header: { enabled: true, name: 'Alex Chen', tagline: 'Full-Stack Developer | Open Source Enthusiast', typingTexts: 'Building cool stuff with code,Open source contributor,Coffee-driven developer' },
  about: { enabled: true, bio: 'Passionate developer who loves building tools that make developers\' lives easier.', workingOn: 'a SaaS platform for developer productivity', learning: 'Rust and WebAssembly', askAbout: 'React, Node.js, System Design, Open Source', funFact: 'I mass-debug with console.log and I am not ashamed' },
  connect: { enabled: true, github: 'alexchen', linkedin: 'alexchen', twitter: 'alexchendev', portfolio: 'https://alexchen.dev', email: 'alex@alexchen.dev', youtube: '', devto: 'alexchen', medium: '' },
  techStack: { enabled: true, selected: ['JavaScript', 'TypeScript', 'Python', 'React', 'Next.js', 'Tailwind CSS', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'AWS', 'Git', 'VS Code', 'Figma'] },
  stats: { enabled: true, showStats: true, showLanguages: true, showStreak: true },
  blog: { enabled: false },
  support: { enabled: false, buymeacoffee: '' },
};

const INITIAL_DATA = {
  header: { enabled: true, name: '', tagline: '', typingTexts: '' },
  about: { enabled: false, bio: '', workingOn: '', learning: '', askAbout: '', funFact: '' },
  connect: { enabled: false, github: '', linkedin: '', twitter: '', portfolio: '', email: '', youtube: '', devto: '', medium: '' },
  techStack: { enabled: false, selected: [] as string[] },
  stats: { enabled: false, showStats: true, showLanguages: true, showStreak: true },
  blog: { enabled: false },
  support: { enabled: false, buymeacoffee: '' },
};

type FormData = typeof INITIAL_DATA;

// ── Collapsible Section ─────────────────────────────────────────────────────
function Section({ title, icon: Icon, enabled, onToggle, open, onOpenToggle, children }: {
  title: string; icon: React.ElementType; enabled: boolean; onToggle: () => void;
  open: boolean; onOpenToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 cursor-pointer select-none" onClick={onOpenToggle}>
        <button type="button" onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${enabled ? 'bg-purple-600 border-purple-600' : 'border-gray-300 dark:border-gray-600'}`}>
          {enabled && <Check className="w-3 h-3 text-white" />}
        </button>
        <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        <span className="font-medium text-sm flex-1">{title}</span>
        {open ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
      </div>
      {open && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition" />
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export function GithubReadmeGeneratorTool() {
  const [data, setData] = useState<FormData>(structuredClone(INITIAL_DATA));
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ header: true });
  const [showRaw, setShowRaw] = useState(false);
  const [copied, setCopied] = useState(false);

  const update = useCallback(<K extends keyof FormData>(section: K, field: string, value: unknown) => {
    setData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  }, []);

  const toggleSection = useCallback((key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const toggleEnabled = useCallback((key: keyof FormData) => {
    setData(prev => ({ ...prev, [key]: { ...prev[key], enabled: !prev[key].enabled } }));
  }, []);

  const toggleTech = useCallback((name: string) => {
    setData(prev => {
      const sel = prev.techStack.selected;
      const next = sel.includes(name) ? sel.filter(s => s !== name) : [...sel, name];
      return { ...prev, techStack: { ...prev.techStack, selected: next } };
    });
  }, []);

  const loadExample = useCallback(() => {
    setData(structuredClone(EXAMPLE_DATA) as FormData);
    setOpenSections({ header: true, about: true, connect: true, techStack: true, stats: true });
  }, []);

  const reset = useCallback(() => {
    setData(structuredClone(INITIAL_DATA));
    setOpenSections({ header: true });
  }, []);

  // ── Generate Markdown ───────────────────────────────────────────────────
  const markdown = useMemo(() => {
    const lines: string[] = [];
    const { header, about, connect, techStack, stats, blog, support } = data;
    const username = connect.github || 'username';

    if (header.enabled) {
      if (header.name) {
        lines.push(`<h1 align="center">Hi there, I'm ${header.name} <img src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" width="30"></h1>`);
        lines.push('');
      }
      if (header.tagline) {
        lines.push(`<h3 align="center">${header.tagline}</h3>`);
        lines.push('');
      }
      if (header.typingTexts) {
        const texts = header.typingTexts.split(',').map(t => t.trim()).filter(Boolean);
        if (texts.length > 0) {
          const encoded = encodeURIComponent(texts.join(';'));
          lines.push(`<p align="center">`);
          lines.push(`  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1000&color=A855F7&center=true&vCenter=true&width=435&lines=${encoded}" alt="Typing SVG" />`);
          lines.push(`</p>`);
          lines.push('');
        }
      }
      lines.push(`<p align="center">`);
      lines.push(`  <img src="https://komarev.com/ghpvc/?username=${username}&label=Profile%20Views&color=blueviolet&style=flat" alt="Profile views" />`);
      lines.push(`</p>`);
      lines.push('');
      lines.push('---');
      lines.push('');
    }

    if (about.enabled && (about.bio || about.workingOn || about.learning || about.askAbout || about.funFact)) {
      lines.push('## About Me');
      lines.push('');
      if (about.bio) lines.push(about.bio);
      if (about.bio) lines.push('');
      if (about.workingOn) lines.push(`- I'm currently working on **${about.workingOn}**`);
      if (about.learning) lines.push(`- I'm currently learning **${about.learning}**`);
      if (about.askAbout) lines.push(`- Ask me about **${about.askAbout}**`);
      if (about.funFact) lines.push(`- Fun fact: **${about.funFact}**`);
      lines.push('');
    }

    if (connect.enabled) {
      const links: string[] = [];
      if (connect.github) links.push(`[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/${connect.github})`);
      if (connect.linkedin) links.push(`[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/${connect.linkedin})`);
      if (connect.twitter) links.push(`[![X](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/${connect.twitter})`);
      if (connect.portfolio) links.push(`[![Portfolio](https://img.shields.io/badge/Portfolio-7C3AED?style=for-the-badge&logo=googlechrome&logoColor=white)](${connect.portfolio})`);
      if (connect.email) links.push(`[![Email](https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:${connect.email})`);
      if (connect.youtube) links.push(`[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@${connect.youtube})`);
      if (connect.devto) links.push(`[![Dev.to](https://img.shields.io/badge/Dev.to-0A0A0A?style=for-the-badge&logo=devdotto&logoColor=white)](https://dev.to/${connect.devto})`);
      if (connect.medium) links.push(`[![Medium](https://img.shields.io/badge/Medium-000000?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@${connect.medium})`);
      if (links.length > 0) {
        lines.push('## Connect With Me');
        lines.push('');
        lines.push(`<p align="center">`);
        links.forEach(l => { lines.push(`  ${l}`); });
        lines.push(`</p>`);
        lines.push('');
      }
    }

    if (techStack.enabled && techStack.selected.length > 0) {
      lines.push('## Tech Stack');
      lines.push('');
      lines.push('<p align="center">');
      const allBadges = Object.values(TECH_BADGES).flat();
      techStack.selected.forEach(name => {
        const badge = allBadges.find(b => b.name === name);
        if (badge) lines.push(`  <img src="${badgeUrl(badge)}" alt="${badge.name}" />`);
      });
      lines.push('</p>');
      lines.push('');
    }

    if (stats.enabled && (stats.showStats || stats.showLanguages || stats.showStreak)) {
      lines.push('## GitHub Stats');
      lines.push('');
      lines.push('<p align="center">');
      if (stats.showStats) {
        lines.push(`  <img src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=tokyonight&hide_border=true" alt="GitHub Stats" height="170" />`);
      }
      if (stats.showLanguages) {
        lines.push(`  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=tokyonight&hide_border=true" alt="Top Languages" height="170" />`);
      }
      lines.push('</p>');
      if (stats.showStreak) {
        lines.push('');
        lines.push('<p align="center">');
        lines.push(`  <img src="https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=tokyonight&hide_border=true" alt="GitHub Streak" />`);
        lines.push('</p>');
      }
      lines.push('');
    }

    if (blog.enabled) {
      lines.push('## Recent Blog Posts');
      lines.push('');
      lines.push('<!-- BLOG-POST-LIST:START -->');
      lines.push('- Coming soon...');
      lines.push('<!-- BLOG-POST-LIST:END -->');
      lines.push('');
    }

    if (support.enabled && support.buymeacoffee) {
      lines.push('## Support');
      lines.push('');
      lines.push(`<p align="center">`);
      lines.push(`  <a href="https://www.buymeacoffee.com/${support.buymeacoffee}">`);
      lines.push(`    <img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee" />`);
      lines.push(`  </a>`);
      lines.push(`</p>`);
      lines.push('');
    }

    if (lines.length > 0) {
      lines.push('---');
      lines.push('');
      lines.push(`<p align="center">Made with <a href="https://toolsarena.in/tools/github-readme-generator">ToolsArena GitHub README Generator</a></p>`);
    }

    return lines.join('\n');
  }, [data]);

  // ── Actions ─────────────────────────────────────────────────────────────
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [markdown]);

  const downloadMd = useCallback(() => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  }, [markdown]);

  // ── Simple Markdown-to-HTML Preview ─────────────────────────────────────
  const previewHtml = useMemo(() => {
    let html = markdown;
    // Pass through raw HTML tags
    // Convert markdown headings
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">$1</h2>');
    html = html.replace(/^---$/gm, '<hr class="my-4 border-gray-200 dark:border-gray-700" />');
    // Convert markdown list items
    html = html.replace(/^- (.+)$/gm, '<li class="ml-4 text-sm text-gray-700 dark:text-gray-300 list-disc">$1</li>');
    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Links [![text](img)](url)
    html = html.replace(/\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/g, '<a href="$3" target="_blank" rel="noopener noreferrer" class="inline-block m-1"><img src="$2" alt="$1" class="inline-block h-7" /></a>');
    // Links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-purple-600 hover:underline">$1</a>');
    // Images ![alt](src)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="inline-block m-1" />');
    // Wrap bare lines (non-HTML, non-empty)
    html = html.replace(/^(?!<)(.+)$/gm, '<p class="text-sm text-gray-700 dark:text-gray-300">$1</p>');
    // Remove empty paragraphs
    html = html.replace(/<p[^>]*>\s*<\/p>/g, '');
    return html;
  }, [markdown]);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={loadExample}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition">
          <Sparkles className="w-4 h-4" /> Try Example
        </button>
        <button onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
        <div className="flex-1" />
        <button onClick={copyToClipboard}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          {copied ? <><Check className="w-4 h-4 text-green-500" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy MD</>}
        </button>
        <button onClick={downloadMd}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <Download className="w-4 h-4" /> Download .md
        </button>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Form */}
        <div className="space-y-3">
          {/* Header Section */}
          <Section title="Header" icon={User} enabled={data.header.enabled}
            onToggle={() => toggleEnabled('header')} open={!!openSections.header} onOpenToggle={() => toggleSection('header')}>
            <Input label="Your Name" value={data.header.name} onChange={(v) => update('header', 'name', v)} placeholder="John Doe" />
            <Input label="Tagline" value={data.header.tagline} onChange={(v) => update('header', 'tagline', v)} placeholder="Full-Stack Developer | Open Source Lover" />
            <Input label="Typing Animation (comma-separated)" value={data.header.typingTexts} onChange={(v) => update('header', 'typingTexts', v)} placeholder="Building cool stuff,Learning every day" />
          </Section>

          {/* About Section */}
          <Section title="About Me" icon={Briefcase} enabled={data.about.enabled}
            onToggle={() => toggleEnabled('about')} open={!!openSections.about} onOpenToggle={() => toggleSection('about')}>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Short Bio</label>
              <textarea value={data.about.bio} onChange={(e) => update('about', 'bio', e.target.value)} rows={2} placeholder="A passionate developer who..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none" />
            </div>
            <Input label="Currently Working On" value={data.about.workingOn} onChange={(v) => update('about', 'workingOn', v)} placeholder="an awesome project" />
            <Input label="Currently Learning" value={data.about.learning} onChange={(v) => update('about', 'learning', v)} placeholder="Rust, WebAssembly" />
            <Input label="Ask Me About" value={data.about.askAbout} onChange={(v) => update('about', 'askAbout', v)} placeholder="React, Node.js, System Design" />
            <Input label="Fun Fact" value={data.about.funFact} onChange={(v) => update('about', 'funFact', v)} placeholder="I mass-debug with console.log" />
          </Section>

          {/* Connect Section */}
          <Section title="Connect With Me" icon={Globe} enabled={data.connect.enabled}
            onToggle={() => toggleEnabled('connect')} open={!!openSections.connect} onOpenToggle={() => toggleSection('connect')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="GitHub Username" value={data.connect.github} onChange={(v) => update('connect', 'github', v)} placeholder="username" />
              <Input label="LinkedIn Username" value={data.connect.linkedin} onChange={(v) => update('connect', 'linkedin', v)} placeholder="username" />
              <Input label="X (Twitter) Handle" value={data.connect.twitter} onChange={(v) => update('connect', 'twitter', v)} placeholder="handle" />
              <Input label="Portfolio URL" value={data.connect.portfolio} onChange={(v) => update('connect', 'portfolio', v)} placeholder="https://yoursite.com" />
              <Input label="Email" value={data.connect.email} onChange={(v) => update('connect', 'email', v)} placeholder="you@email.com" />
              <Input label="YouTube Channel" value={data.connect.youtube} onChange={(v) => update('connect', 'youtube', v)} placeholder="channel" />
              <Input label="Dev.to Username" value={data.connect.devto} onChange={(v) => update('connect', 'devto', v)} placeholder="username" />
              <Input label="Medium Username" value={data.connect.medium} onChange={(v) => update('connect', 'medium', v)} placeholder="username" />
            </div>
          </Section>

          {/* Tech Stack Section */}
          <Section title="Tech Stack" icon={Zap} enabled={data.techStack.enabled}
            onToggle={() => toggleEnabled('techStack')} open={!!openSections.techStack} onOpenToggle={() => toggleSection('techStack')}>
            {data.techStack.selected.length > 0 && (
              <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">
                {data.techStack.selected.length} selected
              </div>
            )}
            {Object.entries(TECH_BADGES).map(([category, badges]) => (
              <div key={category}>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{category}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {badges.map(badge => {
                    const active = data.techStack.selected.includes(badge.name);
                    return (
                      <button key={badge.name} onClick={() => toggleTech(badge.name)} type="button"
                        className={`px-2.5 py-1 text-xs rounded-md border transition-all ${active
                          ? 'bg-purple-100 dark:bg-purple-900/40 border-purple-400 dark:border-purple-600 text-purple-700 dark:text-purple-300 font-medium'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 text-gray-600 dark:text-gray-400'}`}>
                        {badge.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </Section>

          {/* GitHub Stats Section */}
          <Section title="GitHub Stats" icon={BarChart3} enabled={data.stats.enabled}
            onToggle={() => toggleEnabled('stats')} open={!!openSections.stats} onOpenToggle={() => toggleSection('stats')}>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Requires GitHub username in Connect section.</p>
            {[
              { key: 'showStats' as const, label: 'GitHub Stats Card' },
              { key: 'showLanguages' as const, label: 'Top Languages Card' },
              { key: 'showStreak' as const, label: 'Streak Stats Card' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <button type="button" onClick={() => update('stats', key, !data.stats[key])}
                  className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${data.stats[key] ? 'bg-purple-600 border-purple-600' : 'border-gray-300 dark:border-gray-600'}`}>
                  {data.stats[key] && <Check className="w-3 h-3 text-white" />}
                </button>
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </Section>

          {/* Blog Section */}
          <Section title="Recent Blog Posts" icon={FileText} enabled={data.blog.enabled}
            onToggle={() => toggleEnabled('blog')} open={!!openSections.blog} onOpenToggle={() => toggleSection('blog')}>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Adds a placeholder section. Use <a href="https://github.com/gautamkrishnar/blog-post-workflow" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">blog-post-workflow</a> GitHub Action to auto-update it with your latest posts.
            </p>
          </Section>

          {/* Support Section */}
          <Section title="Support / Buy Me a Coffee" icon={Coffee} enabled={data.support.enabled}
            onToggle={() => toggleEnabled('support')} open={!!openSections.support} onOpenToggle={() => toggleSection('support')}>
            <Input label="Buy Me a Coffee Username" value={data.support.buymeacoffee} onChange={(v) => update('support', 'buymeacoffee', v)} placeholder="yourname" />
          </Section>
        </div>

        {/* Right - Preview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <button onClick={() => setShowRaw(false)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition ${!showRaw ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-medium' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
            <button onClick={() => setShowRaw(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition ${showRaw ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-medium' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              <Code2 className="w-3.5 h-3.5" /> Raw Markdown
            </button>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-xl min-h-[500px] max-h-[75vh] overflow-auto">
            {showRaw ? (
              <pre className="p-4 text-xs font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                {markdown || 'Fill in the form to generate your README...'}
              </pre>
            ) : (
              <div className="p-4">
                {markdown ? (
                  <div className="readme-preview text-center" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
                    <Github className="w-12 h-12 mb-3 opacity-50" />
                    <p className="text-sm">Fill in the form sections to generate your GitHub profile README</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
