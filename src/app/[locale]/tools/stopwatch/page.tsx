import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { StopwatchTool } from './StopwatchTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('stopwatch')!);
}

export default function StopwatchPage() {
  return (
    <ToolPageWrapper slug="stopwatch">
      <StopwatchTool />
    </ToolPageWrapper>
  );
}
