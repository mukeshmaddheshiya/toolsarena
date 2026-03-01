import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { TimezoneCheckerTool } from './TimezoneCheckerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('timezone-checker')!);
}

export default function TimezoneCheckerPage() {
  return (
    <ToolPageWrapper slug="timezone-checker">
      <TimezoneCheckerTool />
    </ToolPageWrapper>
  );
}
