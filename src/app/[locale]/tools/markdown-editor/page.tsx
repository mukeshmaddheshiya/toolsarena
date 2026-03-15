import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { MarkdownEditorTool } from './MarkdownEditorTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('markdown-editor')!);
}

export default function MarkdownEditorPage() {
  return (
    <ToolPageWrapper slug="markdown-editor">
      <MarkdownEditorTool />
    </ToolPageWrapper>
  );
}
