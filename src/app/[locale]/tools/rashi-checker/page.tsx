import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { RashiCheckerTool } from './RashiCheckerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('rashi-checker')!);
}

export default function RashiCheckerPage() {
  return (
    <ToolPageWrapper slug="rashi-checker">
      <RashiCheckerTool />
    </ToolPageWrapper>
  );
}
