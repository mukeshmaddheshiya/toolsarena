import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { SpeedDistanceTimeTool } from './SpeedDistanceTimeTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('speed-distance-time')!);
}

export default function SpeedDistanceTimePage() {
  return (
    <ToolPageWrapper slug="speed-distance-time">
      <SpeedDistanceTimeTool />
    </ToolPageWrapper>
  );
}
