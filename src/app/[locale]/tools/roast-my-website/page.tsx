import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { RoastMyWebsiteTool } from './RoastMyWebsiteTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('roast-my-website')!);
}

export default function RoastMyWebsitePage() {
  return (
    <ToolPageWrapper slug="roast-my-website">
      <RoastMyWebsiteTool />
    </ToolPageWrapper>
  );
}
