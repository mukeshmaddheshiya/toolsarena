import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { HTMLToMarkdownTool } from './HTMLToMarkdownTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('html-to-markdown')!);
}

export default function HTMLToMarkdownPage() {
  return (
    <ToolPageWrapper slug="html-to-markdown">
      <HTMLToMarkdownTool />
    </ToolPageWrapper>
  );
}
