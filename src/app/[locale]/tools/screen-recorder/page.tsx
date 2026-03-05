import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ScreenRecorderTool } from './ScreenRecorderTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('screen-recorder')!);
}

export default function ScreenRecorderPage() {
  return (
    <ToolPageWrapper slug="screen-recorder">
      <ScreenRecorderTool />
    </ToolPageWrapper>
  );
}
