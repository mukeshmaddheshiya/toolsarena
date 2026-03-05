# ToolsArena — Complete Project Guide

> **Read this file to fully understand the project structure, architecture, data flow, and how every part works together.**

---

## Overview

**ToolsArena** (`toolsarena.in`) is a production Next.js 16 web app offering **68 free online tools** across 9 categories. All tool processing happens client-side (browser JS) — no backend/API needed. The site supports **3 languages** (English, Hindi, Nepali) via `next-intl`, is fully responsive, dark-mode ready, and optimized for SEO.

**Tech Stack:** Next.js 16.1.6 · React 19 · TypeScript · Tailwind CSS 4 · next-intl · Vercel · Google Analytics · Formspree

---

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout — minimal passthrough (just renders children)
│   ├── globals.css                   # Tailwind imports, CSS variables, custom classes
│   ├── icon.tsx                      # Dynamic favicon generator (32×32 blue ⚡)
│   ├── apple-icon.tsx                # Apple touch icon generator
│   ├── opengraph-image.tsx           # Dynamic OG image generator
│   ├── robots.ts                     # robots.txt — allow all, link to sitemap
│   ├── sitemap.ts                    # Dynamic sitemap (236 URLs × 3 locales with alternates)
│   │
│   └── [locale]/                     # ← All pages live under this dynamic segment
│       ├── layout.tsx                # Main layout: HTML lang, fonts, Header, Footer, i18n provider, GA, JSON-LD
│       ├── page.tsx                  # Homepage: hero, stats, popular tools, category sections
│       ├── not-found.tsx             # 404 page
│       ├── about/page.tsx            # About page (server component, translated)
│       ├── contact/
│       │   ├── page.tsx              # Contact form (client component, Formspree)
│       │   └── layout.tsx            # Metadata for contact (since page is 'use client')
│       ├── privacy-policy/page.tsx   # Privacy policy (translated)
│       ├── terms/page.tsx            # Terms of service (translated)
│       │
│       ├── category/                 # 7 category pages (one file each)
│       │   ├── calculators/page.tsx
│       │   ├── converters/page.tsx
│       │   ├── cricket-tools/page.tsx
│       │   ├── developer-tools/page.tsx
│       │   ├── image-tools/page.tsx
│       │   ├── pdf-tools/page.tsx
│       │   └── text-tools/page.tsx
│       │
│       └── tools/                    # 68 tool folders
│           ├── layout.tsx            # Shared tools layout
│           ├── word-counter/
│           │   ├── page.tsx          # Route + metadata
│           │   └── WordCounterTool.tsx  # Tool UI (client component)
│           ├── pdf-merge/
│           │   ├── page.tsx
│           │   └── PDFMergeTool.tsx
│           └── ... (66 more tools)
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx                # Sticky nav: logo, category links, search, theme toggle, language switcher
│   │   ├── Footer.tsx                # Footer: category columns, social links, brand info
│   │   ├── Breadcrumbs.tsx           # Breadcrumb nav with BreadcrumbList schema
│   │   └── MobileNav.tsx             # Slide-out mobile menu drawer
│   │
│   ├── common/
│   │   ├── SearchBar.tsx             # Live search with dropdown (keyboard nav, debounced)
│   │   ├── CopyButton.tsx            # Copy-to-clipboard with feedback
│   │   ├── DownloadButton.tsx        # Trigger file download
│   │   ├── ThemeToggle.tsx           # Dark/light toggle (persists in localStorage)
│   │   └── LanguageSwitcher.tsx      # Globe icon dropdown: en/hi/ne with flags
│   │
│   ├── tools/
│   │   ├── ToolCard.tsx              # Tool grid card (category gradient, Popular/New badges)
│   │   ├── ToolPageWrapper.tsx       # Tool page layout: breadcrumbs, content + sidebar, FAQ, HowToUse
│   │   ├── FileDropzone.tsx          # Drag-and-drop file upload with validation
│   │   ├── HowToUse.tsx             # "How to Use" steps (server component, HowTo schema)
│   │   ├── ToolFAQ.tsx              # Expandable FAQ accordion (FAQPage schema)
│   │   └── RelatedTools.tsx          # Sidebar related tools list
│   │
│   ├── seo/
│   │   └── JsonLd.tsx                # JSON-LD structured data wrapper
│   │
│   └── ads/
│       ├── AdBanner.tsx              # Top banner ad slot
│       ├── AdInContent.tsx           # In-content ad slot
│       └── AdSidebar.tsx             # Sidebar ad slot
│
├── hooks/
│   ├── useClipboard.ts               # Copy text, auto-reset `copied` state after 2s
│   ├── useFileProcessor.ts           # File validation, progress tracking, batch processing
│   └── useToolAnalytics.ts           # GA event tracking: tool use, download, copy
│
├── lib/
│   ├── tools-registry.ts             # Master registry of all 68 tools (data + helper functions)
│   ├── constants.ts                  # Site name, URL, nav categories, file size limits
│   ├── seo.ts                        # Metadata generators: tool pages, static pages, defaults
│   └── utils.ts                      # cn(), formatFileSize(), slugify(), downloadBlob(), etc.
│
├── types/
│   └── tools.ts                      # Tool, ToolCategory, ToolFAQ, CategoryInfo interfaces
│
├── i18n/
│   ├── config.ts                     # locales=['en','hi','ne'], names, flags
│   ├── routing.ts                    # defineRouting with localePrefix: 'as-needed'
│   ├── navigation.ts                 # Locale-aware Link, useRouter, usePathname, redirect
│   └── request.ts                    # Server message loader (imports messages/{locale}.json)
│
├── messages/
│   ├── en.json                       # English translations
│   ├── hi.json                       # Hindi translations
│   └── ne.json                       # Nepali translations
│
└── middleware.ts                     # next-intl middleware: locale detection + routing
```

---

## Core Concepts & Data Flow

### 1. Tool Registry — The Single Source of Truth

**File:** `src/lib/tools-registry.ts`

Every tool is defined as a `Tool` object in the `tools[]` array. This is the **only place** tool data lives.

```typescript
// Tool interface (src/types/tools.ts)
interface Tool {
  slug: string;                 // URL path: /tools/{slug}
  name: string;                 // Display name (English, used everywhere)
  shortDescription: string;     // One-liner for cards
  longDescription: string;      // SEO content for tool page
  category: ToolCategory;       // 'text-tools' | 'pdf-tools' | ... (9 types)
  targetKeyword: string;        // Primary SEO keyword
  secondaryKeywords: string[];  // Additional SEO keywords
  metaTitle: string;            // <title> tag (≤60 chars)
  metaDescription: string;      // <meta description> (155-160 chars)
  faqs: ToolFAQ[];              // FAQ section (question + answer pairs)
  howToSteps: string[];         // "How to Use" numbered steps
  relatedToolSlugs: string[];   // Links to related tools
  icon: string;                 // Lucide icon name (e.g., 'AlignLeft')
  isPopular?: boolean;          // Show "Popular" badge
  isNew?: boolean;              // Show "New" badge
  estimatedTime?: string;       // e.g., "Instant", "1-2 minutes"
}
```

**Helper functions exported:**
- `getToolBySlug(slug)` → single Tool or undefined
- `getToolsByCategory(category)` → Tool[]
- `getPopularTools(limit?)` → Tool[]
- `getNewTools(limit?)` → Tool[]
- `searchTools(query)` → Tool[] (searches name, description, keywords)
- `getRelatedTools(slug, limit?)` → Tool[]

**9 Categories:** `image-tools`, `pdf-tools`, `text-tools`, `calculators`, `developer-tools`, `converters`, `utility-tools`, `seo-tools`, `cricket-tools`

Each category has: `name`, `description`, `icon`, `color` (gradient classes).

### 2. How a Tool Page Works

Every tool follows the **exact same pattern**:

**Step 1 — Route file** (`src/app/[locale]/tools/{slug}/page.tsx`):
```typescript
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { WordCounterTool } from './WordCounterTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('word-counter')!);
}

