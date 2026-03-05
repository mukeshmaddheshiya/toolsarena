import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { IplPointsTableTool } from './IplPointsTableTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('ipl-points-table')!);
}
export default function IplPointsTablePage() {
  return (
    <ToolPageWrapper slug="ipl-points-table">
      <IplPointsTableTool />
    </ToolPageWrapper>
  );
}
