'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  BookOpen,
  FileText,
  Globe,
  Users,
  GraduationCap,
  Newspaper,
  Video,
  ClipboardList,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Download,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  Sparkles,
  ListOrdered,
  History,
  X,
} from 'lucide-react';

/* ─────────────────────────── TYPES ─────────────────────────── */

type CitationStyle = 'apa7' | 'mla9' | 'chicago' | 'harvard' | 'ieee' | 'vancouver';
type SourceType =
  | 'book'
  | 'journal'
  | 'website'
  | 'conference'
  | 'thesis'
  | 'newspaper'
  | 'video'
  | 'report';

interface Author {
  firstName: string;
  lastName: string;
}

interface BookFields {
  authors: Author[];
  title: string;
  publisher: string;
  year: string;
  edition: string;
  city: string;
  isbn: string;
}

interface JournalFields {
  authors: Author[];
  articleTitle: string;
  journalName: string;
  volume: string;
  issue: string;
  pages: string;
  year: string;
  doi: string;
}

interface WebsiteFields {
  authors: Author[];
  pageTitle: string;
  websiteName: string;
  url: string;
  accessDate: string;
  publicationDate: string;
}

interface ConferenceFields {
  authors: Author[];
  paperTitle: string;
  conferenceName: string;
  location: string;
  year: string;
  pages: string;
}

interface ThesisFields {
  author: Author;
  title: string;
  degreeType: string;
  university: string;
  year: string;
}

interface NewspaperFields {
  authors: Author[];
  articleTitle: string;
  newspaperName: string;
  date: string;
  pages: string;
  url: string;
}

interface VideoFields {
  creator: Author;
  title: string;
  platform: string;
  url: string;
  date: string;
}

interface ReportFields {
  authors: Author[];
  organization: string;
  title: string;
  reportNumber: string;
  publisher: string;
  year: string;
}

type SourceFields =
  | BookFields
  | JournalFields
  | WebsiteFields
  | ConferenceFields
  | ThesisFields
  | NewspaperFields
  | VideoFields
  | ReportFields;

interface CitationResult {
  inText: string;
  reference: string;
  referenceHtml: string;
}

interface BibliographyEntry {
  id: string;
  style: CitationStyle;
  sourceType: SourceType;
  reference: string;
  referenceHtml: string;
  inText: string;
}

interface HistoryEntry {
  id: string;
  style: CitationStyle;
  sourceType: SourceType;
  reference: string;
  timestamp: number;
}

/* ─────────────────────── CONSTANTS ─────────────────────── */

const STYLES: { key: CitationStyle; label: string }[] = [
  { key: 'apa7', label: 'APA 7th' },
  { key: 'mla9', label: 'MLA 9th' },
  { key: 'chicago', label: 'Chicago' },
  { key: 'harvard', label: 'Harvard' },
  { key: 'ieee', label: 'IEEE' },
  { key: 'vancouver', label: 'Vancouver' },
];

const SOURCE_TYPES: { key: SourceType; label: string; icon: typeof BookOpen }[] = [
  { key: 'book', label: 'Book', icon: BookOpen },
  { key: 'journal', label: 'Journal Article', icon: FileText },
  { key: 'website', label: 'Website', icon: Globe },
  { key: 'conference', label: 'Conference Paper', icon: Users },
  { key: 'thesis', label: 'Thesis / Dissertation', icon: GraduationCap },
  { key: 'newspaper', label: 'Newspaper Article', icon: Newspaper },
  { key: 'video', label: 'Video / Film', icon: Video },
  { key: 'report', label: 'Report', icon: ClipboardList },
];

const DEGREE_TYPES = [
  'Doctoral dissertation',
  "Master's thesis",
  'Undergraduate thesis',
];

const STORAGE_KEY = 'citation-generator-history';

/* ─────────────────── HELPER FUNCTIONS ─────────────────── */

