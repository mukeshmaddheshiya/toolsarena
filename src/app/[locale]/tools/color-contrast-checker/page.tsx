import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { ColorContrastCheckerTool } from './ColorContrastCheckerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('color-contrast-checker')!);
}

export default function ColorContrastCheckerPage() {
  return (
    <ToolPageWrapper slug="color-contrast-checker">
      <ColorContrastCheckerTool />
    </ToolPageWrapper>
  );
}
