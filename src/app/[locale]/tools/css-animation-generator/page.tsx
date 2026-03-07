import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CssAnimationGeneratorTool } from './CssAnimationGeneratorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('css-animation-generator')!);
}

export default function CssAnimationGeneratorPage() {
  return (
    <ToolPageWrapper slug="css-animation-generator">
      <CssAnimationGeneratorTool />
    </ToolPageWrapper>
  );
}
