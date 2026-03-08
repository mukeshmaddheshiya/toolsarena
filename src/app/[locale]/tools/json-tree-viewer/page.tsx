import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { JsonTreeViewerTool } from './JsonTreeViewerTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('json-tree-viewer')!);
}

export default function Page() {
  return (
    <ToolPageWrapper slug="json-tree-viewer">
      <JsonTreeViewerTool />
    </ToolPageWrapper>
  );
}
