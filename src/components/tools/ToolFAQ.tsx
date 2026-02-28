'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { JsonLd } from '@/components/seo/JsonLd';

interface FAQ {
  question: string;
  answer: string;
}

interface ToolFAQProps {
  faqs: FAQ[];
  toolName: string;
}

export function ToolFAQ({ faqs, toolName }: ToolFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <section className="mt-10">
      <JsonLd data={schema} />
      <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-slate-100 mb-4">
        Frequently Asked Questions about {toolName}
      </h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              aria-expanded={openIndex === i}
            >
              <h3 className="font-medium text-slate-900 dark:text-slate-100 text-sm">{faq.question}</h3>
              <ChevronDown className={cn('w-4 h-4 shrink-0 text-slate-500 transition-transform duration-200', openIndex === i && 'rotate-180')} />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
