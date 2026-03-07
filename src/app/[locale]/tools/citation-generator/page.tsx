import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CitationGeneratorTool } from './CitationGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('citation-generator')!);
}

export default function CitationGeneratorPage() {
  return (
    <ToolPageWrapper slug="citation-generator">
      <CitationGeneratorTool />
    </ToolPageWrapper>
  );
}