export default function WordCounterPage() {
  return <ToolPageWrapper slug="word-counter"><WordCounterTool /></ToolPageWrapper>;
}
```

**Step 2 — ToolPageWrapper** renders the layout:
- Breadcrumbs (Home > Category > Tool Name)
- Tool title + description from registry
- Ad banner slot (top)
- Two-column layout: tool content (left) + sidebar (right)
- Sidebar contains: AdSidebar + RelatedTools
- Below content: HowToUse steps + ToolFAQ accordion
- JSON-LD schemas: WebApplication, HowTo, FAQPage

**Step 3 — Tool component** (`WordCounterTool.tsx`):
- `'use client'` directive
- All logic runs in browser (useState, useMemo, event handlers)
- Uses hooks like `useClipboard`, `useFileProcessor`, `useToolAnalytics`
- For file tools: uses `FileDropzone` for drag-drop upload
- Processes data with client-side libraries (pdf-lib, browser-image-compression, etc.)

### 3. i18n (Internationalization) Flow

**URL Strategy:** `localePrefix: 'as-needed'`
- English (default): `/tools/word-counter` (no prefix)
- Hindi: `/hi/tools/word-counter`
- Nepali: `/ne/tools/word-counter`

**How it works:**

1. **Request arrives** → `src/middleware.ts` (next-intl middleware) detects locale from URL/headers
2. **Locale layout** (`src/app/[locale]/layout.tsx`) receives locale param, sets `<html lang={locale}>`
3. **Server components** use `getTranslations('namespace')` from `next-intl/server`
4. **Client components** use `useTranslations('namespace')` from `next-intl`
5. **Navigation** uses `Link` from `src/i18n/navigation.ts` (auto-prefixes locale)
6. **Language switching** done by `LanguageSwitcher` using `useRouter().replace()`

**Translation files** (`src/messages/{locale}.json`) have these namespaces:
- `common` — site-wide strings (search, badges, navigation labels)
- `nav` — category names in navigation
- `hero` — homepage hero section
- `stats` — homepage stats cards
- `home` — homepage sections
- `footer` — footer text
- `toolPage` — tool page headings ("How to Use", "FAQ", "Related Tools")
- `notFound` — 404 page
- `about`, `contact`, `terms`, `privacy` — static pages

**What stays in English (intentionally):**
- Tool names, meta titles, meta descriptions (SEO keywords people search for)
- Tool slugs/URLs
- Technical labels inside tool UIs

### 4. SEO Architecture

**File:** `src/lib/seo.ts`

**Three metadata generators:**

1. `getDefaultMetadata()` — Root layout defaults (metadataBase, title template, OG, Twitter, robots, icons)
2. `generateToolMetadata(tool)` — Per-tool metadata (async, detects locale via `getLocale()`)
3. `generatePageMetadata(opts)` — For static pages (about, privacy, terms)

**Key SEO features:**

| Feature | Implementation |
|---------|---------------|
| **Canonical URLs** | Self-referencing per locale (`/tools/x` for en, `/hi/tools/x` for hi) |
| **hreflang** | `alternates.languages` on every page: `{en: url, hi: url, ne: url, 'x-default': en_url}` |
| **og:locale** | `en_US`, `hi_IN`, or `ne_NP` based on current locale |
| **alternateLocale** | `['hi_IN', 'ne_NP']` in default metadata |
| **Sitemap** | 236 URLs with `xhtml:link` alternates for all 3 locales |
| **robots.txt** | Allow all, points to sitemap |
| **JSON-LD** | Organization, WebSite (global), BreadcrumbList, FAQPage, HowTo, WebApplication (per tool) |
| **Meta titles** | ≤60 chars, keyword-first |
| **Meta descriptions** | 155-160 chars with CTA |

**`getAlternateLanguages(path)`** generates:
```typescript
{ en: 'https://toolsarena.in/tools/x', hi: 'https://toolsarena.in/hi/tools/x', ne: 'https://toolsarena.in/ne/tools/x', 'x-default': 'https://toolsarena.in/tools/x' }
```

### 5. Routing

| Route Pattern | Pages | Purpose |
|---------------|-------|---------|
| `/` | 1 × 3 locales | Homepage |
| `/about` | 1 × 3 | About page |
| `/contact` | 1 × 3 | Contact form (Formspree) |
| `/privacy-policy` | 1 × 3 | Privacy policy |
| `/terms` | 1 × 3 | Terms of service |
| `/category/{slug}` | 7 × 3 | Category listing pages |
| `/tools/{slug}` | 68 × 3 | Individual tool pages |

**Total: ~252 pages** (84 unique × 3 locales)

All routes use `generateStaticParams()` for SSG. The `[locale]` param is generated for `['en', 'hi', 'ne']`.

### 6. Styling System

- **Tailwind CSS 4** with custom theme in `tailwind.config.ts`
- **Dark mode:** `class` strategy, toggled via `ThemeToggle` (saves to localStorage)
- **Colors:** Primary (blue scale), Accent (orange scale)
- **Fonts:** Inter (body), Plus Jakarta Sans (headings), JetBrains Mono (code)
- **Category gradients:** Each category has a unique gradient (e.g., `from-blue-500 to-cyan-500`)
- **Responsive:** Mobile-first, breakpoints: sm (640), md (768), lg (1024), xl (1280)

### 7. External Integrations

| Service | Purpose | Config |
|---------|---------|--------|
| **Google Analytics** | Page views, events | ID: `G-31BJJP8M9X`, loaded via `next/script afterInteractive` |
| **Google AdSense** | Monetization | Publisher ID in constants, 3 slot types |
| **Formspree** | Contact form emails | Form ID: `mdalvwao`, sends to hello@toolsarena.in |

### 8. Client-Side Libraries (for tool processing)

| Library | Used By |
|---------|---------|
| `pdf-lib` | All PDF tools (merge, split, compress, rotate, watermark, etc.) |
| `browser-image-compression` | Image compressor |
| `jszip` | Batch downloads (multiple files → ZIP) |
| `qrcode` | QR code generator |
| `framer-motion` | Animations (hero, cards, transitions) |
| `lucide-react` | All icons throughout the app |
| `@radix-ui/*` | Accessible UI primitives (dropdowns, accordions, etc.) |

---

## Constants Reference

**File:** `src/lib/constants.ts`

```
SITE_NAME        = 'ToolsArena'
SITE_URL         = 'https://toolsarena.in'
SITE_DESCRIPTION = '80+ free online tools...'
SITE_TWITTER     = '@ToolsArena'
DEFAULT_OG_IMAGE = '/opengraph-image'
MAX_FILE_SIZE_MB = 50
MAX_IMAGE_SIZE_MB = 20
MAX_BATCH_FILES  = 20
```

**NAV_CATEGORIES** — Array of `{ slug, nameKey, href }` for header navigation (uses translation keys like `nav.imageTools`).

**CATEGORY_NAME_KEYS** — Maps category slugs to translation keys.

---

## How to Add a New Tool

1. **Create the tool folder:** `src/app/[locale]/tools/{new-slug}/`
2. **Create the tool component:** `{NewSlug}Tool.tsx` with `'use client'`
3. **Create the page:** `page.tsx` following the standard pattern (import tool from registry, wrap with ToolPageWrapper)
4. **Register in `tools-registry.ts`:** Add a new `Tool` object to the `tools[]` array with all fields
5. **Build & test:** `npm run build` — the sitemap, search, and category pages auto-include it

---

## How to Add a New Language

1. **Update `src/i18n/config.ts`:** Add locale code to `locales`, add entries to `localeNames` and `localeFlags`
2. **Create `src/messages/{locale}.json`:** Copy `en.json` structure and translate all values
3. **Update `src/lib/seo.ts`:** Add OG locale mapping in `getOgLocale()`, add to `alternateLocale` in `getDefaultMetadata()`
4. **Build & test:** `npm run build` — routing, sitemap, hreflang all auto-update from config

---

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server at http://localhost:3000
npm run build        # Production build
npm start            # Start production server
npm run lint         # ESLint check
npm run deploy       # Deploy to Vercel production
```

---

## Key Patterns & Conventions

- **All navigation links** use `Link` from `@/i18n/navigation` (not `next/link`) for automatic locale prefixing
- **All client-side routers** use `useRouter` from `@/i18n/navigation` (not `next/navigation`)
- **Server components** call `setRequestLocale(locale)` for static rendering support
- **Client components** needing metadata put it in a sibling `layout.tsx` (see contact page)
- **Path alias:** `@/*` maps to `./src/*` in all imports
- **Tool names stay English** even in translated pages (SEO keyword strategy)
- **`cn()` utility** from `src/lib/utils.ts` for merging Tailwind classes (clsx + tailwind-merge)
- **File processing** always client-side — files never leave the user's device
- **Structured data** (JSON-LD) is added both globally (Organization, WebSite) and per-tool (WebApplication, HowTo, FAQPage)
