import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { CssMinifierTool } from './CssMinifierTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('css-minifier')!);
}

export default function CssMinifierPage() {
  return (
    <ToolPageWrapper slug="css-minifier">
      <CssMinifierTool />
    </ToolPageWrapper>
  );
}
