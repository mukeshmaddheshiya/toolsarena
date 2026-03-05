import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ParaphrasingTool } from './ParaphrasingTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('paraphrasing-tool')!);
}

export default function ParaphrasingToolPage() {
  return (
    <ToolPageWrapper slug="paraphrasing-tool">
      <ParaphrasingTool />
    </ToolPageWrapper>
  );
}
