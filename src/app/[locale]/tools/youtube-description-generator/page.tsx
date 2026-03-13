import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { YoutubeDescriptionGeneratorTool } from './YoutubeDescriptionGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('youtube-description-generator')!);
}

export default function YoutubeDescriptionGeneratorPage() {
  return (
    <ToolPageWrapper slug="youtube-description-generator">
      <YoutubeDescriptionGeneratorTool />
    </ToolPageWrapper>
  );
}
