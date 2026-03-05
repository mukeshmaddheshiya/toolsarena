import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { SvgToPngTool } from './SvgToPngTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('svg-to-png')!);
}

export default function SvgToPngPage() {
  return (
    <ToolPageWrapper slug="svg-to-png">
      <SvgToPngTool />
    </ToolPageWrapper>
  );
}
