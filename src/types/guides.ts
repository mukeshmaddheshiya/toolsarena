export interface GuideFAQ {
  question: string;
  answer: string;
}

export interface GuideSection {
  /** Anchor ID — used for Table of Contents scroll targets */
  id: string;
  /** H2 heading rendered above the section */
  title: string;
  /** Full HTML content for the section body */
  content: string;
}

export interface GuideHowToStep {
  title: string;
  description: string;
}

export interface GuideToolCTAData {
  heading: string;
  description: string;
  buttonText: string;
}

export interface Guide {
  /** URL slug: 'word-counter-guide' → /guides/word-counter-guide */
  slug: string;
  /** Links to the actual tool page at /tools/{toolSlug} */
  toolSlug: string;
  /** Tool category for badge colour */
  category: string;
  /** H1 page title */
  title: string;
  /** One-line subtitle below the H1 */
  subtitle: string;
  /** SEO <title> tag — keep under 70 chars */
  metaTitle: string;
  /** SEO meta description — keep under 160 chars */
  metaDescription: string;
  /** Primary keyword */
  targetKeyword: string;
  /** Supporting keyword cluster */
  secondaryKeywords: string[];
  /** ISO date string: '2025-03-12' */
  lastUpdated: string;
  /** Human-readable reading estimate: '8 min read' */
  readingTime: string;
  /** Display tags shown in the hero and card */
  tags: string[];
  /** Opening paragraph HTML rendered before all sections */
  intro: string;
  /** Ordered content sections — each becomes a TOC entry */
  sections: GuideSection[];
  /** Step-by-step how-to (schema + rendered list) */
  howToSteps: GuideHowToStep[];
  /** FAQ accordion + FAQPage schema */
  faqs: GuideFAQ[];
  /** Slugs of other guides to show in Related Guides */
  relatedGuides: string[];
  /** In-article and sidebar CTA copy */
  toolCTA: GuideToolCTAData;
}
