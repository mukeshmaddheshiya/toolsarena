import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { IplMatchScheduleTool } from './IplMatchScheduleTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('ipl-match-schedule')!);
}
export default function IplMatchSchedulePage() {
  return (
    <ToolPageWrapper slug="ipl-match-schedule">
      <IplMatchScheduleTool />
    </ToolPageWrapper>
  );
}
