import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/lib/tools-registry';
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper';
import { JSONFormatterTool } from './JSONFormatterTool';

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(getToolBySlug('json-formatter')!);
}

export default function JSONFormatterPage() {
  return (
    <ToolPageWrapper slug="json-formatter">
      <JSONFormatterTool />
    </ToolPageWrapper>
  );
}
