import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { FaviconGeneratorTool } from './FaviconGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('favicon-generator')!);
}

export default function FaviconGeneratorPage() {
  return (
    <ToolPageWrapper slug="favicon-generator">
      <FaviconGeneratorTool />
    </ToolPageWrapper>
  );
}
