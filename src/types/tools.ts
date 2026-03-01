export type ToolCategory =
  | 'image-tools'
  | 'pdf-tools'
  | 'text-tools'
  | 'calculators'
  | 'developer-tools'
  | 'converters'
  | 'utility-tools'
  | 'seo-tools';

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface Tool {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: ToolCategory;
  targetKeyword: string;
  secondaryKeywords: string[];
  metaTitle: string;
  metaDescription: string;
  faqs: ToolFAQ[];
  howToSteps: string[];
  relatedToolSlugs: string[];
  icon: string;
  isNew?: boolean;
  isPopular?: boolean;
  estimatedTime?: string;
}

export interface CategoryInfo {
  name: string;
  description: string;
  icon: string;
  color: string;
}
