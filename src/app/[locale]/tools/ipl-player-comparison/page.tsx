import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { IplPlayerComparisonTool } from './IplPlayerComparisonTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('ipl-player-comparison')!);
}
export default function IplPlayerComparisonPage() {
  return (
    <ToolPageWrapper slug="ipl-player-comparison">
      <IplPlayerComparisonTool />
    </ToolPageWrapper>
  );
}
