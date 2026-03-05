'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from 'pdf-lib';
import {
  Plus, Trash2, Download, Save, RotateCcw, Eye, ChevronDown, ChevronUp,
  User, Briefcase, GraduationCap, Wrench, Award, FolderOpen, Globe, Palette,
} from 'lucide-react';
import { cn, downloadBlob } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

interface Skill {
  id: string;
  category: string;
  items: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

interface Language {
  id: string;
  name: string;
  proficiency: string;
}

interface ResumeData {
  personal: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
}

type Template = 'modern' | 'classic' | 'minimal';
type SectionKey = 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages';

const SECTION_ORDER: SectionKey[] = ['experience', 'education', 'skills', 'projects', 'certifications', 'languages'];
const SECTION_LABELS: Record<SectionKey, string> = {
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  languages: 'Languages',
};
const SECTION_ICONS: Record<SectionKey, typeof Briefcase> = {
  experience: Briefcase,
  education: GraduationCap,
  skills: Wrench,
  projects: FolderOpen,
  certifications: Award,
  languages: Globe,
};

const TEMPLATES: { value: Template; label: string; desc: string }[] = [
  { value: 'modern', label: 'Modern', desc: 'Clean with accent sidebar' },
  { value: 'classic', label: 'Classic', desc: 'Traditional ATS-friendly' },
  { value: 'minimal', label: 'Minimal', desc: 'Simple and elegant' },
];

const ACCENT_COLORS = [
  '#1e3a5f', '#0f766e', '#7c3aed', '#be123c', '#c2410c', '#15803d', '#1d4ed8', '#334155',
];

const uid = () => Math.random().toString(36).slice(2, 9);

const emptyResume: ResumeData = {
  personal: { fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '', linkedin: '', summary: '' },
  experiences: [{ id: uid(), company: '', position: '', location: '', startDate: '', endDate: '', current: false, bullets: [''] }],
  education: [{ id: uid(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }],
  skills: [{ id: uid(), category: 'Technical Skills', items: '' }],
  projects: [],
  certifications: [],
  languages: [],
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export function ResumeBuilderTool() {
  const [resume, setResume] = useState<ResumeData>(emptyResume);
  const [template, setTemplate] = useState<Template>('modern');
  const [accentColor, setAccentColor] = useState('#1e3a5f');
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [visibleSections, setVisibleSections] = useState<SectionKey[]>(['experience', 'education', 'skills']);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const previewRef = useRef<HTMLDivElement>(null);

  // Load saved data
  useEffect(() => {
    try {
      const saved = localStorage.getItem('toolsarena_resume');
      if (saved) {
        const parsed = JSON.parse(saved);
        setResume(parsed.resume || emptyResume);
        if (parsed.template) setTemplate(parsed.template);
        if (parsed.accentColor) setAccentColor(parsed.accentColor);
        if (parsed.visibleSections) setVisibleSections(parsed.visibleSections);
      }
    } catch { /* ignore */ }
  }, []);

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('toolsarena_resume', JSON.stringify({ resume, template, accentColor, visibleSections }));
    }, 500);
    return () => clearTimeout(timer);
  }, [resume, template, accentColor, visibleSections]);

  const updatePersonal = useCallback((field: keyof PersonalInfo, value: string) => {
    setResume(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  }, []);

  const resetResume = () => {
    if (confirm('This will clear all your resume data. Continue?')) {
      setResume(emptyResume);
      setVisibleSections(['experience', 'education', 'skills']);
      localStorage.removeItem('toolsarena_resume');
    }
  };

  const toggleSection = (key: SectionKey) => {
    setVisibleSections(prev =>
      prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key],
    );
  };

  /* ---------------------------------------------------------------- */
  /*  EXPERIENCE helpers                                               */
  /* ---------------------------------------------------------------- */
  const addExperience = () => {
    setResume(prev => ({
      ...prev,
      experiences: [...prev.experiences, { id: uid(), company: '', position: '', location: '', startDate: '', endDate: '', current: false, bullets: [''] }],
    }));
  };
  const removeExperience = (id: string) => {
    setResume(prev => ({ ...prev, experiences: prev.experiences.filter(e => e.id !== id) }));
  };
  const updateExperience = (id: string, field: string, value: string | boolean | string[]) => {
    setResume(prev => ({
      ...prev,
      experiences: prev.experiences.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
  };

  /* ---------------------------------------------------------------- */
  /*  EDUCATION helpers                                                */
  /* ---------------------------------------------------------------- */
  const addEducation = () => {
    setResume(prev => ({
      ...prev,
      education: [...prev.education, { id: uid(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }],
    }));
  };
  const removeEducation = (id: string) => {
    setResume(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  };
  const updateEducation = (id: string, field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
  };

  /* ---------------------------------------------------------------- */
  /*  SKILLS helpers                                                   */
  /* ---------------------------------------------------------------- */
  const addSkill = () => {
    setResume(prev => ({ ...prev, skills: [...prev.skills, { id: uid(), category: '', items: '' }] }));
  };
  const removeSkill = (id: string) => {
    setResume(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) }));
  };
  const updateSkill = (id: string, field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, [field]: value } : s),
    }));
  };

  /* ---------------------------------------------------------------- */
  /*  PROJECTS helpers                                                 */
  /* ---------------------------------------------------------------- */
  const addProject = () => {
    setResume(prev => ({ ...prev, projects: [...prev.projects, { id: uid(), name: '', description: '', technologies: '', link: '' }] }));
  };
  const removeProject = (id: string) => {
    setResume(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };
  const updateProject = (id: string, field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p),
    }));
  };

  /* ---------------------------------------------------------------- */
  /*  CERTIFICATIONS helpers                                           */
  /* ---------------------------------------------------------------- */
  const addCertification = () => {
    setResume(prev => ({ ...prev, certifications: [...prev.certifications, { id: uid(), name: '', issuer: '', date: '' }] }));
  };
  const removeCertification = (id: string) => {
    setResume(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== id) }));
  };
  const updateCertification = (id: string, field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => c.id === id ? { ...c, [field]: value } : c),
    }));
  };

  /* ---------------------------------------------------------------- */
  /*  LANGUAGES helpers                                                */
  /* ---------------------------------------------------------------- */
  const addLanguage = () => {
    setResume(prev => ({ ...prev, languages: [...prev.languages, { id: uid(), name: '', proficiency: 'Professional' }] }));
  };
  const removeLanguage = (id: string) => {
    setResume(prev => ({ ...prev, languages: prev.languages.filter(l => l.id !== id) }));
  };
  const updateLanguage = (id: string, field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      languages: prev.languages.map(l => l.id === id ? { ...l, [field]: value } : l),
    }));
  };

  /* ---------------------------------------------------------------- */
  /*  PDF GENERATION                                                   */
  /* ---------------------------------------------------------------- */
  const generatePDF = async () => {
    setGenerating(true);
    try {
      const doc = await PDFDocument.create();
      const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
      const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
      const fontItalic = await doc.embedFont(StandardFonts.HelveticaOblique);

      const PAGE_W = 595.28; // A4
      const PAGE_H = 841.89;
      const MARGIN = 50;
      const CONTENT_W = PAGE_W - MARGIN * 2;

      // Parse accent color
      const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return rgb(r, g, b);
      };
      const accent = hexToRgb(accentColor);
      const black = rgb(0.1, 0.1, 0.1);
      const gray = rgb(0.4, 0.4, 0.4);
      const lightGray = rgb(0.85, 0.85, 0.85);

      let page = doc.addPage([PAGE_W, PAGE_H]);
      let y = PAGE_H - MARGIN;

      const ensureSpace = (needed: number): PDFPage => {
        if (y - needed < MARGIN) {
          page = doc.addPage([PAGE_W, PAGE_H]);
          y = PAGE_H - MARGIN;
        }
        return page;
      };

      const drawText = (text: string, x: number, yPos: number, font: PDFFont, size: number, color = black) => {
        page.drawText(text, { x, y: yPos, size, font, color });
      };

      // Word wrap helper
      const wrapText = (text: string, font: PDFFont, size: number, maxWidth: number): string[] => {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const width = font.widthOfTextAtSize(testLine, size);
          if (width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) lines.push(currentLine);
        return lines.length ? lines : [''];
      };

      const drawWrapped = (text: string, x: number, font: PDFFont, size: number, maxWidth: number, color = black, lineHeight = 1.4) => {
        const lines = wrapText(text, font, size, maxWidth);
        for (const line of lines) {
          ensureSpace(size * lineHeight + 5);
          drawText(line, x, y, font, size, color);
          y -= size * lineHeight;
        }
      };

      const drawSectionTitle = (title: string) => {
        ensureSpace(30);
        y -= 12;
        drawText(title.toUpperCase(), MARGIN, y, fontBold, 11, accent);
        y -= 4;
        page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 1.5, color: accent });
        y -= 14;
      };

      /* ---- HEADER ---- */
      if (template === 'modern') {
        // Accent bar at top
        page.drawRectangle({ x: 0, y: PAGE_H - 8, width: PAGE_W, height: 8, color: accent });
      }

      // Name
      const nameSize = template === 'minimal' ? 22 : 26;
      drawText(resume.personal.fullName || 'Your Name', MARGIN, y, fontBold, nameSize, template === 'modern' ? accent : black);
      y -= nameSize * 0.4;

      // Job title
      if (resume.personal.jobTitle) {
        y -= 6;
        drawText(resume.personal.jobTitle, MARGIN, y, fontRegular, 12, gray);
        y -= 16;
      } else {
        y -= 12;
      }

      // Contact line
      const contactParts: string[] = [];
      if (resume.personal.email) contactParts.push(resume.personal.email);
      if (resume.personal.phone) contactParts.push(resume.personal.phone);
      if (resume.personal.location) contactParts.push(resume.personal.location);
      if (resume.personal.linkedin) contactParts.push(resume.personal.linkedin);
      if (resume.personal.website) contactParts.push(resume.personal.website);

      if (contactParts.length) {
        const contactLine = contactParts.join('  |  ');
        const contactLines = wrapText(contactLine, fontRegular, 9, CONTENT_W);
        for (const line of contactLines) {
          drawText(line, MARGIN, y, fontRegular, 9, gray);
          y -= 13;
        }
      }

      // Divider after header
      if (template === 'classic') {
        y -= 4;
        page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 2, color: black });
        y -= 8;
      } else {
        y -= 6;
      }

      // Summary
      if (resume.personal.summary.trim()) {
        if (template !== 'minimal') drawSectionTitle('Professional Summary');
        else { y -= 8; }
        drawWrapped(resume.personal.summary, MARGIN, fontRegular, 10, CONTENT_W, gray);
        y -= 4;
      }

      /* ---- SECTIONS ---- */
      const orderedSections = SECTION_ORDER.filter(s => visibleSections.includes(s));

      for (const section of orderedSections) {
        if (section === 'experience' && resume.experiences.length > 0) {
          const hasContent = resume.experiences.some(e => e.company || e.position);
          if (!hasContent) continue;
          drawSectionTitle('Work Experience');
          for (const exp of resume.experiences) {
            if (!exp.company && !exp.position) continue;
            ensureSpace(40);
            // Position & Company
            drawText(exp.position || 'Position', MARGIN, y, fontBold, 11, black);
            y -= 14;
            const companyLine = [exp.company, exp.location].filter(Boolean).join(', ');
            const dateLine = [exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' - ');
            if (companyLine || dateLine) {
              const companyText = companyLine || '';
              drawText(companyText, MARGIN, y, fontItalic, 9.5, gray);
              if (dateLine) {
                const dateWidth = fontRegular.widthOfTextAtSize(dateLine, 9);
                drawText(dateLine, PAGE_W - MARGIN - dateWidth, y, fontRegular, 9, gray);
              }
              y -= 14;
            }
            // Bullets
            for (const bullet of exp.bullets) {
              if (!bullet.trim()) continue;
              ensureSpace(18);
              drawText('\u2022', MARGIN + 4, y, fontRegular, 9, gray);
              drawWrapped(bullet, MARGIN + 16, fontRegular, 9.5, CONTENT_W - 16, black);
            }
            y -= 6;
          }
        }

        if (section === 'education' && resume.education.length > 0) {
          const hasContent = resume.education.some(e => e.institution || e.degree);
          if (!hasContent) continue;
          drawSectionTitle('Education');
          for (const edu of resume.education) {
            if (!edu.institution && !edu.degree) continue;
            ensureSpace(35);
            const degreeLine = [edu.degree, edu.field].filter(Boolean).join(' in ');
            drawText(degreeLine || 'Degree', MARGIN, y, fontBold, 11, black);
            y -= 14;
            const dateLine = [edu.startDate, edu.endDate].filter(Boolean).join(' - ');
            drawText(edu.institution || '', MARGIN, y, fontItalic, 9.5, gray);
            if (dateLine) {
              const dateW = fontRegular.widthOfTextAtSize(dateLine, 9);
              drawText(dateLine, PAGE_W - MARGIN - dateW, y, fontRegular, 9, gray);
            }
            y -= 14;
            if (edu.gpa) {
              drawText(`GPA: ${edu.gpa}`, MARGIN, y, fontRegular, 9, gray);
              y -= 14;
            }
            y -= 4;
          }
        }

        if (section === 'skills' && resume.skills.length > 0) {
          const hasContent = resume.skills.some(s => s.items.trim());
          if (!hasContent) continue;
          drawSectionTitle('Skills');
          for (const skill of resume.skills) {
            if (!skill.items.trim()) continue;
            ensureSpace(20);
            if (skill.category) {
              drawText(`${skill.category}: `, MARGIN, y, fontBold, 9.5, black);
              const catWidth = fontBold.widthOfTextAtSize(`${skill.category}: `, 9.5);
              drawWrapped(skill.items, MARGIN + catWidth, fontRegular, 9.5, CONTENT_W - catWidth, gray);
            } else {
              drawWrapped(skill.items, MARGIN, fontRegular, 9.5, CONTENT_W, gray);
            }
            y -= 2;
          }
        }

        if (section === 'projects' && resume.projects.length > 0) {
          const hasContent = resume.projects.some(p => p.name);
          if (!hasContent) continue;
          drawSectionTitle('Projects');
          for (const proj of resume.projects) {
            if (!proj.name) continue;
            ensureSpace(30);
            const nameWithTech = proj.technologies ? `${proj.name}  |  ${proj.technologies}` : proj.name;
            drawText(nameWithTech, MARGIN, y, fontBold, 10, black);
            y -= 14;
            if (proj.description) {
              drawWrapped(proj.description, MARGIN, fontRegular, 9.5, CONTENT_W, gray);
            }
            if (proj.link) {
              ensureSpace(14);
              drawText(proj.link, MARGIN, y, fontRegular, 8.5, accent);
              y -= 12;
            }
            y -= 4;
          }
        }

        if (section === 'certifications' && resume.certifications.length > 0) {
          const hasContent = resume.certifications.some(c => c.name);
          if (!hasContent) continue;
          drawSectionTitle('Certifications');
          for (const cert of resume.certifications) {
            if (!cert.name) continue;
            ensureSpace(18);
            const certLine = [cert.name, cert.issuer].filter(Boolean).join(' - ');
            drawText(certLine, MARGIN, y, fontBold, 9.5, black);
            if (cert.date) {
              const dw = fontRegular.widthOfTextAtSize(cert.date, 9);
              drawText(cert.date, PAGE_W - MARGIN - dw, y, fontRegular, 9, gray);
            }
            y -= 14;
          }
        }

        if (section === 'languages' && resume.languages.length > 0) {
          const hasContent = resume.languages.some(l => l.name);
          if (!hasContent) continue;
          drawSectionTitle('Languages');
          const langLine = resume.languages
            .filter(l => l.name)
            .map(l => l.proficiency ? `${l.name} (${l.proficiency})` : l.name)
            .join('  |  ');
          drawWrapped(langLine, MARGIN, fontRegular, 10, CONTENT_W, black);
        }
      }

      const pdfBytes = await doc.save();
      const blob = new Blob([new Uint8Array(pdfBytes) as BlobPart], { type: 'application/pdf' });
      const fileName = resume.personal.fullName
        ? `${resume.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf';
      downloadBlob(blob, fileName);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  /* ---------------------------------------------------------------- */
  /*  INPUT HELPER                                                     */
  /* ---------------------------------------------------------------- */
  const inputCls = 'w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100 placeholder:text-slate-400';
  const labelCls = 'block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1';
  const cardCls = 'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4';
  const sectionBtnCls = (active: boolean) => cn(
    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all w-full text-left',
    active ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800',
  );

  /* ---------------------------------------------------------------- */
  /*  RENDER                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <div className="space-y-4">
      {/* Top bar: Template + Color + Actions */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Template selector */}
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-1">
          {TEMPLATES.map(t => (
            <button
              key={t.value}
              onClick={() => setTemplate(t.value)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                template === t.value
                  ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Accent color */}
        <div className="flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-slate-400" />
          {ACCENT_COLORS.map(c => (
            <button
              key={c}
              onClick={() => setAccentColor(c)}
              className={cn('w-5 h-5 rounded-full border-2 transition-all', accentColor === c ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent')}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <button onClick={resetResume} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-red-600 transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
        <button
          onClick={generatePDF}
          disabled={generating}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {generating ? 'Generating...' : 'Download PDF'}
        </button>
      </div>

      {/* Mobile tab switcher */}
      <div className="flex lg:hidden bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-1">
        <button onClick={() => setActiveTab('edit')} className={cn('flex-1 py-2 rounded-md text-sm font-medium', activeTab === 'edit' ? 'bg-white dark:bg-slate-700 text-primary-700 shadow-sm' : 'text-slate-500')}>
          Edit
        </button>
        <button onClick={() => setActiveTab('preview')} className={cn('flex-1 py-2 rounded-md text-sm font-medium', activeTab === 'preview' ? 'bg-white dark:bg-slate-700 text-primary-700 shadow-sm' : 'text-slate-500')}>
          <Eye className="w-4 h-4 inline mr-1" /> Preview
        </button>
      </div>

      {/* Main layout: Form + Preview */}
      <div className="flex gap-5">
        {/* ---- LEFT: FORM ---- */}
        <div className={cn('w-full lg:w-1/2 space-y-3', activeTab !== 'edit' && 'hidden lg:block')}>
          {/* Section navigation */}
          <div className={cardCls}>
            <div className="flex flex-wrap gap-1">
              <button onClick={() => setActiveSection('personal')} className={sectionBtnCls(activeSection === 'personal')}>
                <User className="w-4 h-4" /> Personal
              </button>
              {SECTION_ORDER.map(key => {
                const Icon = SECTION_ICONS[key];
                const isVisible = visibleSections.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => {
                      if (!isVisible) toggleSection(key);
                      setActiveSection(key);
                    }}
                    className={cn(sectionBtnCls(activeSection === key), !isVisible && 'opacity-40')}
                  >
                    <Icon className="w-4 h-4" /> {SECTION_LABELS[key]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manage sections */}
          <div className="flex flex-wrap gap-2 px-1">
            <span className="text-xs text-slate-400 self-center">Toggle sections:</span>
            {SECTION_ORDER.map(key => (
              <button
                key={key}
                onClick={() => toggleSection(key)}
                className={cn(
                  'text-xs px-2.5 py-1 rounded-full border transition-all',
                  visibleSections.includes(key)
                    ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-300',
                )}
              >
                {SECTION_LABELS[key]}
              </button>
            ))}
          </div>

          {/* ---- PERSONAL INFO ---- */}
          {activeSection === 'personal' && (
            <div className={cn(cardCls, 'space-y-3')}>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Personal Information</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><label className={labelCls}>Full Name *</label><input className={inputCls} placeholder="John Doe" value={resume.personal.fullName} onChange={e => updatePersonal('fullName', e.target.value)} /></div>
                <div><label className={labelCls}>Job Title</label><input className={inputCls} placeholder="Senior Software Engineer" value={resume.personal.jobTitle} onChange={e => updatePersonal('jobTitle', e.target.value)} /></div>
                <div><label className={labelCls}>Email *</label><input type="email" className={inputCls} placeholder="john@example.com" value={resume.personal.email} onChange={e => updatePersonal('email', e.target.value)} /></div>
                <div><label className={labelCls}>Phone</label><input className={inputCls} placeholder="+91 98765 43210" value={resume.personal.phone} onChange={e => updatePersonal('phone', e.target.value)} /></div>
                <div><label className={labelCls}>Location</label><input className={inputCls} placeholder="Mumbai, India" value={resume.personal.location} onChange={e => updatePersonal('location', e.target.value)} /></div>
                <div><label className={labelCls}>LinkedIn</label><input className={inputCls} placeholder="linkedin.com/in/johndoe" value={resume.personal.linkedin} onChange={e => updatePersonal('linkedin', e.target.value)} /></div>
                <div className="sm:col-span-2"><label className={labelCls}>Website / Portfolio</label><input className={inputCls} placeholder="https://johndoe.dev" value={resume.personal.website} onChange={e => updatePersonal('website', e.target.value)} /></div>
              </div>
              <div>
                <label className={labelCls}>Professional Summary</label>
                <textarea className={cn(inputCls, 'h-24 resize-none')} placeholder="Brief 2-3 sentence summary of your experience, skills, and career goals..." value={resume.personal.summary} onChange={e => updatePersonal('summary', e.target.value)} />
              </div>
            </div>
          )}

          {/* ---- EXPERIENCE ---- */}
          {activeSection === 'experience' && (
            <div className="space-y-3">
              {resume.experiences.map((exp, i) => (
                <div key={exp.id} className={cn(cardCls, 'space-y-3')}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Experience {i + 1}</h3>
                    {resume.experiences.length > 1 && (
                      <button onClick={() => removeExperience(exp.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div><label className={labelCls}>Job Title *</label><input className={inputCls} placeholder="Software Engineer" value={exp.position} onChange={e => updateExperience(exp.id, 'position', e.target.value)} /></div>
                    <div><label className={labelCls}>Company *</label><input className={inputCls} placeholder="Google" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} /></div>
                    <div><label className={labelCls}>Location</label><input className={inputCls} placeholder="Bangalore, India" value={exp.location} onChange={e => updateExperience(exp.id, 'location', e.target.value)} /></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className={labelCls}>Start Date</label><input className={inputCls} placeholder="Jan 2022" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} /></div>
                      <div>
                        <label className={labelCls}>End Date</label>
                        <input className={inputCls} placeholder="Present" value={exp.current ? 'Present' : exp.endDate} disabled={exp.current} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input type="checkbox" checked={exp.current} onChange={e => updateExperience(exp.id, 'current', e.target.checked)} className="rounded border-slate-300 text-primary-600" />
                    I currently work here
                  </label>
                  <div>
                    <label className={labelCls}>Key Achievements / Responsibilities</label>
                    {exp.bullets.map((bullet, bi) => (
                      <div key={bi} className="flex gap-2 mb-2">
                        <span className="text-slate-300 mt-2 text-xs">&#8226;</span>
                        <input
                          className={inputCls}
                          placeholder="Describe your achievement or responsibility..."
                          value={bullet}
                          onChange={e => {
                            const newBullets = [...exp.bullets];
                            newBullets[bi] = e.target.value;
                            updateExperience(exp.id, 'bullets', newBullets);
                          }}
                        />
                        {exp.bullets.length > 1 && (
                          <button onClick={() => updateExperience(exp.id, 'bullets', exp.bullets.filter((_, j) => j !== bi))} className="text-red-300 hover:text-red-500 shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                        )}
                      </div>
                    ))}
                    <button onClick={() => updateExperience(exp.id, 'bullets', [...exp.bullets, ''])} className="text-xs text-primary-600 hover:underline flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add bullet point
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={addExperience} className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-1.5">
                <Plus className="w-4 h-4" /> Add Experience
              </button>
            </div>
          )}

          {/* ---- EDUCATION ---- */}
          {activeSection === 'education' && (
            <div className="space-y-3">
              {resume.education.map((edu, i) => (
                <div key={edu.id} className={cn(cardCls, 'space-y-3')}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Education {i + 1}</h3>
                    {resume.education.length > 1 && (
                      <button onClick={() => removeEducation(edu.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div><label className={labelCls}>Institution *</label><input className={inputCls} placeholder="IIT Delhi" value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} /></div>
                    <div><label className={labelCls}>Degree *</label><input className={inputCls} placeholder="B.Tech" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} /></div>
                    <div><label className={labelCls}>Field of Study</label><input className={inputCls} placeholder="Computer Science" value={edu.field} onChange={e => updateEducation(edu.id, 'field', e.target.value)} /></div>
                    <div><label className={labelCls}>GPA / Percentage</label><input className={inputCls} placeholder="8.5 / 10" value={edu.gpa} onChange={e => updateEducation(edu.id, 'gpa', e.target.value)} /></div>
                    <div><label className={labelCls}>Start Date</label><input className={inputCls} placeholder="2018" value={edu.startDate} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} /></div>
                    <div><label className={labelCls}>End Date</label><input className={inputCls} placeholder="2022" value={edu.endDate} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} /></div>
                  </div>
                </div>
              ))}
              <button onClick={addEducation} className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-1.5">
                <Plus className="w-4 h-4" /> Add Education
              </button>
            </div>
          )}

          {/* ---- SKILLS ---- */}
          {activeSection === 'skills' && (
            <div className="space-y-3">
              {resume.skills.map((skill, i) => (
                <div key={skill.id} className={cn(cardCls, 'space-y-3')}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Skill Group {i + 1}</h3>
                    {resume.skills.length > 1 && (
                      <button onClick={() => removeSkill(skill.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                  <div><label className={labelCls}>Category</label><input className={inputCls} placeholder="e.g. Programming Languages, Frameworks, Tools" value={skill.category} onChange={e => updateSkill(skill.id, 'category', e.target.value)} /></div>
                  <div><label className={labelCls}>Skills (comma separated)</label><input className={inputCls} placeholder="JavaScript, TypeScript, React, Node.js, Python" value={skill.items} onChange={e => updateSkill(skill.id, 'items', e.target.value)} /></div>
                </div>
              ))}
              <button onClick={addSkill} className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-1.5">
                <Plus className="w-4 h-4" /> Add Skill Group
              </button>
            </div>
          )}

          {/* ---- PROJECTS ---- */}
          {activeSection === 'projects' && (
            <div className="space-y-3">
              {resume.projects.length === 0 && (
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">No projects added yet. Click below to add one.</p>
              )}
              {resume.projects.map((proj, i) => (
                <div key={proj.id} className={cn(cardCls, 'space-y-3')}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Project {i + 1}</h3>
                    <button onClick={() => removeProject(proj.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div><label className={labelCls}>Project Name *</label><input className={inputCls} placeholder="E-commerce Platform" value={proj.name} onChange={e => updateProject(proj.id, 'name', e.target.value)} /></div>
                    <div><label className={labelCls}>Technologies</label><input className={inputCls} placeholder="React, Node.js, MongoDB" value={proj.technologies} onChange={e => updateProject(proj.id, 'technologies', e.target.value)} /></div>
                  </div>
                  <div><label className={labelCls}>Description</label><textarea className={cn(inputCls, 'h-16 resize-none')} placeholder="Brief description of the project and your role..." value={proj.description} onChange={e => updateProject(proj.id, 'description', e.target.value)} /></div>
                  <div><label className={labelCls}>Link</label><input className={inputCls} placeholder="https://github.com/..." value={proj.link} onChange={e => updateProject(proj.id, 'link', e.target.value)} /></div>
                </div>
              ))}
              <button onClick={addProject} className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-1.5">
                <Plus className="w-4 h-4" /> Add Project
              </button>
            </div>
          )}

          {/* ---- CERTIFICATIONS ---- */}
          {activeSection === 'certifications' && (
            <div className="space-y-3">
              {resume.certifications.length === 0 && (
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">No certifications added yet.</p>
              )}
              {resume.certifications.map((cert, i) => (
                <div key={cert.id} className={cn(cardCls, 'space-y-3')}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Certification {i + 1}</h3>
                    <button onClick={() => removeCertification(cert.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div><label className={labelCls}>Certification Name *</label><input className={inputCls} placeholder="AWS Solutions Architect" value={cert.name} onChange={e => updateCertification(cert.id, 'name', e.target.value)} /></div>
                    <div><label className={labelCls}>Issuer</label><input className={inputCls} placeholder="Amazon Web Services" value={cert.issuer} onChange={e => updateCertification(cert.id, 'issuer', e.target.value)} /></div>
                    <div><label className={labelCls}>Date</label><input className={inputCls} placeholder="Mar 2024" value={cert.date} onChange={e => updateCertification(cert.id, 'date', e.target.value)} /></div>
                  </div>
                </div>
              ))}
              <button onClick={addCertification} className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-1.5">
                <Plus className="w-4 h-4" /> Add Certification
              </button>
            </div>
          )}

          {/* ---- LANGUAGES ---- */}
          {activeSection === 'languages' && (
            <div className="space-y-3">
              {resume.languages.length === 0 && (
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">No languages added yet.</p>
              )}
              {resume.languages.map((lang, i) => (
                <div key={lang.id} className={cn(cardCls, 'space-y-3')}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Language {i + 1}</h3>
                    <button onClick={() => removeLanguage(lang.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div><label className={labelCls}>Language *</label><input className={inputCls} placeholder="English" value={lang.name} onChange={e => updateLanguage(lang.id, 'name', e.target.value)} /></div>
                    <div>
                      <label className={labelCls}>Proficiency</label>
                      <select className={inputCls} value={lang.proficiency} onChange={e => updateLanguage(lang.id, 'proficiency', e.target.value)}>
                        <option>Native</option>
                        <option>Fluent</option>
                        <option>Professional</option>
                        <option>Intermediate</option>
                        <option>Basic</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addLanguage} className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-1.5">
                <Plus className="w-4 h-4" /> Add Language
              </button>
            </div>
          )}
        </div>

        {/* ---- RIGHT: LIVE PREVIEW ---- */}
        <div className={cn('w-full lg:w-1/2', activeTab !== 'preview' && 'hidden lg:block')}>
          <div className="sticky top-4">
            <div className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Live Preview — {TEMPLATES.find(t => t.value === template)?.label} Template
            </div>
            <div
              ref={previewRef}
              className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
              style={{ aspectRatio: '210/297', maxHeight: '80vh' }}
            >
              <div className="w-full h-full overflow-y-auto p-6 sm:p-8 text-slate-800" style={{ fontSize: '0.65rem', lineHeight: 1.5 }}>
                {/* Header accent bar */}
                {template === 'modern' && (
                  <div className="h-1.5 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-5" style={{ backgroundColor: accentColor }} />
                )}

                {/* Name */}
                <h1
                  className="font-bold tracking-tight"
                  style={{ fontSize: '1.4rem', color: template === 'modern' ? accentColor : '#1a1a1a' }}
                >
                  {resume.personal.fullName || 'Your Name'}
                </h1>

                {/* Job Title */}
                {resume.personal.jobTitle && (
                  <p className="text-slate-500 mt-0.5" style={{ fontSize: '0.75rem' }}>{resume.personal.jobTitle}</p>
                )}

                {/* Contact */}
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-slate-400" style={{ fontSize: '0.55rem' }}>
                  {resume.personal.email && <span>{resume.personal.email}</span>}
                  {resume.personal.phone && <><span>|</span><span>{resume.personal.phone}</span></>}
                  {resume.personal.location && <><span>|</span><span>{resume.personal.location}</span></>}
                  {resume.personal.linkedin && <><span>|</span><span>{resume.personal.linkedin}</span></>}
                  {resume.personal.website && <><span>|</span><span>{resume.personal.website}</span></>}
                </div>

                {/* Divider */}
                {template === 'classic' ? (
                  <div className="border-b-2 border-slate-800 mt-3 mb-3" />
                ) : (
                  <div className="mt-3 mb-3" />
                )}

                {/* Summary */}
                {resume.personal.summary && (
                  <div className="mb-3">
                    {template !== 'minimal' && (
                      <PreviewSectionTitle title="Professional Summary" color={accentColor} template={template} />
                    )}
                    <p className="text-slate-500" style={{ fontSize: '0.6rem' }}>{resume.personal.summary}</p>
                  </div>
                )}

                {/* Sections */}
                {SECTION_ORDER.filter(s => visibleSections.includes(s)).map(section => (
                  <PreviewSection
                    key={section}
                    section={section}
                    resume={resume}
                    accentColor={accentColor}
                    template={template}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PREVIEW SUB-COMPONENTS                                             */
/* ------------------------------------------------------------------ */

function PreviewSectionTitle({ title, color, template }: { title: string; color: string; template: Template }) {
  return (
    <div className="mb-1.5">
      <h2 className="font-bold uppercase tracking-wide" style={{ fontSize: '0.65rem', color }}>{title}</h2>
      <div className="h-px mt-0.5" style={{ backgroundColor: color, opacity: 0.5 }} />
    </div>
  );
}

function PreviewSection({ section, resume, accentColor, template }: { section: SectionKey; resume: ResumeData; accentColor: string; template: Template }) {
  const fontSize = '0.58rem';
  const smallFont = '0.52rem';

  if (section === 'experience') {
    const items = resume.experiences.filter(e => e.company || e.position);
    if (!items.length) return null;
    return (
      <div className="mb-3">
        <PreviewSectionTitle title="Work Experience" color={accentColor} template={template} />
        {items.map(exp => (
          <div key={exp.id} className="mb-2">
            <div className="flex justify-between items-baseline">
              <span className="font-bold" style={{ fontSize }}>{exp.position}</span>
              <span className="text-slate-400" style={{ fontSize: smallFont }}>
                {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' - ')}
              </span>
            </div>
            <div className="text-slate-400 italic" style={{ fontSize: smallFont }}>
              {[exp.company, exp.location].filter(Boolean).join(', ')}
            </div>
            {exp.bullets.filter(b => b.trim()).length > 0 && (
              <ul className="mt-0.5 space-y-0.5 text-slate-600" style={{ fontSize: smallFont }}>
                {exp.bullets.filter(b => b.trim()).map((b, i) => (
                  <li key={i} className="flex gap-1">
                    <span className="shrink-0 mt-px">&bull;</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (section === 'education') {
    const items = resume.education.filter(e => e.institution || e.degree);
    if (!items.length) return null;
    return (
      <div className="mb-3">
        <PreviewSectionTitle title="Education" color={accentColor} template={template} />
        {items.map(edu => (
          <div key={edu.id} className="mb-1.5">
            <div className="flex justify-between items-baseline">
              <span className="font-bold" style={{ fontSize }}>{[edu.degree, edu.field].filter(Boolean).join(' in ')}</span>
              <span className="text-slate-400" style={{ fontSize: smallFont }}>{[edu.startDate, edu.endDate].filter(Boolean).join(' - ')}</span>
            </div>
            <div className="text-slate-400 italic" style={{ fontSize: smallFont }}>
              {edu.institution}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (section === 'skills') {
    const items = resume.skills.filter(s => s.items.trim());
    if (!items.length) return null;
    return (
      <div className="mb-3">
        <PreviewSectionTitle title="Skills" color={accentColor} template={template} />
        {items.map(skill => (
          <div key={skill.id} className="mb-0.5" style={{ fontSize }}>
            {skill.category && <span className="font-bold">{skill.category}: </span>}
            <span className="text-slate-500">{skill.items}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section === 'projects') {
    const items = resume.projects.filter(p => p.name);
    if (!items.length) return null;
    return (
      <div className="mb-3">
        <PreviewSectionTitle title="Projects" color={accentColor} template={template} />
        {items.map(proj => (
          <div key={proj.id} className="mb-1.5">
            <div className="font-bold" style={{ fontSize }}>
              {proj.name}
              {proj.technologies && <span className="font-normal text-slate-400"> | {proj.technologies}</span>}
            </div>
            {proj.description && <p className="text-slate-500" style={{ fontSize: smallFont }}>{proj.description}</p>}
            {proj.link && <p style={{ fontSize: smallFont, color: accentColor }}>{proj.link}</p>}
          </div>
        ))}
      </div>
    );
  }

  if (section === 'certifications') {
    const items = resume.certifications.filter(c => c.name);
    if (!items.length) return null;
    return (
      <div className="mb-3">
        <PreviewSectionTitle title="Certifications" color={accentColor} template={template} />
        {items.map(cert => (
          <div key={cert.id} className="flex justify-between mb-0.5" style={{ fontSize }}>
            <span><span className="font-bold">{cert.name}</span>{cert.issuer && ` - ${cert.issuer}`}</span>
            {cert.date && <span className="text-slate-400" style={{ fontSize: smallFont }}>{cert.date}</span>}
          </div>
        ))}
      </div>
    );
  }

  if (section === 'languages') {
    const items = resume.languages.filter(l => l.name);
    if (!items.length) return null;
    return (
      <div className="mb-3">
        <PreviewSectionTitle title="Languages" color={accentColor} template={template} />
        <div style={{ fontSize }}>
          {items.map((l, i) => (
            <span key={l.id}>
              {i > 0 && '  |  '}
              <span className="font-bold">{l.name}</span>
              {l.proficiency && <span className="text-slate-400"> ({l.proficiency})</span>}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
