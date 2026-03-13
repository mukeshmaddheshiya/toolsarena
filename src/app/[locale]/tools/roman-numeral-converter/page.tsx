import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { RomanNumeralConverterTool } from './RomanNumeralConverterTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('roman-numeral-converter')!);
}

export default function RomanNumeralConverterPage() {
  return (
    <ToolPageWrapper slug="roman-numeral-converter">
      <RomanNumeralConverterTool />
    </ToolPageWrapper>
  );
}
