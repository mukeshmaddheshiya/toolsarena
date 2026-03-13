import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { HtmlMinifierTool } from './HtmlMinifierTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('html-minifier')!);
}

export default function HtmlMinifierPage() {
  return (
    <ToolPageWrapper slug="html-minifier">
      <HtmlMinifierTool />
    </ToolPageWrapper>
  );
}
