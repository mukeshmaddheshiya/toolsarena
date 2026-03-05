import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_URL } from '@/lib/constants';
import { getTranslations } from 'next-intl/server';

interface HowToUseProps {
  steps: string[];
  toolName: string;
  toolSlug: string;
}

export async function HowToUse({ steps, toolName, toolSlug }: HowToUseProps) {
  const t = await getTranslations('toolPage');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t('howToUse', { toolName }),
    url: `${SITE_URL}/tools/${toolSlug}`,
    totalTime: 'PT2M',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
    tool: { '@type': 'HowToTool', name: toolName },
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: t('step', { number: i + 1 }),
      text: step,
    })),
  };

  return (
    <section className="mt-10">
      <JsonLd data={schema} />
      <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-slate-100 mb-4">
        {t('howToUse', { toolName })}
      </h2>
      <ol className="space-y-3">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4 items-start">
            <span className="w-7 h-7 rounded-full bg-primary-800 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-0.5">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
