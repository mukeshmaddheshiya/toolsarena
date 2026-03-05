import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { InternetSpeedTool } from './InternetSpeedTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('internet-speed-test')!);
}

export default function InternetSpeedPage() {
  return (
    <ToolPageWrapper slug="internet-speed-test">
      <InternetSpeedTool />
    </ToolPageWrapper>
  );
}
