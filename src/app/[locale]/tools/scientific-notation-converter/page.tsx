import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ScientificNotationConverterTool } from './ScientificNotationConverterTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('scientific-notation-converter')!);
}

export default function ScientificNotationConverterPage() {
  return (
    <ToolPageWrapper slug="scientific-notation-converter">
      <ScientificNotationConverterTool />
    </ToolPageWrapper>
  );
}
