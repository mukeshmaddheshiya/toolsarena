import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { MorseCodeConverterTool } from './MorseCodeConverterTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('morse-code-converter')!);
}

export default function MorseCodeConverterPage() {
  return (
    <ToolPageWrapper slug="morse-code-converter">
      <MorseCodeConverterTool />
    </ToolPageWrapper>
  );
}