function emptyAuthor(): Author {
  return { firstName: '', lastName: '' };
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function formatAuthorAPA(a: Author): string {
  if (!a.lastName) return '';
  const initial = a.firstName ? `${a.firstName.charAt(0).toUpperCase()}.` : '';
  return `${a.lastName}, ${initial}`.trim();
}

function formatAuthorMLA(a: Author, isFirst: boolean): string {
  if (!a.lastName) return '';
  if (isFirst) return `${a.lastName}, ${a.firstName}`;
  return `${a.firstName} ${a.lastName}`;
}

function formatAuthorChicago(a: Author, isFirst: boolean): string {
  if (!a.lastName) return '';
  if (isFirst) return `${a.lastName}, ${a.firstName}`;
  return `${a.firstName} ${a.lastName}`;
}

function formatAuthorHarvard(a: Author): string {
  if (!a.lastName) return '';
  const initial = a.firstName ? `${a.firstName.charAt(0).toUpperCase()}.` : '';
  return `${a.lastName}, ${initial}`.trim();
}

function formatAuthorIEEE(a: Author): string {
  if (!a.lastName) return '';
  const initial = a.firstName ? `${a.firstName.charAt(0).toUpperCase()}.` : '';
  return `${initial} ${a.lastName}`.trim();
}

function formatAuthorVancouver(a: Author): string {
  if (!a.lastName) return '';
  const initial = a.firstName ? a.firstName.charAt(0).toUpperCase() : '';
  return `${a.lastName} ${initial}`.trim();
}

function validAuthors(authors: Author[]): Author[] {
  return authors.filter((a) => a.lastName.trim() !== '');
}

function formatAuthorsForStyle(
  authors: Author[],
  style: CitationStyle
): string {
  const valid = validAuthors(authors);
  if (valid.length === 0) return '';

  switch (style) {
    case 'apa7': {
      if (valid.length === 1) return formatAuthorAPA(valid[0]);
      if (valid.length === 2)
        return `${formatAuthorAPA(valid[0])}, & ${formatAuthorAPA(valid[1])}`;
      if (valid.length <= 20)
        return (
          valid
            .slice(0, -1)
            .map(formatAuthorAPA)
            .join(', ') +
          ', & ' +
          formatAuthorAPA(valid[valid.length - 1])
        );
      return (
        valid
          .slice(0, 19)
          .map(formatAuthorAPA)
          .join(', ') +
        ', ... ' +
        formatAuthorAPA(valid[valid.length - 1])
      );
    }
    case 'mla9': {
      if (valid.length === 1) return formatAuthorMLA(valid[0], true);
      if (valid.length === 2)
        return `${formatAuthorMLA(valid[0], true)}, and ${formatAuthorMLA(valid[1], false)}`;
      return `${formatAuthorMLA(valid[0], true)}, et al.`;
    }
    case 'chicago': {
      if (valid.length === 1) return formatAuthorChicago(valid[0], true);
      if (valid.length <= 3) {
        const parts = valid.map((a, i) => formatAuthorChicago(a, i === 0));
        const last = parts.pop()!;
        return parts.join(', ') + ', and ' + last;
      }
      return `${formatAuthorChicago(valid[0], true)}, et al.`;
    }
    case 'harvard': {
      if (valid.length === 1) return formatAuthorHarvard(valid[0]);
      if (valid.length === 2)
        return `${formatAuthorHarvard(valid[0])} and ${formatAuthorHarvard(valid[1])}`;
      if (valid.length === 3)
        return `${formatAuthorHarvard(valid[0])}, ${formatAuthorHarvard(valid[1])} and ${formatAuthorHarvard(valid[2])}`;
      return `${formatAuthorHarvard(valid[0])} et al.`;
    }
    case 'ieee': {
      if (valid.length === 1) return formatAuthorIEEE(valid[0]);
      if (valid.length <= 6)
        return (
          valid
            .slice(0, -1)
            .map(formatAuthorIEEE)
            .join(', ') +
          ', and ' +
          formatAuthorIEEE(valid[valid.length - 1])
        );
      return (
        valid
          .slice(0, 6)
          .map(formatAuthorIEEE)
          .join(', ') + ', et al.'
      );
    }
    case 'vancouver': {
      if (valid.length <= 6) return valid.map(formatAuthorVancouver).join(', ');
      return (
        valid
          .slice(0, 6)
          .map(formatAuthorVancouver)
          .join(', ') + ', et al.'
      );
    }
    default:
      return valid.map((a) => `${a.lastName}, ${a.firstName}`).join(', ');
  }
}

// Chicago join helper — the lambda approach above was a mistake, fix it properly:
function chicagoJoinAuthors(authors: Author[]): string {
  const valid = validAuthors(authors);
  if (valid.length === 0) return '';
  if (valid.length === 1) return formatAuthorChicago(valid[0], true);
  if (valid.length <= 3) {
    const parts = valid.map((a, i) => formatAuthorChicago(a, i === 0));
    const last = parts.pop()!;
    return parts.join(', ') + ', and ' + last;
  }
  return `${formatAuthorChicago(valid[0], true)} et al.`;
}

function inTextAuthors(authors: Author[], style: CitationStyle): string {
  const valid = validAuthors(authors);
  if (valid.length === 0) return 'Unknown';

  switch (style) {
    case 'apa7':
      if (valid.length === 1) return valid[0].lastName;
      if (valid.length === 2) return `${valid[0].lastName} & ${valid[1].lastName}`;
      return `${valid[0].lastName} et al.`;
    case 'mla9':
      if (valid.length === 1) return valid[0].lastName;
      if (valid.length === 2) return `${valid[0].lastName} and ${valid[1].lastName}`;
      return `${valid[0].lastName} et al.`;
    case 'chicago':
      if (valid.length === 1) return valid[0].lastName;
      if (valid.length <= 3)
        return valid.map((a) => a.lastName).join(', ').replace(/, ([^,]*)$/, ', and $1');
      return `${valid[0].lastName} et al.`;
    case 'harvard':
      if (valid.length === 1) return valid[0].lastName;
      if (valid.length === 2) return `${valid[0].lastName} and ${valid[1].lastName}`;
      return `${valid[0].lastName} et al.`;
    case 'ieee':
    case 'vancouver':
      return '';
    default:
      return valid[0].lastName;
  }
}

/* ─────────────────── CITATION FORMATTERS ─────────────────── */

function generateBookCitation(
  fields: BookFields,
  style: CitationStyle
): CitationResult {
  const { authors, title, publisher, year, edition, city } = fields;
  const authStr = formatAuthorsForStyle(authors, style);
  const chicagoAuth = chicagoJoinAuthors(authors);
  const ed = edition ? ` (${edition} ed.)` : '';
  const edMLA = edition ? `, ${edition} ed.` : '';
  const inAuth = inTextAuthors(authors, style);

  switch (style) {
    case 'apa7':
      return {
        inText: `(${inAuth}, ${year})`,
        reference: `${authStr} (${year}). ${title}${ed}. ${publisher}.`,
        referenceHtml: `${authStr} (${year}). <em>${title}</em>${ed}. ${publisher}.`,
      };
    case 'mla9':
      return {
        inText: `(${inAuth}${year ? ' ' + year : ''})`,
        reference: `${authStr}. ${title}${edMLA}. ${publisher}, ${year}.`,
        referenceHtml: `${authStr}. <em>${title}</em>${edMLA}. ${publisher}, ${year}.`,
      };
    case 'chicago':
      return {
        inText: `(${inAuth} ${year})`,
        reference: `${chicagoAuth}. ${title}.${city ? ` ${city}:` : ''} ${publisher}, ${year}.`,
        referenceHtml: `${chicagoAuth}. <em>${title}</em>.${city ? ` ${city}:` : ''} ${publisher}, ${year}.`,
      };
    case 'harvard':
      return {
        inText: `(${inAuth}, ${year})`,
        reference: `${authStr} (${year}) ${title}${ed}.${city ? ` ${city}:` : ''} ${publisher}.`,
        referenceHtml: `${authStr} (${year}) <em>${title}</em>${ed}.${city ? ` ${city}:` : ''} ${publisher}.`,
      };
    case 'ieee': {
      const ieeeAuth = formatAuthorsForStyle(authors, 'ieee');
      return {
        inText: '[1]',
        reference: `[1] ${ieeeAuth}, ${title}${ed}. ${city ? city + ': ' : ''}${publisher}, ${year}.`,
        referenceHtml: `[1] ${ieeeAuth}, <em>${title}</em>${ed}. ${city ? city + ': ' : ''}${publisher}, ${year}.`,
      };
    }
    case 'vancouver': {
      const vanAuth = formatAuthorsForStyle(authors, 'vancouver');
      return {
        inText: '(1)',
        reference: `${vanAuth}. ${title}${edition ? `. ${edition} ed` : ''}. ${city ? city + ': ' : ''}${publisher}; ${year}.`,
        referenceHtml: `${vanAuth}. ${title}${edition ? `. ${edition} ed` : ''}. ${city ? city + ': ' : ''}${publisher}; ${year}.`,
      };
    }
  }
}

function generateJournalCitation(
  fields: JournalFields,
  style: CitationStyle
): CitationResult {
  const { authors, articleTitle, journalName, volume, issue, pages, year, doi } = fields;
  const authStr = formatAuthorsForStyle(authors, style);
  const chicagoAuth = chicagoJoinAuthors(authors);
  const inAuth = inTextAuthors(authors, style);
  const doiStr = doi ? ` https://doi.org/${doi.replace(/^https?:\/\/doi\.org\//, '')}` : '';

  switch (style) {
    case 'apa7':
      return {
        inText: `(${inAuth}, ${year})`,
        reference: `${authStr} (${year}). ${articleTitle}. ${journalName}, ${volume}${issue ? `(${issue})` : ''}, ${pages}.${doiStr}`,
        referenceHtml: `${authStr} (${year}). ${articleTitle}. <em>${journalName}</em>, <em>${volume}</em>${issue ? `(${issue})` : ''}, ${pages}.${doiStr}`,
      };
    case 'mla9':
      return {
        inText: `(${inAuth}${pages ? ' ' + pages.split('-')[0] : ''})`,
        reference: `${authStr}. "${articleTitle}." ${journalName}, vol. ${volume}, no. ${issue}, ${year}, pp. ${pages}.`,
        referenceHtml: `${authStr}. &ldquo;${articleTitle}.&rdquo; <em>${journalName}</em>, vol. ${volume}, no. ${issue}, ${year}, pp. ${pages}.`,
      };
    case 'chicago':
      return {
        inText: `(${inAuth} ${year}, ${pages ? pages.split('-')[0] : ''})`,
        reference: `${chicagoAuth}. "${articleTitle}." ${journalName} ${volume}, no. ${issue} (${year}): ${pages}.${doiStr}`,
        referenceHtml: `${chicagoAuth}. &ldquo;${articleTitle}.&rdquo; <em>${journalName}</em> ${volume}, no. ${issue} (${year}): ${pages}.${doiStr}`,
      };
    case 'harvard':
      return {
        inText: `(${inAuth}, ${year})`,
        reference: `${authStr} (${year}) '${articleTitle}', ${journalName}, ${volume}${issue ? `(${issue})` : ''}, pp. ${pages}.${doiStr}`,
        referenceHtml: `${authStr} (${year}) '${articleTitle}', <em>${journalName}</em>, ${volume}${issue ? `(${issue})` : ''}, pp. ${pages}.${doiStr}`,
      };
    case 'ieee': {
      const ieeeAuth = formatAuthorsForStyle(authors, 'ieee');
      return {
        inText: '[1]',
        reference: `[1] ${ieeeAuth}, "${articleTitle}," ${journalName}, vol. ${volume}, no. ${issue}, pp. ${pages}, ${year}.`,
        referenceHtml: `[1] ${ieeeAuth}, &ldquo;${articleTitle},&rdquo; <em>${journalName}</em>, vol. ${volume}, no. ${issue}, pp. ${pages}, ${year}.`,
      };
    }
    case 'vancouver': {
      const vanAuth = formatAuthorsForStyle(authors, 'vancouver');
      return {
        inText: '(1)',
        reference: `${vanAuth}. ${articleTitle}. ${journalName}. ${year};${volume}(${issue}):${pages}.`,
        referenceHtml: `${vanAuth}. ${articleTitle}. ${journalName}. ${year};${volume}(${issue}):${pages}.`,
      };
    }
  }
}

function generateWebsiteCitation(
  fields: WebsiteFields,
  style: CitationStyle
): CitationResult {
  const { authors, pageTitle, websiteName, url, accessDate, publicationDate } = fields;
  const authStr = formatAuthorsForStyle(authors, style);
  const chicagoAuth = chicagoJoinAuthors(authors);
  const inAuth = inTextAuthors(authors, style);
  const yr = publicationDate ? new Date(publicationDate).getFullYear().toString() : 'n.d.';

  switch (style) {
    case 'apa7':
      return {
        inText: `(${inAuth || websiteName}, ${yr})`,
        reference: `${authStr || websiteName}. (${yr}). ${pageTitle}. ${websiteName}. ${url}`,
        referenceHtml: `${authStr || websiteName}. (${yr}). <em>${pageTitle}</em>. ${websiteName}. ${url}`,
      };
    case 'mla9':
      return {
        inText: `(${inAuth || `"${pageTitle}"`})`,
        reference: `${authStr || ''}${authStr ? '. ' : ''}"${pageTitle}." ${websiteName}, ${publicationDate || ''}${accessDate ? `, Accessed ${accessDate}` : ''}. ${url}.`,
        referenceHtml: `${authStr || ''}${authStr ? '. ' : ''}&ldquo;${pageTitle}.&rdquo; <em>${websiteName}</em>, ${publicationDate || ''}${accessDate ? `, Accessed ${accessDate}` : ''}. ${url}.`,
      };
    case 'chicago':
      return {
        inText: `(${inAuth || websiteName} ${yr})`,
        reference: `${chicagoAuth || websiteName}. "${pageTitle}." ${websiteName}. ${publicationDate || ''}. ${url}.`,
        referenceHtml: `${chicagoAuth || websiteName}. &ldquo;${pageTitle}.&rdquo; <em>${websiteName}</em>. ${publicationDate || ''}. ${url}.`,
      };
    case 'harvard':
      return {
        inText: `(${inAuth || websiteName}, ${yr})`,
        reference: `${authStr || websiteName} (${yr}) ${pageTitle}. Available at: ${url} (Accessed: ${accessDate || 'N/A'}).`,
        referenceHtml: `${authStr || websiteName} (${yr}) <em>${pageTitle}</em>. Available at: ${url} (Accessed: ${accessDate || 'N/A'}).`,
      };
    case 'ieee': {
      const ieeeAuth = formatAuthorsForStyle(authors, 'ieee') || websiteName;
      return {
        inText: '[1]',
        reference: `[1] ${ieeeAuth}, "${pageTitle}," ${websiteName}. [Online]. Available: ${url}. [Accessed: ${accessDate || 'N/A'}].`,
        referenceHtml: `[1] ${ieeeAuth}, &ldquo;${pageTitle},&rdquo; <em>${websiteName}</em>. [Online]. Available: ${url}. [Accessed: ${accessDate || 'N/A'}].`,
      };
    }
    case 'vancouver': {
      const vanAuth = formatAuthorsForStyle(authors, 'vancouver') || websiteName;
      return {
        inText: '(1)',
        reference: `${vanAuth}. ${pageTitle} [Internet]. ${websiteName}; ${publicationDate || ''}. Available from: ${url}`,
        referenceHtml: `${vanAuth}. ${pageTitle} [Internet]. ${websiteName}; ${publicationDate || ''}. Available from: ${url}`,
      };
    }
  }
}

function generateConferenceCitation(
  fields: ConferenceFields,
  style: CitationStyle
): CitationResult {
  const { authors, paperTitle, conferenceName, location, year, pages } = fields;
  const authStr = formatAuthorsForStyle(authors, style);
  const chicagoAuth = chicagoJoinAuthors(authors);
  const inAuth = inTextAuthors(authors, style);

  switch (style) {
    case 'apa7':
      return {
        inText: `(${inAuth}, ${year})`,
        reference: `${authStr} (${year}). ${paperTitle}. In ${conferenceName}${pages ? ` (pp. ${pages})` : ''}.${location ? ` ${location}.` : ''}`,
        referenceHtml: `${authStr} (${year}). ${paperTitle}. In <em>${conferenceName}</em>${pages ? ` (pp. ${pages})` : ''}.${location ? ` ${location}.` : ''}`,
      };
    case 'mla9':
      return {
        inText: `(${inAuth})`,
        reference: `${authStr}. "${paperTitle}." ${conferenceName}, ${year}${pages ? `, pp. ${pages}` : ''}.`,
        referenceHtml: `${authStr}. &ldquo;${paperTitle}.&rdquo; <em>${conferenceName}</em>, ${year}${pages ? `, pp. ${pages}` : ''}.`,
      };
    case 'chicago':
      return {
        inText: `(${inAuth} ${year})`,
        reference: `${chicagoAuth}. "${paperTitle}." Paper presented at ${conferenceName}, ${location || ''}, ${year}.`,
        referenceHtml: `${chicagoAuth}. &ldquo;${paperTitle}.&rdquo; Paper presented at <em>${conferenceName}</em>, ${location || ''}, ${year}.`,
      };
    case 'harvard':
      return {
        inText: `(${inAuth}, ${year})`,
        reference: `${authStr} (${year}) '${paperTitle}', ${conferenceName}, ${location || ''}${pages ? `, pp. ${pages}` : ''}.`,
        referenceHtml: `${authStr} (${year}) '${paperTitle}', <em>${conferenceName}</em>, ${location || ''}${pages ? `, pp. ${pages}` : ''}.`,
      };
    case 'ieee': {
      const ieeeAuth = formatAuthorsForStyle(authors, 'ieee');
      return {
        inText: '[1]',
        reference: `[1] ${ieeeAuth}, "${paperTitle}," in ${conferenceName}, ${location || ''}, ${year}${pages ? `, pp. ${pages}` : ''}.`,
        referenceHtml: `[1] ${ieeeAuth}, &ldquo;${paperTitle},&rdquo; in <em>${conferenceName}</em>, ${location || ''}, ${year}${pages ? `, pp. ${pages}` : ''}.`,
      };
    }
    case 'vancouver': {
      const vanAuth = formatAuthorsForStyle(authors, 'vancouver');
      return {
        inText: '(1)',
        reference: `${vanAuth}. ${paperTitle}. In: ${conferenceName}; ${year}; ${location || ''}. p. ${pages || ''}.`,
        referenceHtml: `${vanAuth}. ${paperTitle}. In: ${conferenceName}; ${year}; ${location || ''}. p. ${pages || ''}.`,
      };
    }
  }
}

function generateThesisCitation(
  fields: ThesisFields,
  style: CitationStyle
): CitationResult {
  const { author, title, degreeType, university, year } = fields;
  const authors = [author];
  const authStr = formatAuthorsForStyle(authors, style);
  const chicagoAuth = chicagoJoinAuthors(authors);
  const inAuth = inTextAuthors(authors, style);

  switch (style) {
    case 'apa7':
      return {
        inText: `(${inAuth}, ${year})`,
        reference: `${authStr} (${year}). ${title} [${degreeType}, ${university}].`,
        referenceHtml: `${authStr} (${year}). <em>${title}</em> [${degreeType}, ${university}].`,
      };
    case 'mla9':
      return {
        inText: `(${inAuth})`,
        reference: `${authStr}. "${title}." ${degreeType}, ${university}, ${year}.`,
        referenceHtml: `${authStr}. &ldquo;${title}.&rdquo; ${degreeType}, ${university}, ${year}.`,
      };
    case 'chicago':
      return {
        inText: `(${inAuth} ${year})`,
        reference: `${chicagoAuth}. "${title}." ${degreeType}, ${university}, ${year}.`,
        referenceHtml: `${chicagoAuth}. &ldquo;${title}.&rdquo; ${degreeType}, ${university}, ${year}.`,
      };
    case 'harvard':
      return {
        inText: `(${inAuth}, ${year})`,
        reference: `${authStr} (${year}) ${title}. ${degreeType}. ${university}.`,
        referenceHtml: `${authStr} (${year}) <em>${title}</em>. ${degreeType}. ${university}.`,
      };
    case 'ieee': {
      const ieeeAuth = formatAuthorsForStyle(authors, 'ieee');
      return {
        inText: '[1]',
        reference: `[1] ${ieeeAuth}, "${title}," ${degreeType}, ${university}, ${year}.`,
        referenceHtml: `[1] ${ieeeAuth}, &ldquo;${title},&rdquo; ${degreeType}, ${university}, ${year}.`,
      };
    }
    case 'vancouver': {
      const vanAuth = formatAuthorsForStyle(authors, 'vancouver');
      return {
        inText: '(1)',
        reference: `${vanAuth}. ${title} [${degreeType}]. ${university}; ${year}.`,
        referenceHtml: `${vanAuth}. ${title} [${degreeType}]. ${university}; ${year}.`,
      };
    }
  }
}

function generateNewspaperCitation(
  fields: NewspaperFields,
  style: CitationStyle
): CitationResult {
  const { authors, articleTitle, newspaperName, date, pages, url } = fields;
  const authStr = formatAuthorsForStyle(authors, style);
  const chicagoAuth = chicagoJoinAuthors(authors);
  const inAuth = inTextAuthors(authors, style);
  const yr = date ? new Date(date).getFullYear().toString() : '';

  switch (style) {
    case 'apa7':
      return {
        inText: `(${inAuth}, ${yr})`,
        reference: `${authStr} (${date || yr}). ${articleTitle}. ${newspaperName}${pages ? `, ${pages}` : ''}.${url ? ` ${url}` : ''}`,
        referenceHtml: `${authStr} (${date || yr}). ${articleTitle}. <em>${newspaperName}</em>${pages ? `, ${pages}` : ''}.${url ? ` ${url}` : ''}`,
      };
    case 'mla9':
      return {
        inText: `(${inAuth})`,
        reference: `${authStr}. "${articleTitle}." ${newspaperName}, ${date || ''}${pages ? `, pp. ${pages}` : ''}.${url ? ` ${url}` : ''}`,
        referenceHtml: `${authStr}. &ldquo;${articleTitle}.&rdquo; <em>${newspaperName}</em>, ${date || ''}${pages ? `, pp. ${pages}` : ''}.${url ? ` ${url}` : ''}`,
      };
    case 'chicago':
      return {
        inText: `(${inAuth} ${yr})`,
        reference: `${chicagoAuth}. "${articleTitle}." ${newspaperName}, ${date || ''}.${url ? ` ${url}` : ''}`,
        referenceHtml: `${chicagoAuth}. &ldquo;${articleTitle}.&rdquo; <em>${newspaperName}</em>, ${date || ''}.${url ? ` ${url}` : ''}`,
      };
    case 'harvard':
      return {
        inText: `(${inAuth}, ${yr})`,
        reference: `${authStr} (${yr}) '${articleTitle}', ${newspaperName}, ${date || ''}${pages ? `, p. ${pages}` : ''}.${url ? ` Available at: ${url}` : ''}`,
        referenceHtml: `${authStr} (${yr}) '${articleTitle}', <em>${newspaperName}</em>, ${date || ''}${pages ? `, p. ${pages}` : ''}.${url ? ` Available at: ${url}` : ''}`,
      };
    case 'ieee': {
      const ieeeAuth = formatAuthorsForStyle(authors, 'ieee');
      return {
        inText: '[1]',
        reference: `[1] ${ieeeAuth}, "${articleTitle}," ${newspaperName}, ${date || ''}${pages ? `, p. ${pages}` : ''}.`,
        referenceHtml: `[1] ${ieeeAuth}, &ldquo;${articleTitle},&rdquo; <em>${newspaperName}</em>, ${date || ''}${pages ? `, p. ${pages}` : ''}.`,
      };
    }
    case 'vancouver': {
      const vanAuth = formatAuthorsForStyle(authors, 'vancouver');
      return {
        inText: '(1)',
        reference: `${vanAuth}. ${articleTitle}. ${newspaperName}. ${date || ''}${pages ? `:${pages}` : ''}.`,
        referenceHtml: `${vanAuth}. ${articleTitle}. ${newspaperName}. ${date || ''}${pages ? `:${pages}` : ''}.`,
      };
    }
  }
}

function generateVideoCitation(
  fields: VideoFields,
  style: CitationStyle
): CitationResult {
  const { creator, title, platform, url, date } = fields;
  const authors = [creator];
  const authStr = formatAuthorsForStyle(authors, style);
  const chicagoAuth = chicagoJoinAuthors(authors);
  const inAuth = inTextAuthors(authors, style);
  const yr = date ? new Date(date).getFullYear().toString() : '';

  switch (style) {
    case 'apa7':
      return {
        inText: `(${inAuth || 'Unknown'}, ${yr})`,
        reference: `${authStr || 'Unknown'} (${yr}). ${title} [Video]. ${platform}. ${url}`,
        referenceHtml: `${authStr || 'Unknown'} (${yr}). <em>${title}</em> [Video]. ${platform}. ${url}`,
      };
    case 'mla9':
      return {
        inText: `(${inAuth || `"${title}"`})`,
        reference: `"${title}." ${platform}${authStr ? `, uploaded by ${authStr.replace(/,.*/, '')}` : ''}, ${date || ''}. ${url}.`,
        referenceHtml: `&ldquo;${title}.&rdquo; <em>${platform}</em>${authStr ? `, uploaded by ${authStr.replace(/,.*/, '')}` : ''}, ${date || ''}. ${url}.`,
      };
    case 'chicago':
      return {
        inText: `(${inAuth || 'Unknown'} ${yr})`,
        reference: `${chicagoAuth || 'Unknown'}. "${title}." ${platform}. ${date || ''}. ${url}.`,
        referenceHtml: `${chicagoAuth || 'Unknown'}. &ldquo;${title}.&rdquo; <em>${platform}</em>. ${date || ''}. ${url}.`,
      };
    case 'harvard':
      return {
        inText: `(${inAuth || 'Unknown'}, ${yr})`,
        reference: `${authStr || 'Unknown'} (${yr}) ${title}. Available at: ${url} (Accessed: ${date || 'N/A'}).`,
        referenceHtml: `${authStr || 'Unknown'} (${yr}) <em>${title}</em>. Available at: ${url} (Accessed: ${date || 'N/A'}).`,
      };
    case 'ieee': {
      const ieeeAuth = formatAuthorsForStyle(authors, 'ieee') || 'Unknown';
      return {
        inText: '[1]',
        reference: `[1] ${ieeeAuth}. "${title}." ${platform}. [Online]. Available: ${url}.`,
        referenceHtml: `[1] ${ieeeAuth}. &ldquo;${title}.&rdquo; <em>${platform}</em>. [Online]. Available: ${url}.`,
      };
    }
    case 'vancouver': {
      const vanAuth = formatAuthorsForStyle(authors, 'vancouver') || 'Unknown';
      return {
        inText: '(1)',
        reference: `${vanAuth}. ${title} [Video]. ${platform}; ${date || ''}. Available from: ${url}`,
        referenceHtml: `${vanAuth}. ${title} [Video]. ${platform}; ${date || ''}. Available from: ${url}`,
      };
    }
  }
}

function generateReportCitation(
  fields: ReportFields,
  style: CitationStyle
): CitationResult {
  const { authors, organization, title, reportNumber, publisher, year } = fields;
  const authStr = formatAuthorsForStyle(authors, style) || organization;
  const chicagoAuth = chicagoJoinAuthors(authors) || organization;
  const inAuth = inTextAuthors(authors, style) || organization;
  const rn = reportNumber ? ` (${reportNumber})` : '';

  switch (style) {
    case 'apa7':
      return {
        inText: `(${inAuth}, ${year})`,
        reference: `${authStr} (${year}). ${title}${rn}. ${publisher || organization}.`,
        referenceHtml: `${authStr} (${year}). <em>${title}</em>${rn}. ${publisher || organization}.`,
      };
    case 'mla9':
      return {
        inText: `(${inAuth})`,
        reference: `${authStr}. ${title}. ${publisher || organization}, ${year}.`,
        referenceHtml: `${authStr}. <em>${title}</em>. ${publisher || organization}, ${year}.`,
      };
    case 'chicago':
      return {
        inText: `(${inAuth} ${year})`,
        reference: `${chicagoAuth}. ${title}${reportNumber ? `. Report No. ${reportNumber}` : ''}. ${publisher || organization}, ${year}.`,
        referenceHtml: `${chicagoAuth}. <em>${title}</em>${reportNumber ? `. Report No. ${reportNumber}` : ''}. ${publisher || organization}, ${year}.`,
      };
    case 'harvard':
      return {
        inText: `(${inAuth}, ${year})`,
        reference: `${authStr} (${year}) ${title}${reportNumber ? `, ${reportNumber}` : ''}. ${publisher || organization}.`,
        referenceHtml: `${authStr} (${year}) <em>${title}</em>${reportNumber ? `, ${reportNumber}` : ''}. ${publisher || organization}.`,
      };
    case 'ieee': {
      const ieeeAuth = formatAuthorsForStyle(authors, 'ieee') || organization;
      return {
        inText: '[1]',
        reference: `[1] ${ieeeAuth}, "${title},"${reportNumber ? ` Rep. ${reportNumber},` : ''} ${publisher || organization}, ${year}.`,
        referenceHtml: `[1] ${ieeeAuth}, &ldquo;${title},&rdquo;${reportNumber ? ` Rep. ${reportNumber},` : ''} ${publisher || organization}, ${year}.`,
      };
    }
    case 'vancouver': {
      const vanAuth = formatAuthorsForStyle(authors, 'vancouver') || organization;
      return {
        inText: '(1)',
        reference: `${vanAuth}. ${title}. ${publisher || organization}; ${year}${reportNumber ? `. Report No.: ${reportNumber}` : ''}.`,
        referenceHtml: `${vanAuth}. ${title}. ${publisher || organization}; ${year}${reportNumber ? `. Report No.: ${reportNumber}` : ''}.`,
      };
    }
  }
}

/* ─────────────────── DEFAULT FIELD FACTORIES ─────────────────── */

function defaultBookFields(): BookFields {
  return { authors: [emptyAuthor()], title: '', publisher: '', year: '', edition: '', city: '', isbn: '' };
}
function defaultJournalFields(): JournalFields {
  return { authors: [emptyAuthor()], articleTitle: '', journalName: '', volume: '', issue: '', pages: '', year: '', doi: '' };
}
function defaultWebsiteFields(): WebsiteFields {
  return { authors: [emptyAuthor()], pageTitle: '', websiteName: '', url: '', accessDate: '', publicationDate: '' };
}
function defaultConferenceFields(): ConferenceFields {
  return { authors: [emptyAuthor()], paperTitle: '', conferenceName: '', location: '', year: '', pages: '' };
}
function defaultThesisFields(): ThesisFields {
  return { author: emptyAuthor(), title: '', degreeType: DEGREE_TYPES[0], university: '', year: '' };
}
function defaultNewspaperFields(): NewspaperFields {
  return { authors: [emptyAuthor()], articleTitle: '', newspaperName: '', date: '', pages: '', url: '' };
}
function defaultVideoFields(): VideoFields {
  return { creator: emptyAuthor(), title: '', platform: '', url: '', date: '' };
}
function defaultReportFields(): ReportFields {
  return { authors: [emptyAuthor()], organization: '', title: '', reportNumber: '', publisher: '', year: '' };
}

function getDefaultFields(sourceType: SourceType): SourceFields {
  switch (sourceType) {
    case 'book': return defaultBookFields();
    case 'journal': return defaultJournalFields();
    case 'website': return defaultWebsiteFields();
    case 'conference': return defaultConferenceFields();
    case 'thesis': return defaultThesisFields();
    case 'newspaper': return defaultNewspaperFields();
    case 'video': return defaultVideoFields();
    case 'report': return defaultReportFields();
  }
}

function sampleBookFields(): BookFields {
  return {
    authors: [{ firstName: 'George', lastName: 'Orwell' }],
    title: 'Nineteen Eighty-Four',
    publisher: 'Secker & Warburg',
    year: '1949',
    edition: '',
    city: 'London',
    isbn: '978-0451524935',
  };
}

/* ─────────────────────── COMPONENTS ─────────────────────── */

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
      title="Copy to clipboard"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
      {label || (copied ? 'Copied' : 'Copy')}
    </button>
  );
}

