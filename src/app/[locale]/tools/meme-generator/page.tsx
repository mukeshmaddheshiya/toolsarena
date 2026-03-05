import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { MemeGeneratorTool } from './MemeGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('meme-generator')!);
}

export default function MemeGeneratorPage() {
  return (
    <ToolPageWrapper slug="meme-generator">
      <MemeGeneratorTool />
    </ToolPageWrapper>
  );
}
