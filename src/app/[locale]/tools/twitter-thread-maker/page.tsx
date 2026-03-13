import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { TwitterThreadMakerTool } from './TwitterThreadMakerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('twitter-thread-maker')!);
}

export default function TwitterThreadMakerPage() {
  return (
    <ToolPageWrapper slug="twitter-thread-maker">
      <TwitterThreadMakerTool />
    </ToolPageWrapper>
  );
}