function AuthorFields({
  authors,
  onChange,
  singleMode,
}: {
  authors: Author[];
  onChange: (authors: Author[]) => void;
  singleMode?: boolean;
}) {
  const updateAuthor = (idx: number, field: keyof Author, value: string) => {
    const next = [...authors];
    next[idx] = { ...next[idx], [field]: value };
    onChange(next);
  };
  const addAuthor = () => onChange([...authors, emptyAuthor()]);
  const removeAuthor = (idx: number) => {
    if (authors.length <= 1) return;
    onChange(authors.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {singleMode ? 'Author' : 'Author(s)'}
      </label>
      {authors.map((a, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="First name"
            value={a.firstName}
            onChange={(e) => updateAuthor(idx, 'firstName', e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />
          <input
            type="text"
            placeholder="Last name"
            value={a.lastName}
            onChange={(e) => updateAuthor(idx, 'lastName', e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />
          {!singleMode && authors.length > 1 && (
            <button
              onClick={() => removeAuthor(idx)}
              className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
              title="Remove author"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
      {!singleMode && (
        <button
          onClick={addAuthor}
          className="inline-flex items-center gap-1 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
        >
          <Plus className="h-3.5 w-3.5" /> Add Author
        </button>
      )}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

/* ─────────────────── SOURCE-SPECIFIC FORMS ─────────────────── */

function BookForm({ fields, onChange }: { fields: BookFields; onChange: (f: BookFields) => void }) {
  return (
    <div className="space-y-3">
      <AuthorFields authors={fields.authors} onChange={(a) => onChange({ ...fields, authors: a })} />
      <InputField label="Title" value={fields.title} onChange={(v) => onChange({ ...fields, title: v })} placeholder="Book title" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InputField label="Publisher" value={fields.publisher} onChange={(v) => onChange({ ...fields, publisher: v })} placeholder="Publisher name" />
        <InputField label="Year" value={fields.year} onChange={(v) => onChange({ ...fields, year: v })} placeholder="2024" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <InputField label="Edition" value={fields.edition} onChange={(v) => onChange({ ...fields, edition: v })} placeholder="e.g. 3rd" />
        <InputField label="City" value={fields.city} onChange={(v) => onChange({ ...fields, city: v })} placeholder="New York" />
        <InputField label="ISBN" value={fields.isbn} onChange={(v) => onChange({ ...fields, isbn: v })} placeholder="978-..." />
      </div>
    </div>
  );
}

function JournalForm({ fields, onChange }: { fields: JournalFields; onChange: (f: JournalFields) => void }) {
  return (
    <div className="space-y-3">
      <AuthorFields authors={fields.authors} onChange={(a) => onChange({ ...fields, authors: a })} />
      <InputField label="Article Title" value={fields.articleTitle} onChange={(v) => onChange({ ...fields, articleTitle: v })} placeholder="Title of the article" />
      <InputField label="Journal Name" value={fields.journalName} onChange={(v) => onChange({ ...fields, journalName: v })} placeholder="Journal of..." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <InputField label="Volume" value={fields.volume} onChange={(v) => onChange({ ...fields, volume: v })} placeholder="12" />
        <InputField label="Issue" value={fields.issue} onChange={(v) => onChange({ ...fields, issue: v })} placeholder="3" />
        <InputField label="Pages" value={fields.pages} onChange={(v) => onChange({ ...fields, pages: v })} placeholder="45-67" />
        <InputField label="Year" value={fields.year} onChange={(v) => onChange({ ...fields, year: v })} placeholder="2024" />
      </div>
      <InputField label="DOI" value={fields.doi} onChange={(v) => onChange({ ...fields, doi: v })} placeholder="10.1000/xyz123" />
    </div>
  );
}

function WebsiteForm({ fields, onChange }: { fields: WebsiteFields; onChange: (f: WebsiteFields) => void }) {
  return (
    <div className="space-y-3">
      <AuthorFields authors={fields.authors} onChange={(a) => onChange({ ...fields, authors: a })} />
      <InputField label="Page Title" value={fields.pageTitle} onChange={(v) => onChange({ ...fields, pageTitle: v })} placeholder="Title of the web page" />
      <InputField label="Website Name" value={fields.websiteName} onChange={(v) => onChange({ ...fields, websiteName: v })} placeholder="Website name" />
      <InputField label="URL" value={fields.url} onChange={(v) => onChange({ ...fields, url: v })} placeholder="https://example.com/page" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InputField label="Publication Date" value={fields.publicationDate} onChange={(v) => onChange({ ...fields, publicationDate: v })} type="date" />
        <InputField label="Access Date" value={fields.accessDate} onChange={(v) => onChange({ ...fields, accessDate: v })} type="date" />
      </div>
    </div>
  );
}

function ConferenceForm({ fields, onChange }: { fields: ConferenceFields; onChange: (f: ConferenceFields) => void }) {
  return (
    <div className="space-y-3">
      <AuthorFields authors={fields.authors} onChange={(a) => onChange({ ...fields, authors: a })} />
      <InputField label="Paper Title" value={fields.paperTitle} onChange={(v) => onChange({ ...fields, paperTitle: v })} placeholder="Title of the paper" />
      <InputField label="Conference Name" value={fields.conferenceName} onChange={(v) => onChange({ ...fields, conferenceName: v })} placeholder="Conference name" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <InputField label="Location" value={fields.location} onChange={(v) => onChange({ ...fields, location: v })} placeholder="City, Country" />
        <InputField label="Year" value={fields.year} onChange={(v) => onChange({ ...fields, year: v })} placeholder="2024" />
        <InputField label="Pages" value={fields.pages} onChange={(v) => onChange({ ...fields, pages: v })} placeholder="100-110" />
      </div>
    </div>
  );
}

function ThesisForm({ fields, onChange }: { fields: ThesisFields; onChange: (f: ThesisFields) => void }) {
  return (
    <div className="space-y-3">
      <AuthorFields authors={[fields.author]} onChange={(a) => onChange({ ...fields, author: a[0] })} singleMode />
      <InputField label="Title" value={fields.title} onChange={(v) => onChange({ ...fields, title: v })} placeholder="Thesis title" />
      <SelectField label="Degree Type" value={fields.degreeType} onChange={(v) => onChange({ ...fields, degreeType: v })} options={DEGREE_TYPES} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InputField label="University" value={fields.university} onChange={(v) => onChange({ ...fields, university: v })} placeholder="University name" />
        <InputField label="Year" value={fields.year} onChange={(v) => onChange({ ...fields, year: v })} placeholder="2024" />
      </div>
    </div>
  );
}

function NewspaperForm({ fields, onChange }: { fields: NewspaperFields; onChange: (f: NewspaperFields) => void }) {
  return (
    <div className="space-y-3">
      <AuthorFields authors={fields.authors} onChange={(a) => onChange({ ...fields, authors: a })} />
      <InputField label="Article Title" value={fields.articleTitle} onChange={(v) => onChange({ ...fields, articleTitle: v })} placeholder="Headline of the article" />
      <InputField label="Newspaper Name" value={fields.newspaperName} onChange={(v) => onChange({ ...fields, newspaperName: v })} placeholder="The New York Times" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <InputField label="Date" value={fields.date} onChange={(v) => onChange({ ...fields, date: v })} type="date" />
        <InputField label="Pages" value={fields.pages} onChange={(v) => onChange({ ...fields, pages: v })} placeholder="A1-A3" />
        <InputField label="URL (optional)" value={fields.url} onChange={(v) => onChange({ ...fields, url: v })} placeholder="https://..." />
      </div>
    </div>
  );
}

function VideoForm({ fields, onChange }: { fields: VideoFields; onChange: (f: VideoFields) => void }) {
  return (
    <div className="space-y-3">
      <AuthorFields authors={[fields.creator]} onChange={(a) => onChange({ ...fields, creator: a[0] })} singleMode />
      <InputField label="Title" value={fields.title} onChange={(v) => onChange({ ...fields, title: v })} placeholder="Video title" />
      <InputField label="Platform" value={fields.platform} onChange={(v) => onChange({ ...fields, platform: v })} placeholder="YouTube, Vimeo, etc." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InputField label="URL" value={fields.url} onChange={(v) => onChange({ ...fields, url: v })} placeholder="https://..." />
        <InputField label="Date" value={fields.date} onChange={(v) => onChange({ ...fields, date: v })} type="date" />
      </div>
    </div>
  );
}

function ReportForm({ fields, onChange }: { fields: ReportFields; onChange: (f: ReportFields) => void }) {
  return (
    <div className="space-y-3">
      <AuthorFields authors={fields.authors} onChange={(a) => onChange({ ...fields, authors: a })} />
      <InputField label="Organization" value={fields.organization} onChange={(v) => onChange({ ...fields, organization: v })} placeholder="Org / Agency name" />
      <InputField label="Title" value={fields.title} onChange={(v) => onChange({ ...fields, title: v })} placeholder="Report title" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <InputField label="Report Number" value={fields.reportNumber} onChange={(v) => onChange({ ...fields, reportNumber: v })} placeholder="TR-2024-01" />
        <InputField label="Publisher" value={fields.publisher} onChange={(v) => onChange({ ...fields, publisher: v })} placeholder="Publisher" />
        <InputField label="Year" value={fields.year} onChange={(v) => onChange({ ...fields, year: v })} placeholder="2024" />
      </div>
    </div>
  );
}

/* ─────────────────────── MAIN COMPONENT ─────────────────────── */

export function CitationGeneratorTool() {
  const [style, setStyle] = useState<CitationStyle>('apa7');
  const [sourceType, setSourceType] = useState<SourceType>('book');
  const [fields, setFields] = useState<SourceFields>(defaultBookFields());
  const [bibliography, setBibliography] = useState<BibliographyEntry[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: HistoryEntry[] = JSON.parse(stored);
        setHistory(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save history
  const saveToHistory = useCallback(
    (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
      setHistory((prev) => {
        const next: HistoryEntry[] = [
          { ...entry, id: uid(), timestamp: Date.now() },
          ...prev,
        ].slice(0, 5);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    []
  );

  // Change source type => reset fields
  const handleSourceTypeChange = useCallback((st: SourceType) => {
    setSourceType(st);
    setFields(getDefaultFields(st));
  }, []);

  // Generate citation
  const citation: CitationResult | null = useMemo(() => {
    try {
      switch (sourceType) {
        case 'book': {
          const f = fields as BookFields;
          if (!f.title && validAuthors(f.authors).length === 0) return null;
          return generateBookCitation(f, style);
        }
        case 'journal': {
          const f = fields as JournalFields;
          if (!f.articleTitle && validAuthors(f.authors).length === 0) return null;
          return generateJournalCitation(f, style);
        }
        case 'website': {
          const f = fields as WebsiteFields;
          if (!f.pageTitle && !f.websiteName) return null;
          return generateWebsiteCitation(f, style);
        }
        case 'conference': {
          const f = fields as ConferenceFields;
          if (!f.paperTitle && validAuthors(f.authors).length === 0) return null;
          return generateConferenceCitation(f, style);
        }
        case 'thesis': {
          const f = fields as ThesisFields;
          if (!f.title && !f.author.lastName) return null;
          return generateThesisCitation(f, style);
        }
        case 'newspaper': {
          const f = fields as NewspaperFields;
          if (!f.articleTitle && validAuthors(f.authors).length === 0) return null;
          return generateNewspaperCitation(f, style);
        }
        case 'video': {
          const f = fields as VideoFields;
          if (!f.title && !f.creator.lastName) return null;
          return generateVideoCitation(f, style);
        }
        case 'report': {
          const f = fields as ReportFields;
          if (!f.title && !f.organization) return null;
          return generateReportCitation(f, style);
        }
        default:
          return null;
      }
    } catch {
      return null;
    }
  }, [fields, style, sourceType]);

  const addToBibliography = useCallback(() => {
    if (!citation) return;
    const entry: BibliographyEntry = {
      id: uid(),
      style,
      sourceType,
      reference: citation.reference,
      referenceHtml: citation.referenceHtml,
      inText: citation.inText,
    };
    setBibliography((prev) => [...prev, entry]);
    saveToHistory({ style, sourceType, reference: citation.reference });
  }, [citation, style, sourceType, saveToHistory]);

  const removeBibEntry = useCallback((id: string) => {
    setBibliography((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const moveBibEntry = useCallback((idx: number, direction: 'up' | 'down') => {
    setBibliography((prev) => {
      const next = [...prev];
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= next.length) return prev;
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  }, []);

  const sortBibliography = useCallback(() => {
    setBibliography((prev) =>
      [...prev].sort((a, b) => a.reference.localeCompare(b.reference))
    );
  }, []);

  const exportBibliography = useCallback(
    (format: 'copy' | 'txt') => {
      const text = bibliography.map((e) => e.reference).join('\n\n');
      if (format === 'copy') {
        navigator.clipboard.writeText(text);
      } else {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bibliography.txt';
        a.click();
        URL.revokeObjectURL(url);
      }
    },
    [bibliography]
  );

  const handleReset = useCallback(() => {
    setFields(getDefaultFields(sourceType));
  }, [sourceType]);

  const handleTryExample = useCallback(() => {
    setSourceType('book');
    setStyle('apa7');
    setFields(sampleBookFields());
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  // Render form for current source type
  const renderForm = () => {
    switch (sourceType) {
      case 'book':
        return <BookForm fields={fields as BookFields} onChange={setFields} />;
      case 'journal':
        return <JournalForm fields={fields as JournalFields} onChange={setFields} />;
      case 'website':
        return <WebsiteForm fields={fields as WebsiteFields} onChange={setFields} />;
      case 'conference':
        return <ConferenceForm fields={fields as ConferenceFields} onChange={setFields} />;
      case 'thesis':
        return <ThesisForm fields={fields as ThesisFields} onChange={setFields} />;
      case 'newspaper':
        return <NewspaperForm fields={fields as NewspaperFields} onChange={setFields} />;
      case 'video':
        return <VideoForm fields={fields as VideoFields} onChange={setFields} />;
      case 'report':
        return <ReportForm fields={fields as ReportFields} onChange={setFields} />;
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* ── Citation Style Selector ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Citation Style
        </h2>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              key={s.key}
              onClick={() => setStyle(s.key)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                style === s.key
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/40'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Source Type Selector ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Source Type
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SOURCE_TYPES.map((st) => {
            const Icon = st.icon;
            return (
              <button
                key={st.key}
                onClick={() => handleSourceTypeChange(st.key)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  sourceType === st.key
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/40'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{st.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── Input Form ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Source Details
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleTryExample}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
            >
              <Sparkles className="h-3.5 w-3.5" /> Try Example
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={sourceType}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {renderForm()}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* ── Citation Output ── */}
      <AnimatePresence>
        {citation && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* In-text citation */}
            {citation.inText && (
              <div className="rounded-2xl border border-green-200 bg-green-50/60 p-5 dark:border-green-800 dark:bg-green-900/20">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-green-800 dark:text-green-300">
                    In-Text Citation
                  </h3>
                  <CopyButton text={citation.inText} />
                </div>
                <p className="font-mono text-sm text-green-900 dark:text-green-200">
                  {citation.inText}
                </p>
              </div>
            )}

            {/* Reference list entry */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                  Reference List Entry
                </h3>
                <CopyButton text={citation.reference} />
              </div>
              <div
                className="text-sm leading-relaxed text-blue-900 dark:text-blue-200"
                style={{ paddingLeft: '2rem', textIndent: '-2rem' }}
                dangerouslySetInnerHTML={{ __html: citation.referenceHtml }}
              />
            </div>

            {/* Add to bibliography */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={addToBibliography}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 dark:shadow-blue-900/40"
              >
                <Plus className="h-4 w-4" /> Add to Bibliography
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bibliography Builder ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <ListOrdered className="h-4 w-4" /> Bibliography
            {bibliography.length > 0 && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                {bibliography.length}
              </span>
            )}
          </h2>
          {bibliography.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={sortBibliography}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <ListOrdered className="h-3.5 w-3.5" /> Sort A-Z
              </button>
              <button
                onClick={() => exportBibliography('copy')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Copy className="h-3.5 w-3.5" /> Copy All
              </button>
              <button
                onClick={() => exportBibliography('txt')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Download className="h-3.5 w-3.5" /> Export TXT
              </button>
              <button
                onClick={() => setBibliography([])}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear
              </button>
            </div>
          )}
        </div>

        {bibliography.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400 dark:text-gray-600">
            No citations added yet. Generate a citation above and click &quot;Add to Bibliography&quot;.
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={bibliography}
            onReorder={setBibliography}
            className="space-y-2"
          >
            {bibliography.map((entry, idx) => (
              <Reorder.Item
                key={entry.id}
                value={entry}
                className="flex cursor-grab items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-3 active:cursor-grabbing dark:border-gray-800 dark:bg-gray-800/50"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div
                    className="text-sm leading-relaxed text-gray-800 dark:text-gray-200"
                    style={{ paddingLeft: '1.5rem', textIndent: '-1.5rem' }}
                    dangerouslySetInnerHTML={{ __html: entry.referenceHtml }}
                  />
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-medium uppercase text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                      {entry.style}
                    </span>
                    <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                      {SOURCE_TYPES.find((s) => s.key === entry.sourceType)?.label || entry.sourceType}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    onClick={() => moveBibEntry(idx, 'up')}
                    disabled={idx === 0}
                    className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-30 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    title="Move up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => moveBibEntry(idx, 'down')}
                    disabled={idx === bibliography.length - 1}
                    className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-30 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    title="Move down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <CopyButton text={entry.reference} label="" />
                  <button
                    onClick={() => removeBibEntry(entry.id)}
                    className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    title="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </motion.div>

      {/* ── History ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex w-full items-center justify-between text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
        >
          <span className="flex items-center gap-2">
            <History className="h-4 w-4" /> Recent Citations
            {history.length > 0 && (
              <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {history.length}
              </span>
            )}
          </span>
          <motion.span
            animate={{ rotate: showHistory ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-400"
          >
            <ArrowDown className="h-4 w-4" />
          </motion.span>
        </button>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              {history.length === 0 ? (
                <p className="pt-4 text-center text-sm text-gray-400 dark:text-gray-600">
                  No recent citations. Generated citations will appear here.
                </p>
              ) : (
                <div className="mt-3 space-y-2">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-3 dark:border-gray-800 dark:bg-gray-800/50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-gray-700 dark:text-gray-300">
                          {entry.reference}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-medium uppercase text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                            {entry.style}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(entry.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <CopyButton text={entry.reference} label="" />
                    </div>
                  ))}
                  <button
                    onClick={clearHistory}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs text-red-400 transition-colors hover:text-red-600"
                  >
                    <X className="h-3 w-3" /> Clear History
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Privacy Badge ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50/60 py-3 text-xs text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
      >
        <ShieldCheck className="h-4 w-4" />
        All processing happens in your browser. No data is sent to any server.
      </motion.div>
    </div>
  );
}
