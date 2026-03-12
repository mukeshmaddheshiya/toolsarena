# ToolsArena — Master Developer Guide

> **For new interns and junior developers**: Read this top-to-bottom before touching any code. Everything you need to understand, modify, and extend this project is here.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack at a Glance](#2-tech-stack-at-a-glance)
3. [Getting Started Locally](#3-getting-started-locally)
4. [Complete Directory Structure](#4-complete-directory-structure)
5. [How Next.js App Router Works (Quick Primer)](#5-how-nextjs-app-router-works-quick-primer)
6. [Configuration Files Explained](#6-configuration-files-explained)
7. [Internationalization (i18n) — Multi-language Support](#7-internationalization-i18n--multi-language-support)
8. [Core Library Files](#8-core-library-files)
9. [TypeScript Types](#9-typescript-types)
10. [Layout Architecture — How Every Page Is Built](#10-layout-architecture--how-every-page-is-built)
11. [Pages Explained](#11-pages-explained)
12. [Tool Pages — Deep Dive](#12-tool-pages--deep-dive)
13. [Components Directory](#13-components-directory)
14. [Styling System (Tailwind CSS 4)](#14-styling-system-tailwind-css-4)
15. [SEO System](#15-seo-system)
16. [Translations System](#16-translations-system)
17. [How to Add a New Tool (Step-by-Step)](#17-how-to-add-a-new-tool-step-by-step)
18. [How to Add a New Category](#18-how-to-add-a-new-category)
19. [How to Add a New Language](#19-how-to-add-a-new-language)
20. [Common Patterns & Code Recipes](#20-common-patterns--code-recipes)
21. [Performance & Optimization Notes](#21-performance--optimization-notes)
22. [Deployment (Vercel)](#22-deployment-vercel)
23. [Common Mistakes to Avoid](#23-common-mistakes-to-avoid)
24. [Visual Map: Page → Code](#24-visual-map-page--code)

---

## 1. Project Overview

**ToolsArena** (live at [toolsarena.in](https://toolsarena.in)) is a free, privacy-first online tools platform. It provides **150+ browser-based tools** — things like a word counter, QR code generator, image compressor, PDF merger, EMI calculator, and many more.

### Core Principles

| Principle | What it means in practice |
|-----------|---------------------------|
| **Privacy-first** | All processing happens in the user's browser. Files/text never reach a server. |
| **No signup** | Every tool is usable immediately — no login, no account |
| **Fast** | Server-side rendering, lazy loading, Next.js optimizations |
| **SEO-rich** | Every tool has its own metadata, FAQ schema, HowTo schema, hreflang |
| **Multi-language** | English (default), Hindi, Nepali via `next-intl` |

---

## 2. Tech Stack at a Glance

| Layer | Technology | Version | Why |
|-------|-----------|---------|-----|
| Framework | **Next.js** (App Router) | 16.x | Server rendering, routing, metadata API |
| UI Library | **React** | 19.x | Component model |
| Language | **TypeScript** | 5.x | Type safety |
| Styling | **Tailwind CSS** | 4.x | Utility-first, dark mode, custom design tokens |
| i18n | **next-intl** | 4.x | Multi-language routing + translations |
| Icons | **lucide-react** | 0.575 | Clean SVG icon library |
| UI Primitives | **Radix UI** | various | Accessible dropdowns, dialogs, accordions |
| Animations | **framer-motion** | 12.x | Page transitions, UI animations |
| PDF Processing | **pdf-lib** | 1.17 | Client-side PDF operations |
| OCR | **tesseract.js** | 7.x | Browser-based text recognition |
| QR Code | **qrcode** | 1.5 | QR generation |
| Image Compression | **browser-image-compression** | — | Client-side image optimization |
| Document Export | **docx** | 9.x | Generate .docx files in browser |
| Linting | **ESLint** | — | Code quality |
| Deployment | **Vercel** | — | CI/CD + hosting |

---

## 3. Getting Started Locally

### Prerequisites
- Node.js 18+ installed
- XAMPP (or any local HTTP server) — only needed if you work with PHP/MySQL separately
- Git

### Installation

```bash
# 1. Clone/navigate to project
cd c:/xampp/htdocs/tool-app

# 2. Install all dependencies
npm install

# 3. Start development server
npm run dev
```

Now open **http://localhost:3000** in your browser. You should see the ToolsArena homepage.

### Other Commands

```bash
npm run build    # Build production version (checks for errors)
npm start        # Run the built production server
npm run lint     # Check code for errors/style issues
```

> **Tip for beginners:** Always run `npm run build` before deploying. It catches TypeScript errors that the dev server might miss.

---

## 4. Complete Directory Structure

```
tool-app/
│
├── public/                          # Static assets (images, fonts, data files)
│   ├── data/                        # JSON data files used by tools
│   ├── images/                      # Tool-specific images
│   │   └── whatsapp/                # WhatsApp tool images
│   └── og-images/                   # Open Graph preview images
│
├── src/                             # ALL source code lives here
│   │
│   ├── app/                         # Next.js App Router pages
│   │   ├── layout.tsx               # Root layout (minimal passthrough)
│   │   └── [locale]/                # i18n — all pages live inside this folder
│   │       ├── layout.tsx           # Real layout (Header + Footer + fonts)
│   │       ├── page.tsx             # Homepage /
│   │       ├── not-found.tsx        # Custom 404 page
│   │       ├── about/
│   │       │   └── page.tsx         # /about page
│   │       ├── contact/
│   │       │   ├── layout.tsx       # Contact-specific layout (SEO)
│   │       │   └── page.tsx         # /contact page
│   │       ├── privacy-policy/
│   │       │   └── page.tsx         # /privacy-policy page
│   │       ├── terms/
│   │       │   └── page.tsx         # /terms page
│   │       ├── category/            # Category listing pages
│   │       │   ├── calculators/
│   │       │   │   └── page.tsx     # /category/calculators
│   │       │   ├── converters/
│   │       │   │   └── page.tsx
│   │       │   ├── cricket-tools/
│   │       │   │   └── page.tsx
│   │       │   ├── developer-tools/
│   │       │   │   └── page.tsx
│   │       │   ├── image-tools/
│   │       │   │   └── page.tsx
│   │       │   ├── pdf-tools/
│   │       │   │   └── page.tsx
│   │       │   ├── seo-tools/
│   │       │   │   └── page.tsx
│   │       │   ├── text-tools/
│   │       │   │   └── page.tsx
│   │       │   └── utility-tools/
│   │       │       └── page.tsx
│   │       └── tools/               # Individual tool pages
│   │           ├── layout.tsx       # Tools sub-layout
│   │           ├── [slug]/          # Dynamic catch-all route
│   │           │   └── page.tsx     # Handles any unknown /tools/xxx
│   │           ├── word-counter/    # Example static tool route
│   │           │   ├── page.tsx     # Server component (metadata + wrapper)
│   │           │   └── WordCounterTool.tsx  # Client component (logic)
│   │           ├── age-calculator/
│   │           │   ├── page.tsx
│   │           │   └── AgeCalculatorTool.tsx
│   │           └── [150+ more tool folders...]
│   │
│   ├── components/                  # Reusable React components
│   │   ├── ads/                     # Google AdSense components
│   │   │   ├── AdBanner.tsx         # Horizontal banner ad
│   │   │   ├── AdInContent.tsx      # In-content ad slot
│   │   │   └── AdSidebar.tsx        # Sidebar sticky ad
│   │   ├── common/                  # Small utility components
│   │   │   ├── CopyButton.tsx       # Click-to-copy button
│   │   │   ├── DownloadButton.tsx   # File download button
│   │   │   ├── LanguageSwitcher.tsx # EN / HI / NE dropdown
│   │   │   ├── LazySearchBar.tsx    # Lazily loads SearchBar
│   │   │   ├── NavigationProgress.tsx  # Top loading bar on nav
│   │   │   ├── SearchBar.tsx        # Full tool search with autocomplete
│   │   │   └── ThemeToggle.tsx      # Dark/Light mode switch
│   │   ├── layout/                  # Page-level layout components
│   │   │   ├── Header.tsx           # Sticky top nav bar
│   │   │   ├── Footer.tsx           # Bottom footer
│   │   │   ├── MobileNav.tsx        # Mobile slide-out drawer
│   │   │   └── Breadcrumbs.tsx      # Breadcrumb trail on tool pages
│   │   ├── seo/
│   │   │   └── JsonLd.tsx           # Renders JSON-LD structured data
│   │   ├── tools/                   # Tool-page specific components
│   │   │   ├── CategoryPageContent.tsx  # Category listing UI + filters
│   │   │   ├── FileDropzone.tsx     # Drag-and-drop file upload
│   │   │   ├── HowToUse.tsx         # Numbered steps section
│   │   │   ├── RelatedTools.tsx     # "Related Tools" grid
│   │   │   ├── ToolCard.tsx         # Tool card used in grids
│   │   │   ├── ToolFAQ.tsx          # Accordion FAQ section
│   │   │   └── ToolPageWrapper.tsx  # Orchestrates full tool page layout
│   │   └── ui/                      # Radix UI wrappers (Button, Dialog, etc.)
│   │
│   ├── hooks/                       # Custom React hooks
│   │
│   ├── i18n/                        # Internationalization config
│   │   ├── config.ts                # Locales list + names + flags
│   │   ├── routing.ts               # URL prefix strategy
│   │   ├── navigation.ts            # i18n-aware Link, useRouter, etc.
│   │   └── request.ts               # Loads the right messages file per request
│   │
│   ├── lib/                         # Core application logic
│   │   ├── constants.ts             # SITE_NAME, NAV_CATEGORIES, limits
│   │   ├── seo.ts                   # Metadata generation functions
│   │   ├── tools-registry.ts        # Database of all 150+ tools
│   │   └── utils.ts                 # Helper functions (cn, formatFileSize, etc.)
│   │
│   ├── messages/                    # Translation files
│   │   ├── en.json                  # English (default)
│   │   ├── hi.json                  # Hindi
│   │   └── ne.json                  # Nepali
│   │
│   ├── types/
│   │   └── tools.ts                 # TypeScript interfaces (Tool, ToolCategory, etc.)
│   │
│   ├── middleware.ts                 # next-intl locale routing middleware
│   └── globals.css                  # Global CSS (Tailwind base + custom classes)
│
├── package.json                     # Dependencies + scripts
├── next.config.ts                   # Next.js configuration
├── tailwind.config.ts               # Tailwind design tokens
├── tsconfig.json                    # TypeScript compiler config
├── postcss.config.mjs               # PostCSS (required by Tailwind 4)
└── eslint.config.mjs                # ESLint rules
```

---

## 5. How Next.js App Router Works (Quick Primer)

> **If you know Next.js App Router already, skip to Section 6.**

In Next.js App Router (the `app/` directory):

### Files That Matter

| File | What it does |
|------|-------------|
| `page.tsx` | Defines a URL route. `app/about/page.tsx` → `/about` |
| `layout.tsx` | Wraps child pages. Stays mounted between navigations |
| `loading.tsx` | Shows while the page is loading |
| `not-found.tsx` | Custom 404 page |
| `[param]/page.tsx` | Dynamic route — `[slug]` matches anything |

### Server vs Client Components

```
Server Component (default)          Client Component ('use client')
─────────────────────────────       ────────────────────────────────
Runs on the server                  Runs in the browser
Can be async (await data)           Can use useState, useEffect
Cannot use useState/useEffect       Cannot be async
Good for: metadata, layouts,        Good for: interactive tools,
  static content                      forms, user interactions
```

**In this project:**
- `page.tsx` files = Server Components (for metadata + SEO)
- `*Tool.tsx` files = Client Components (for interactive tool logic)
- Layout files = Server Components

### The `[locale]` Folder

All pages live inside `src/app/[locale]/`. This is how next-intl handles multiple languages. The `[locale]` segment is automatically filled with `en`, `hi`, or `ne` depending on the user's language.

When a user visits `/` they get `locale = 'en'`. When they visit `/hi/word-counter` they get `locale = 'hi'`.

---

## 6. Configuration Files Explained

### `next.config.ts`

```typescript
// src: next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  reactStrictMode: true,            // Helps catch bugs during development

  images: {
    formats: ['image/avif', 'image/webp'],  // Modern image formats
  },

  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },     // Prevent clickjacking
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        // ... more security headers
      ]
    }]
  }
};

export default withNextIntl(nextConfig);
```

**Key point:** `withNextIntl()` wraps the config — this is required for `next-intl` to work.

---

### `tailwind.config.ts`

```typescript
// Key custom values:
theme: {
  extend: {
    colors: {
      primary: { 50: '...', ..., 950: '...' },   // Blue palette
      accent:  { 50: '...', ..., 900: '...' },   // Orange palette
    },
    fontFamily: {
      sans:    ['Inter', ...],                    // Body text
      heading: ['Plus Jakarta Sans', ...],        // Headings
      mono:    ['JetBrains Mono', ...],           // Code blocks
    },
    animation: {
      'fade-in':  'fadeIn 0.2s ease-in-out',
      'slide-up': 'slideUp 0.3s ease-out',
    }
  }
}
darkMode: 'class'    // Dark mode toggled by adding 'dark' class to <html>
```

---

### `tsconfig.json`

The important part is the path alias:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]    // @/lib/utils = src/lib/utils
    }
  }
}
```

This means you can write `import { cn } from '@/lib/utils'` anywhere in the project instead of `../../../lib/utils`.

---

### `src/middleware.ts`

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all paths EXCEPT:
    // - /api routes
    // - /_next (internal Next.js)
    // - /icon files (.ico, .svg, .png)
    // - static files
    '/((?!api|_next|_vercel|.*\\.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.webp|.*\\.gif|.*\\.css|.*\\.js|.*\\.json|.*\\.txt|.*\\.xml|.*\\.mp4|.*\\.mp3|.*\\.pdf|.*\\.zip|.*\\.wasm|favicon).*)',
  ],
};
```

**What this does:** On every request, the middleware runs. It detects the locale from the URL and sets it so next-intl can load the correct translation file. If no locale is in the URL, it defaults to English.

---

## 7. Internationalization (i18n) — Multi-language Support

This project supports 3 languages. Here is how the whole system fits together:

### File Overview

```
src/i18n/
├── config.ts        → Defines which locales exist (en, hi, ne) + their names/flags
├── routing.ts       → Defines URL strategy (en at root, others prefixed)
├── navigation.ts    → Exports i18n-aware navigation hooks (use these everywhere!)
└── request.ts       → Tells next-intl where to find translation files
```

### `src/i18n/config.ts`

```typescript
export const locales = ['en', 'hi', 'ne'] as const;
export type Locale = (typeof locales)[number];  // 'en' | 'hi' | 'ne'

export const defaultLocale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  hi: 'हिन्दी',
  ne: 'नेपाली',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  hi: '🇮🇳',
  ne: '🇳🇵',
};
```

### `src/i18n/routing.ts`

```typescript
import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',   // English: /word-counter (no prefix)
                               // Hindi:   /hi/word-counter
                               // Nepali:  /ne/word-counter
});
```

### `src/i18n/navigation.ts`

```typescript
// This exports special i18n-aware versions of Next.js navigation:
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

**IMPORTANT:** Always import `Link`, `useRouter`, `usePathname` from `@/i18n/navigation`, never from `next/link` or `next/navigation`. The i18n versions automatically prefix links with the current locale.

```typescript
// WRONG — don't do this
import Link from 'next/link';
<Link href="/word-counter">Word Counter</Link>
// This would break Hindi users — they'd get /word-counter instead of /hi/word-counter

// CORRECT — always do this
import { Link } from '@/i18n/navigation';
<Link href="/word-counter">Word Counter</Link>
// Automatically becomes /hi/word-counter for Hindi users
```

### How to Use Translations

**In Server Components (page.tsx, layout.tsx):**
```typescript
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('hero');  // Load 'hero' namespace
  return <h1>{t('title')}</h1>;             // Uses hero.title from messages/en.json
}
```

**In Client Components (any file with 'use client'):**
```typescript
'use client';
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('common');     // Load 'common' namespace
  return <p>{t('siteName')}</p>;           // Uses common.siteName
}
```

---

## 8. Core Library Files

### `src/lib/constants.ts`

The central place for site-wide constants.

```typescript
export const SITE_NAME = 'ToolsArena';
export const SITE_URL  = 'https://toolsarena.in';
export const SITE_DESCRIPTION = '{count}+ free online tools...';
export const SITE_TWITTER = '@ToolsArena';

// Navigation categories shown in the Header
export const NAV_CATEGORIES = [
  { slug: 'image-tools',     nameKey: 'nav.imageTools' },
  { slug: 'pdf-tools',       nameKey: 'nav.pdfTools' },
  { slug: 'text-tools',      nameKey: 'nav.textTools' },
  { slug: 'calculators',     nameKey: 'nav.calculators' },
  { slug: 'developer-tools', nameKey: 'nav.devTools' },
  { slug: 'converters',      nameKey: 'nav.converters' },
];

// Maps category slug to its translation key
export const CATEGORY_NAME_KEYS: Record<string, string> = {
  'image-tools':     'nav.imageTools',
  'pdf-tools':       'nav.pdfTools',
  // ...
};

// File size limits
export const MAX_FILE_SIZE_MB   = 50;
export const MAX_IMAGE_SIZE_MB  = 20;
export const MAX_BATCH_FILES    = 20;
```

**When to edit this file:** When you add a new category to the nav, update file limits, or change the site name/URL.

---

### `src/lib/utils.ts`

General-purpose helper functions used everywhere.

```typescript
// Merge Tailwind classes safely (handles conflicts)
cn('p-4 text-red-500', condition && 'text-blue-500')
// Returns: 'p-4 text-blue-500' (blue wins because it's last)

// Format bytes to human-readable
formatFileSize(1048576)  // → "1 MB"
formatFileSize(2500)     // → "2.44 KB"

// Convert text to URL slug
slugify('Hello World!')  // → "hello-world"

// Truncate long text
truncate('Very long text here...', 20)  // → "Very long text her..."

// Copy text to clipboard (returns Promise<boolean>)
await copyToClipboard('text to copy')

// Download a Blob as a file
downloadBlob(blob, 'output.pdf')

// Download a string as a text file
downloadText('Hello world', 'output.txt')

// Read file contents
const text     = await readFileAsText(file)
const dataUrl  = await readFileAsDataURL(file)
const buffer   = await readFileAsArrayBuffer(file)

// Validate file types
isValidImageFile(file)   // returns true/false
isValidPDFFile(file)     // returns true/false

// Format number with commas
numberWithCommas(1234567)  // → "1,234,567"

// Debounce a function (delay execution until user stops typing)
const debouncedSearch = debounce(handleSearch, 300)
```

---

### `src/lib/tools-registry.ts`

The **most important file** in the project. It's the database of all 150+ tools. It's ~6,600 lines long.

#### Structure

```typescript
// 1. Category definitions
export const categories: Record<ToolCategory, CategoryInfo> = {
  'text-tools': {
    name: 'Text Tools',
    description: 'Process, format, and analyze text',
    icon: 'Type',           // Lucide icon name
    color: 'from-blue-500 to-cyan-500',  // Tailwind gradient
  },
  // ... 8 more categories
};

// 2. Tools array (150+ entries)
export const tools: Tool[] = [
  {
    slug: 'word-counter',
    name: 'Word Counter',
    shortDescription: 'Count words, characters, sentences, and paragraphs instantly.',
    longDescription: `<p>Full HTML description for the tool page...</p>`,  // Long SEO content
    category: 'text-tools',
    targetKeyword: 'word counter',
    secondaryKeywords: ['word count', 'character counter', 'text analyzer', ...],
    metaTitle: 'Word Counter — Count Words & Characters Online Free',
    metaDescription: 'Count words, characters, sentences, paragraphs, and more...',
    faqs: [
      { question: 'How do I count words?', answer: 'Paste your text...' },
      // ...
    ],
    howToSteps: [
      'Open the Word Counter tool',
      'Paste or type your text in the input box',
      // ...
    ],
    relatedToolSlugs: ['character-counter', 'text-case-converter', ...],
    icon: 'FileText',       // Lucide icon name
    isPopular: true,        // Shows on homepage
    isNew: false,
    estimatedTime: 'Instant',
  },
  // ... 149+ more tools
];

// 3. Helper functions
export function getToolBySlug(slug: string): Tool | undefined;
export function getRelatedTools(slug: string): Tool[];
export function getPopularTools(count: number): Tool[];
export const TOOL_COUNT: number;  // Total number of tools
```

**When to edit this file:** When adding a new tool, updating SEO content, adding FAQs, or fixing tool descriptions.

---

### `src/lib/seo.ts`

Generates metadata for every page.

```typescript
// For a tool page:
export function generateToolMetadata(tool: Tool): Metadata {
  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    keywords: [tool.targetKeyword, ...tool.secondaryKeywords],
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      url: `https://toolsarena.in/tools/${tool.slug}`,
      images: [{ url: `/tools/${tool.slug}/opengraph-image` }],
    },
    twitter: { card: 'summary_large_image', ... },
    alternates: {
      canonical: `https://toolsarena.in/tools/${tool.slug}`,
      languages: getAlternateLanguages(`/tools/${tool.slug}`),
    },
  };
}

// For category and static pages:
export function generatePageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata;

// Generates hreflang alternates for all locales:
export function getAlternateLanguages(path: string): Record<string, string>;
// → { 'en': 'https://toolsarena.in/path', 'hi': 'https://toolsarena.in/hi/path', ... }
```

---

## 9. TypeScript Types

### `src/types/tools.ts`

```typescript
// All 9 category slugs
export type ToolCategory =
  | 'image-tools'
  | 'pdf-tools'
  | 'text-tools'
  | 'calculators'
  | 'developer-tools'
  | 'converters'
  | 'utility-tools'
  | 'seo-tools'
  | 'cricket-tools';

// Category metadata
export interface CategoryInfo {
  name: string;
  description: string;
  icon: string;            // Lucide icon name string
  color: string;           // Tailwind gradient e.g. 'from-blue-500 to-cyan-500'
}

// FAQ entry
export interface ToolFAQ {
  question: string;
  answer: string;
}

// Full tool definition
export interface Tool {
  slug: string;            // URL-safe identifier, e.g. 'word-counter'
  name: string;            // Display name, e.g. 'Word Counter'
  shortDescription: string; // 1-line description for cards/grids
  longDescription: string; // Full HTML for the tool page's About section
  category: ToolCategory;
  targetKeyword: string;   // Primary SEO keyword
  secondaryKeywords: string[];  // 10-15 related keywords
  metaTitle: string;       // Page <title> (keep under 70 chars)
  metaDescription: string; // Meta description (keep under 160 chars)
  faqs: ToolFAQ[];         // 5-10 Q&A pairs
  howToSteps: string[];    // Step-by-step instructions
  relatedToolSlugs: string[]; // Array of related tool slugs
  icon: string;            // Lucide icon name
  isNew?: boolean;         // Shows "New" badge
  isPopular?: boolean;     // Shows on homepage Popular section
  estimatedTime?: string;  // e.g. 'Instant', '< 1 min', '2-3 min'
}
```

---

## 10. Layout Architecture — How Every Page Is Built

Understanding the layout hierarchy is essential. Every page goes through these layers:

```
Request for /tools/word-counter
         │
         ▼
src/app/layout.tsx          ← Root layout (minimal — just sets <html> lang)
         │
         ▼
src/app/[locale]/layout.tsx ← MAIN layout — loads fonts, Header, Footer, theme
         │                     (also loads Google Analytics, JSON-LD for org/website)
         ▼
src/app/[locale]/tools/layout.tsx  ← Tools sub-layout (if any extra wrapping needed)
         │
         ▼
src/app/[locale]/tools/word-counter/page.tsx  ← Page (generates metadata, renders ToolPageWrapper)
         │
         ▼
src/components/tools/ToolPageWrapper.tsx  ← Breadcrumb + tool header + 2-column layout
         │
         ├── Left column: Tool component (WordCounterTool.tsx)
         │                 + HowToUse section
         │                 + longDescription (About)
         │                 + FAQ section
         │                 + RelatedTools grid
         └── Right column: Sidebar with related tools + ad
```

### `src/app/layout.tsx` (Root Layout)

```typescript
// This is intentionally minimal — just passes through
export default function RootLayout({ children }) {
  return children;
}
```

Why? Because next-intl needs locale-specific `<html lang="">` attributes set in the locale layout.

### `src/app/[locale]/layout.tsx` (Main Layout)

This is the real layout. It does the heavy lifting:

```typescript
export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  // Validate locale — 404 if invalid
  if (!locales.includes(locale)) notFound();

  // Load translations for this locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Dark mode script — runs before paint to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: darkModeScript }} />
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-31BJJP8M9X" strategy="afterInteractive" />
      </head>
      <body className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <JsonLd data={organizationSchema} />
          <JsonLd data={websiteSchema} />
          <NavigationProgress />
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**When to edit this file:**
- Adding site-wide scripts (analytics, chat widgets)
- Changing fonts
- Adding global JSON-LD schemas
- Modifying dark mode behavior

---

## 11. Pages Explained

### Homepage — `src/app/[locale]/page.tsx`

**URL:** `/` (English) or `/hi/` (Hindi)

**What it renders:**
1. **Hero section** — Big heading + search bar + "X+ Free Tools — No Signup" badge
2. **Stats grid** — 4 cards: Tools count, 100% Private, No Signup, Free Forever
3. **Popular Tools** — 6 most-popular tools (tools with `isPopular: true` in registry)
4. **Category sections** — Groups of tools by category (text, calculators, developer, image, pdf, converters)

**Key code pattern:**
```typescript
// Server component — can be async, can await data
export default async function HomePage({ params }) {
  const { locale } = await params;
  const t = await getTranslations('hero');
  const popularTools = getPopularTools(6);

  return (
    <>
      <HeroSection t={t} />
      <PopularTools tools={popularTools} />
      {/* ... */}
    </>
  );
}

// Metadata for SEO
export async function generateMetadata({ params }): Promise<Metadata> {
  return getDefaultMetadata();
}
```

---

### Category Pages — `src/app/[locale]/category/[category-name]/page.tsx`

**URL:** `/category/text-tools`, `/category/calculators`, etc.

**What it renders:**
- Category header (name + description + icon)
- Grid of all tools in that category
- Filter/sort options

Each category has its own `page.tsx` file (not a dynamic route). This is intentional for better SEO — each category page has its own static metadata.

**Example — `src/app/[locale]/category/text-tools/page.tsx`:**
```typescript
import { CategoryPageContent } from '@/components/tools/CategoryPageContent';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Free Text Tools Online',
    description: 'Word counter, case converter, lorem ipsum...',
    path: '/category/text-tools',
  });
}

export default function TextToolsPage() {
  return <CategoryPageContent category="text-tools" />;
}
```

---

### Tool Pages — `src/app/[locale]/tools/word-counter/page.tsx`

See the dedicated section below (Section 12).

---

### Static Pages

| Page | File | URL |
|------|------|-----|
| About | `src/app/[locale]/about/page.tsx` | `/about` |
| Contact | `src/app/[locale]/contact/page.tsx` | `/contact` |
| Privacy Policy | `src/app/[locale]/privacy-policy/page.tsx` | `/privacy-policy` |
| Terms | `src/app/[locale]/terms/page.tsx` | `/terms` |
| 404 | `src/app/[locale]/not-found.tsx` | any 404 |

---

## 12. Tool Pages — Deep Dive

Every single tool follows the same pattern. Understanding this pattern lets you work with any tool.

### The Two Files Per Tool

```
src/app/[locale]/tools/word-counter/
├── page.tsx              ← Server component: metadata + layout wrapper
└── WordCounterTool.tsx   ← Client component: all the interactive logic
```

### File 1: `page.tsx` (Server Component)

This file is the same for every tool — only the slug changes:

```typescript
// src/app/[locale]/tools/word-counter/page.tsx
import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { WordCounterTool } from './WordCounterTool';

// Generates <title>, <meta description>, OG tags, hreflang, etc.
export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolBySlug('word-counter');
  return generateToolMetadata(tool!);  // ! means "I know this won't be undefined"
}

// Renders the actual page
export default function WordCounterPage() {
  return (
    <ToolPageWrapper slug="word-counter">
      <WordCounterTool />
    </ToolPageWrapper>
  );
}
```

### File 2: `WordCounterTool.tsx` (Client Component)

This file contains all the interactive logic. It always starts with `'use client'`:

```typescript
// src/app/[locale]/tools/word-counter/WordCounterTool.tsx
'use client';

import { useState, useMemo } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { CopyButton } from '@/components/common/CopyButton';
import { cn } from '@/lib/utils';

export function WordCounterTool() {
  const [text, setText] = useState('');

  // useMemo means this only re-calculates when `text` changes
  const stats = useMemo(() => ({
    words:      text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
    characters: text.length,
    sentences:  text.split(/[.!?]+/).filter(Boolean).length,
    paragraphs: text.split(/\n{2,}/).filter(Boolean).length,
  }), [text]);

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="tool-textarea"    // Custom class in globals.css
        placeholder="Paste or type your text here..."
        rows={10}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
        <StatCard label="Words"     value={stats.words} />
        <StatCard label="Characters" value={stats.characters} />
        <StatCard label="Sentences" value={stats.sentences} />
        <StatCard label="Paragraphs" value={stats.paragraphs} />
      </div>

      <CopyButton text={text} />
    </div>
  );
}
```

### `ToolPageWrapper` — What It Adds Around Your Tool

When you wrap your tool in `<ToolPageWrapper slug="word-counter">`, you automatically get:

```
┌─────────────────────────────────────────────────────┐
│ Breadcrumb: Home > Text Tools > Word Counter        │
│ Tool name + description + icon                      │
│ ─────────────────────────────────────────────────── │
│  ┌───────────────────────┐  ┌──────────────────┐   │
│  │                       │  │  Related Tools   │   │
│  │   YOUR TOOL HERE      │  │  ─────────────── │   │
│  │   (children prop)     │  │  □ Char Counter  │   │
│  │                       │  │  □ Case Converter│   │
│  │                       │  │  □ Lorem Ipsum   │   │
│  │                       │  │  ─────────────── │   │
│  │                       │  │  [Ad Sidebar]    │   │
│  └───────────────────────┘  └──────────────────┘   │
│                                                      │
│  How to Use Word Counter                             │
│  1. Open the tool...                                 │
│  2. Paste your text...                               │
│                                                      │
│  About Word Counter                                  │
│  <long HTML description from tools-registry>        │
│                                                      │
│  Frequently Asked Questions                          │
│  ▼ How do I count words?                            │
│  ▼ What is a character?                             │
│                                                      │
│  Related Tools Grid                                  │
│  [card] [card] [card] [card]                         │
└─────────────────────────────────────────────────────┘
```

All this comes for free — you just need to write your tool component and register it in the tools registry.

---

## 13. Components Directory

### Layout Components

#### `src/components/layout/Header.tsx`

**What it shows on screen:**
- Left: ToolsArena logo + bolt icon
- Middle: Navigation links (Image Tools, PDF Tools, etc.)
- Right: Search icon, Language switcher, Theme toggle, mobile menu

**Key implementation details:**
```typescript
'use client';
// Uses Intersection Observer to detect when user scrolls
// Sticky with shadow on scroll
// Categories from NAV_CATEGORIES in constants.ts
// Uses LazySearchBar for the search — loaded lazily to keep initial bundle small
```

**To modify:** Add a new nav item by editing `NAV_CATEGORIES` in `src/lib/constants.ts`.

---

#### `src/components/layout/Footer.tsx`

**What it shows on screen:**
- Left: Brand logo + tagline + social links
- Middle: Category columns with tool links
- Bottom: Copyright + policy links

**Key implementation details:**
- Social links: LinkedIn, Instagram, Portfolio, Email
- Automatically shows top tools per category from `tools-registry.ts`

---

#### `src/components/layout/Breadcrumbs.tsx`

Shows the navigation trail on tool pages: `Home > Text Tools > Word Counter`

Also outputs `BreadcrumbList` structured data for Google.

---

### Common Components

#### `src/components/common/CopyButton.tsx`

```typescript
// Usage:
<CopyButton text="text to copy" />
<CopyButton text={outputText} size="sm" label="Copy Result" />

// Props:
interface CopyButtonProps {
  text: string;         // What to copy
  size?: 'sm' | 'md';  // Button size (default: 'md')
  label?: string;       // Button label (default: 'Copy')
}

// Behavior:
// - Click → copies to clipboard
// - Button shows "Copied!" for 2 seconds
// - Falls back to document.execCommand for older browsers
```

---

#### `src/components/common/DownloadButton.tsx`

```typescript
// Usage:
<DownloadButton blob={outputBlob} filename="output.pdf" label="Download PDF" />
```

---

#### `src/components/common/ThemeToggle.tsx`

```typescript
// Click to toggle dark/light mode
// Saves preference to localStorage
// On first load, checks: 1) localStorage, 2) system preference
// Adds/removes 'dark' class on <html> element
```

---

#### `src/components/common/LanguageSwitcher.tsx`

```typescript
// Shows globe icon + current language name
// Click to open dropdown with all locales
// Click locale → navigates to same page in that language
// Uses useRouter from '@/i18n/navigation'
```

---

#### `src/components/common/SearchBar.tsx`

```typescript
// Full-featured search with:
// - Text input with debounce
// - Filters tools as you type (searches name + description + category)
// - Shows results in dropdown
// - Keyboard navigation (arrow keys, Enter, Escape)
// - Clicking a result navigates to the tool
```

---

### Tool Components

#### `src/components/tools/ToolPageWrapper.tsx`

Server component. Takes `slug` and `children` as props. Builds the full tool page layout (see Section 12 for visual diagram).

```typescript
// Usage in page.tsx:
<ToolPageWrapper slug="word-counter">
  <WordCounterTool />   {/* This becomes the 'children' prop */}
</ToolPageWrapper>
```

---

#### `src/components/tools/ToolCard.tsx`

Used in category pages, home page, and related tools grid.

```typescript
// Renders a clickable card with:
// - Category-colored icon
// - Tool name
// - Short description
// - "New" or "Popular" badge
// - Hover animation

// Props:
interface ToolCardProps {
  tool: Tool;
  size?: 'sm' | 'md' | 'lg';
}
```

---

#### `src/components/tools/FileDropzone.tsx`

```typescript
// Drag-and-drop file upload area
// Props:
interface FileDropzoneProps {
  onFilesAccepted: (files: File[]) => void;
  accept: string;          // e.g. 'image/*' or '.pdf'
  maxFiles?: number;
  maxSizeMB?: number;
}
```

---

#### `src/components/tools/HowToUse.tsx`

```typescript
// Server component — renders numbered steps
// Input: howToSteps array from tools-registry
// Also renders HowTo JSON-LD schema for Google

// Renders:
// 1. Open the Word Counter tool
// 2. Paste your text
// 3. ...
```

---

#### `src/components/tools/ToolFAQ.tsx`

```typescript
// Client component — accordion FAQ section
// Input: faqs array from tools-registry
// Renders Radix UI Accordion
// Also renders FAQPage JSON-LD schema

// Renders:
// ▼ How do I count words?
//   Paste or type your text and the count updates instantly.
// ▼ Does it support multiple languages?
//   Yes, the counter works with any Unicode text.
```

---

#### `src/components/tools/RelatedTools.tsx`

```typescript
// Server component
// Shows 4-8 related tool cards in a grid
// Input: relatedToolSlugs from tools-registry
```

---

#### `src/components/tools/CategoryPageContent.tsx`

```typescript
// Client component — renders the category listing page
// Has filter bar (All, Popular, New)
// Has sort options (A-Z, Newest, Popular)
// Renders tool grid

// Props:
interface Props {
  category: ToolCategory;
}
```

---

### SEO Components

#### `src/components/seo/JsonLd.tsx`

```typescript
// Renders a JSON-LD <script> tag
// Used throughout the app for structured data

// Usage:
<JsonLd data={{
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Word Counter',
  // ...
}} />
```

---

### Ad Components

Three ad components wrap Google AdSense:

```typescript
<AdBanner />       // Full-width horizontal banner
<AdSidebar />      // Sticky sidebar rectangle
<AdInContent />    // Between sections
```

These are already placed in `ToolPageWrapper.tsx`. You don't need to add them to individual tools.

---

## 14. Styling System (Tailwind CSS 4)

### The `cn()` Helper

Always use `cn()` from `@/lib/utils` to combine classes:

```typescript
import { cn } from '@/lib/utils';

// Conditional classes:
<div className={cn(
  'base-class p-4 rounded',
  isActive && 'bg-blue-500 text-white',
  isError  && 'bg-red-500 text-white',
  className  // allow external class override
)} />
```

---

### Color System

```
Primary (Blue):     bg-primary-500, text-primary-600, border-primary-300...
Accent (Orange):    bg-accent-500, text-accent-600...
Neutral (Slate):    bg-slate-50, text-slate-700, border-slate-200...
Dark mode prefix:   dark:bg-slate-900, dark:text-slate-100...
```

---

### Typography

```css
/* Body text — use default font classes */
text-sm, text-base, text-lg, text-xl

/* Headings — use font-heading class */
<h1 className="font-heading text-3xl font-bold">...</h1>

/* Code blocks */
<code className="font-mono">...</code>
```

---

### Common Layout Patterns

```typescript
// Responsive grid of cards
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">

// Centered container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Card with dark mode support
<div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">

// Primary button
<button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">

// Responsive hidden/shown
<div className="hidden lg:block">  {/* Only visible on desktop */}
<div className="block lg:hidden">  {/* Only visible on mobile/tablet */}
```

---

### The `.tool-textarea` Class

Defined in `src/globals.css`. Use it for all tool text areas to ensure consistent styling:

```typescript
<textarea className="tool-textarea" rows={10} placeholder="..." />
```

---

### Dark Mode

Dark mode is class-based. The `dark` class is added to `<html>` by `ThemeToggle.tsx`. Use the `dark:` prefix:

```typescript
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
```

---

## 15. SEO System

Every page in ToolsArena has full SEO coverage. Here's how it works:

### Tool Page SEO (Automatic)

When you add a tool to `tools-registry.ts` with proper `metaTitle`, `metaDescription`, `targetKeyword`, `secondaryKeywords`, `faqs`, and `howToSteps`, the following is generated automatically:

1. **Meta tags** — title, description, keywords
2. **Open Graph tags** — for social media previews
3. **Twitter card tags** — for Twitter previews
4. **hreflang alternates** — for multi-language SEO
5. **Canonical URL** — prevents duplicate content
6. **FAQPage schema** — FAQ rich results in Google
7. **HowTo schema** — How-to rich results in Google
8. **WebApplication schema** — App listing in Google
9. **BreadcrumbList schema** — Breadcrumb rich results

### How `generateMetadata` Works

```typescript
// In your page.tsx:
export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolBySlug('word-counter');
  return generateToolMetadata(tool!);
}

// This calls src/lib/seo.ts which builds the full Metadata object
// Next.js then renders all the <meta> tags in <head> automatically
```

### OG Images

Each tool's Open Graph image is served from `/tools/{slug}/opengraph-image`. If you need a custom OG image, add it at `public/og-images/{slug}.png`.

---

## 16. Translations System

### Translation File Structure

`src/messages/en.json` uses nested namespaces:

```json
{
  "common": {
    "siteName": "ToolsArena",
    "searchPlaceholder": "Search {count}+ tools..."
  },
  "nav": {
    "imageTools": "Image Tools",
    "pdfTools": "PDF Tools"
  },
  "hero": {
    "title": "Free Online Tools",
    "titleAccent": "for Everyone"
  },
  "stats": {
    "tools": "{count}+ Tools"
  },
  "footer": {
    "tagline": "Free online tools for everyone.",
    "builtBy": "Built by"
  },
  "toolPage": {
    "relatedTools": "Related Tools",
    "howToUse": "How to Use {toolName}",
    "step": "Step {number}"
  }
}
```

`{count}`, `{toolName}`, `{number}` are interpolation variables — pass them as:
```typescript
t('stats.tools', { count: TOOL_COUNT })
t('toolPage.howToUse', { toolName: tool.name })
```

### Adding New Translations

1. Add the key to `src/messages/en.json`
2. Add the translated version to `src/messages/hi.json` and `src/messages/ne.json`
3. Use `t('namespace.key')` in your component

---

## 17. How to Add a New Tool (Step-by-Step)

Let's add a fictional tool called **"Sentence Counter"** as an example.

### Step 1: Register the tool in `tools-registry.ts`

Open `src/lib/tools-registry.ts` and find the `tools` array. Add a new entry:

```typescript
{
  slug: 'sentence-counter',           // Must be unique, URL-safe, kebab-case
  name: 'Sentence Counter',
  shortDescription: 'Count sentences in your text instantly.',
  longDescription: `
    <p>The <strong>Sentence Counter</strong> is a free online tool that counts
    the number of sentences in any text...</p>
    <h2>Why Count Sentences?</h2>
    <p>Sentence counting helps writers...</p>
  `,                                  // Write 200-500 words of SEO content here
  category: 'text-tools',            // Must match a ToolCategory value
  targetKeyword: 'sentence counter',
  secondaryKeywords: [
    'count sentences online',
    'sentence counter free',
    'how many sentences',
    'sentence count tool',
  ],
  metaTitle: 'Sentence Counter — Count Sentences Online Free',  // Under 70 chars
  metaDescription: 'Free online sentence counter. Paste your text and instantly count sentences, paragraphs, and more.',  // Under 160 chars
  faqs: [
    {
      question: 'How does the sentence counter work?',
      answer: 'It splits your text by sentence-ending punctuation (. ! ?) and counts the results.',
    },
    {
      question: 'Does it work with multiple languages?',
      answer: 'Yes, it works with any language that uses standard punctuation.',
    },
  ],
  howToSteps: [
    'Open the Sentence Counter tool',
    'Paste or type your text into the input box',
    'The sentence count updates instantly as you type',
    'Copy or note down your results',
  ],
  relatedToolSlugs: ['word-counter', 'character-counter', 'reading-time-calculator'],
  icon: 'AlignLeft',                 // Any Lucide icon name from lucide.dev/icons
  isNew: true,
  isPopular: false,
  estimatedTime: 'Instant',
},
```

### Step 2: Create the tool directory

Create this folder structure:
```
src/app/[locale]/tools/sentence-counter/
├── page.tsx
└── SentenceCounterTool.tsx
```

### Step 3: Create `page.tsx`

```typescript
// src/app/[locale]/tools/sentence-counter/page.tsx
import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { SentenceCounterTool } from './SentenceCounterTool';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolBySlug('sentence-counter');
  return generateToolMetadata(tool!);
}

export default function SentenceCounterPage() {
  return (
    <ToolPageWrapper slug="sentence-counter">
      <SentenceCounterTool />
    </ToolPageWrapper>
  );
}
```

### Step 4: Create `SentenceCounterTool.tsx`

```typescript
// src/app/[locale]/tools/sentence-counter/SentenceCounterTool.tsx
'use client';

import { useState, useMemo } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { cn } from '@/lib/utils';

export function SentenceCounterTool() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    if (!text.trim()) return { sentences: 0, words: 0, characters: 0 };
    return {
      sentences:  text.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
      words:      text.trim().split(/\s+/).length,
      characters: text.length,
    };
  }, [text]);

  return (
    <div className="space-y-4">
      {/* Input area */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Enter your text
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="tool-textarea"
          rows={10}
          placeholder="Paste or type your text here..."
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Sentences',  value: stats.sentences },
          { label: 'Words',      value: stats.words },
          { label: 'Characters', value: stats.characters },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-center border border-slate-200 dark:border-slate-700"
          >
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {value.toLocaleString()}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <CopyButton text={text} />
        <button
          onClick={() => setText('')}
          className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
```

### Step 5: Verify

1. Run `npm run dev`
2. Navigate to `http://localhost:3000/tools/sentence-counter`
3. You should see the full tool page with the tool, FAQ, How To Use, and Related Tools sections

That's it! The tool is now fully registered with SEO, schema markup, related tools, and all the standard layout.

---

## 18. How to Add a New Category

If you need a completely new category (e.g., "Finance Tools"):

### Step 1: Add to `ToolCategory` type

In `src/types/tools.ts`:
```typescript
export type ToolCategory =
  | 'image-tools'
  | 'pdf-tools'
  // ... existing ones
  | 'finance-tools';    // ADD THIS
```

### Step 2: Add to `categories` in `tools-registry.ts`

```typescript
export const categories: Record<ToolCategory, CategoryInfo> = {
  // ... existing categories
  'finance-tools': {
    name: 'Finance Tools',
    description: 'Calculators and tools for financial planning',
    icon: 'DollarSign',                        // Lucide icon
    color: 'from-green-500 to-emerald-500',    // Tailwind gradient
  },
};
```

### Step 3: Create the category page

Create `src/app/[locale]/category/finance-tools/page.tsx`:
```typescript
import { CategoryPageContent } from '@/components/tools/CategoryPageContent';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Free Finance Tools Online',
    description: 'Free online finance calculators and tools...',
    path: '/category/finance-tools',
  });
}

export default function FinanceToolsPage() {
  return <CategoryPageContent category="finance-tools" />;
}
```

### Step 4: Add to navigation (optional)

In `src/lib/constants.ts`:
```typescript
export const NAV_CATEGORIES = [
  // ... existing
  { slug: 'finance-tools', nameKey: 'nav.financeTools' },
];
```

Add the translation key in `src/messages/en.json`:
```json
{
  "nav": {
    "financeTools": "Finance Tools"
  }
}
```

And in `hi.json`, `ne.json` with translated values.

---

## 19. How to Add a New Language

To add a new language (e.g., Tamil):

### Step 1: Update `src/i18n/config.ts`

```typescript
export const locales = ['en', 'hi', 'ne', 'ta'] as const;  // Add 'ta'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  hi: 'हिन्दी',
  ne: 'नेपाली',
  ta: 'தமிழ்',           // ADD
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  hi: '🇮🇳',
  ne: '🇳🇵',
  ta: '🇮🇳',              // ADD (Tamil is also Indian)
};
```

### Step 2: Create translation file

Copy `src/messages/en.json` to `src/messages/ta.json` and translate all values.

### Step 3: Update SEO locale mapping

In `src/lib/seo.ts`, find the locale-to-OG-locale map and add:
```typescript
const localeMap: Record<Locale, string> = {
  en: 'en_US',
  hi: 'hi_IN',
  ne: 'ne_NP',
  ta: 'ta_IN',   // ADD
};
```

### Step 4: Test

Run `npm run dev` and visit `http://localhost:3000/ta/` to see Tamil.

---

## 20. Common Patterns & Code Recipes

### Pattern 1: File Upload Tool

```typescript
'use client';
import { useState, useCallback } from 'react';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { isValidImageFile } from '@/lib/utils';

export function ImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = useCallback((files: File[]) => {
    if (files[0] && isValidImageFile(files[0])) {
      setFile(files[0]);
    }
  }, []);

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      // ... your processing logic
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <FileDropzone onFilesAccepted={handleFiles} accept="image/*" />
      {file && (
        <button onClick={handleProcess} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Process Image'}
        </button>
      )}
    </div>
  );
}
```

### Pattern 2: Input → Output Tool

```typescript
'use client';
import { useState } from 'react';
import { CopyButton } from '@/components/common/CopyButton';

export function TransformTool() {
  const [input, setInput] = useState('');
  const output = input.toUpperCase();  // Replace with your transform

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium mb-2">Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="tool-textarea"
          rows={12}
          placeholder="Enter text..."
        />
      </div>

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Output</label>
          <CopyButton text={output} size="sm" />
        </div>
        <textarea
          value={output}
          readOnly
          className="tool-textarea bg-slate-50 dark:bg-slate-900"
          rows={12}
        />
      </div>
    </div>
  );
}
```

### Pattern 3: Form with Calculate Button

```typescript
'use client';
import { useState } from 'react';

interface Result {
  value: number;
  label: string;
}

export function CalculatorTool() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  const handleCalculate = () => {
    const num = parseFloat(input);
    if (isNaN(num)) return;
    setResult({ value: num * 2, label: 'Double' });
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Enter number</label>
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800"
          placeholder="0"
        />
      </div>

      <button
        onClick={handleCalculate}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Calculate
      </button>

      {result && (
        <div className="bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-xl p-6 text-center animate-fade-in">
          <div className="text-4xl font-bold text-primary-700 dark:text-primary-300">
            {result.value}
          </div>
          <div className="text-primary-600 dark:text-primary-400 mt-1">{result.label}</div>
        </div>
      )}
    </div>
  );
}
```

### Pattern 4: Using Icons

```typescript
import { FileText, Download, Copy, ArrowRight, Check } from 'lucide-react';

// Usage:
<FileText className="w-5 h-5 text-primary-600" />
<Download className="w-4 h-4 mr-2" />
```

Browse all available icons at: [lucide.dev/icons](https://lucide.dev/icons)

### Pattern 5: Conditional Dark Mode Styling

```typescript
// Always provide both light and dark variants:
<div className="
  bg-white dark:bg-slate-800
  text-slate-900 dark:text-slate-100
  border-slate-200 dark:border-slate-700
">
```

---

## 21. Performance & Optimization Notes

### Why Tools Are Fast

1. **Client-side processing** — No server round-trips for tool operations
2. **Static generation** — Tool pages are pre-rendered at build time
3. **Code splitting** — Each page only loads what it needs
4. **Lazy loading** — Heavy components load only when needed

### Things to Keep in Mind

**Do use `useMemo` for expensive calculations:**
```typescript
// GOOD — only recalculates when text changes
const stats = useMemo(() => computeStats(text), [text]);

// BAD — recalculates on every render
const stats = computeStats(text);
```

**Do lazy-import heavy libraries:**
```typescript
// GOOD — pdf-lib only loads when user clicks process
const handleProcess = async () => {
  const { PDFDocument } = await import('pdf-lib');
  // ...
};

// BAD — loads pdf-lib on initial page load for all users
import { PDFDocument } from 'pdf-lib';
```

**SearchBar is already lazily loaded in Header:**
```typescript
// In Header.tsx — this is why search loads fast
const SearchBar = dynamic(() => import('./SearchBar'), { ssr: false });
```

---

## 22. Deployment (Vercel)

The project deploys to [Vercel](https://vercel.com) automatically when you push to the `main` branch.

### Manual Deploy

```bash
# Deploy to production
npm run build  # Check for errors first
vercel --prod
```

### Environment Variables

No environment variables are required for the base app. If you add a third-party API, add env vars in:
- Vercel Dashboard → Settings → Environment Variables
- Local: create `.env.local` (never commit this file)

### Build Checks

The CI build will fail if:
- TypeScript errors exist
- `next/lint` errors exist
- A `getToolBySlug()` call returns undefined and you use `!` incorrectly

Always run `npm run build` locally before pushing.

---

## 23. Common Mistakes to Avoid

### 1. Using `next/link` instead of i18n `Link`

```typescript
// WRONG — breaks language switching
import Link from 'next/link';
<Link href="/tools/word-counter">Word Counter</Link>

// CORRECT
import { Link } from '@/i18n/navigation';
<Link href="/tools/word-counter">Word Counter</Link>
```

### 2. Forgetting `'use client'` on interactive components

```typescript
// WRONG — useState doesn't work in server components
// File: WordCounterTool.tsx
import { useState } from 'react';  // ← This will throw an error

// CORRECT — add 'use client' at the very top
'use client';
import { useState } from 'react';
```

### 3. Not using `cn()` for conditional classes

```typescript
// WRONG — Tailwind conflicts won't be resolved
<div className={`p-4 ${isActive ? 'text-blue-500' : 'text-red-500'}`} />

// CORRECT
import { cn } from '@/lib/utils';
<div className={cn('p-4', isActive ? 'text-blue-500' : 'text-red-500')} />
```

### 4. Forgetting to add tool to `tools-registry.ts`

If you create the page files but forget the registry entry, the tool will:
- Have no metadata (bad for SEO)
- Not show up in search
- Not show related tools
- Throw an error in `ToolPageWrapper`

### 5. Using `any` type

```typescript
// WRONG
const tool: any = getToolBySlug('word-counter');

// CORRECT
const tool = getToolBySlug('word-counter');  // TypeScript infers: Tool | undefined
if (!tool) return notFound();
```

### 6. Forgetting dark mode variants

```typescript
// WRONG — looks broken in dark mode
<div className="bg-white text-black">

// CORRECT
<div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
```

### 7. metaTitle over 70 characters

```typescript
// WRONG — gets truncated in search results
metaTitle: 'Free Online Word Counter Tool — Count Words, Characters, Sentences, Paragraphs and Reading Time'

// CORRECT — 60-70 chars max
metaTitle: 'Word Counter — Count Words & Characters Free Online'
```

---

## 24. Visual Map: Page → Code

Use this to find the code for any page you see in the browser.

| What you see in browser | URL | Main code file |
|------------------------|-----|----------------|
| Homepage | `/` | [src/app/[locale]/page.tsx](src/app/[locale]/page.tsx) |
| Homepage hero | `/` | [src/app/[locale]/page.tsx](src/app/[locale]/page.tsx) — HeroSection component |
| Header navigation | All pages | [src/components/layout/Header.tsx](src/components/layout/Header.tsx) |
| Footer | All pages | [src/components/layout/Footer.tsx](src/components/layout/Footer.tsx) |
| Language switcher | Header | [src/components/common/LanguageSwitcher.tsx](src/components/common/LanguageSwitcher.tsx) |
| Dark/light toggle | Header | [src/components/common/ThemeToggle.tsx](src/components/common/ThemeToggle.tsx) |
| Search bar | Header | [src/components/common/SearchBar.tsx](src/components/common/SearchBar.tsx) |
| Category page (Text Tools) | `/category/text-tools` | [src/app/[locale]/category/text-tools/page.tsx](src/app/[locale]/category/text-tools/page.tsx) |
| Category page (Calculators) | `/category/calculators` | [src/app/[locale]/category/calculators/page.tsx](src/app/[locale]/category/calculators/page.tsx) |
| Any tool page layout (breadcrumb, FAQ, related) | `/tools/[any]` | [src/components/tools/ToolPageWrapper.tsx](src/components/tools/ToolPageWrapper.tsx) |
| Word Counter tool UI | `/tools/word-counter` | [src/app/[locale]/tools/word-counter/WordCounterTool.tsx](src/app/[locale]/tools/word-counter/WordCounterTool.tsx) |
| Word Counter SEO/metadata | `/tools/word-counter` | [src/app/[locale]/tools/word-counter/page.tsx](src/app/[locale]/tools/word-counter/page.tsx) |
| Tool card (in grids) | Category/Home pages | [src/components/tools/ToolCard.tsx](src/components/tools/ToolCard.tsx) |
| FAQ accordion | Every tool page | [src/components/tools/ToolFAQ.tsx](src/components/tools/ToolFAQ.tsx) |
| "How to Use" section | Every tool page | [src/components/tools/HowToUse.tsx](src/components/tools/HowToUse.tsx) |
| Related tools grid | Every tool page | [src/components/tools/RelatedTools.tsx](src/components/tools/RelatedTools.tsx) |
| Breadcrumb trail | Tool pages | [src/components/layout/Breadcrumbs.tsx](src/components/layout/Breadcrumbs.tsx) |
| About page | `/about` | [src/app/[locale]/about/page.tsx](src/app/[locale]/about/page.tsx) |
| Contact page | `/contact` | [src/app/[locale]/contact/page.tsx](src/app/[locale]/contact/page.tsx) |
| 404 page | Any missing URL | [src/app/[locale]/not-found.tsx](src/app/[locale]/not-found.tsx) |
| All tool definitions | — | [src/lib/tools-registry.ts](src/lib/tools-registry.ts) |
| Site constants | — | [src/lib/constants.ts](src/lib/constants.ts) |
| SEO metadata generation | — | [src/lib/seo.ts](src/lib/seo.ts) |
| Utility functions | — | [src/lib/utils.ts](src/lib/utils.ts) |
| TypeScript types | — | [src/types/tools.ts](src/types/tools.ts) |
| English translations | — | [src/messages/en.json](src/messages/en.json) |
| Hindi translations | — | [src/messages/hi.json](src/messages/hi.json) |
| Nepali translations | — | [src/messages/ne.json](src/messages/ne.json) |
| i18n locale config | — | [src/i18n/config.ts](src/i18n/config.ts) |
| i18n navigation hooks | — | [src/i18n/navigation.ts](src/i18n/navigation.ts) |
| Middleware (locale routing) | — | [src/middleware.ts](src/middleware.ts) |
| Global styles | — | [src/globals.css](src/globals.css) |
| Next.js config | — | [next.config.ts](next.config.ts) |
| Tailwind config | — | [tailwind.config.ts](tailwind.config.ts) |

---

## Quick Reference Card

```
ADDING A TOOL:
  1. tools-registry.ts  → add tool object with all metadata
  2. src/app/[locale]/tools/[slug]/page.tsx  → copy template, change slug
  3. src/app/[locale]/tools/[slug]/[Name]Tool.tsx  → write interactive logic

FINDING A PAGE:
  Any URL → src/app/[locale]/...
  / → page.tsx
  /category/text-tools → category/text-tools/page.tsx
  /tools/word-counter → tools/word-counter/page.tsx

KEY RULES:
  • Always import Link from '@/i18n/navigation', not 'next/link'
  • Tool components must start with 'use client'
  • Use cn() for conditional Tailwind classes
  • Always add dark: variants for colors
  • metaTitle < 70 chars, metaDescription < 160 chars
  • Use @/* path alias (not ../../../)
```

---

*Guide last updated: March 2026 — covers Next.js 16, React 19, Tailwind 4, next-intl 4*
