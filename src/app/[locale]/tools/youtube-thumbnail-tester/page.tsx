import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { YouTubeThumbnailTesterTool } from './YouTubeThumbnailTesterTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('youtube-thumbnail-tester')!);
}

export default function YouTubeThumbnailTesterPage() {
  return (
    <ToolPageWrapper slug="youtube-thumbnail-tester">
      <YouTubeThumbnailTesterTool />
    </ToolPageWrapper>
  );
}
