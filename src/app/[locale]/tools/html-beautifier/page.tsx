import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { HtmlBeautifierTool } from './HtmlBeautifierTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('html-beautifier')!);
}

export default function HtmlBeautifierPage() {
  return (
    <ToolPageWrapper slug="html-beautifier">
      <HtmlBeautifierTool />
    </ToolPageWrapper>
  );
}
